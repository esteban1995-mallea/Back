//import cors from "cors";
var cors = require('cors')
const express = require("express");
const metereologiaModel = require("./app/api/models/metereologia");
const userModel = require("./app/api/models/user");
const bcrypt = require("bcrypt");
const logger = require("morgan");
const users = require("./routes/user");
const metereologia = require("./routes/metereologia");
const metereologiadatos = require("./routes/getalldatos");
const mongoose = require("./config/database"); //Importando la configuracion de conexion a la BD
var jwt = require("jsonwebtoken");
const app = express();

process.env.TZ = 'America/Santiago' // here is the magical line

const router = express.Router();
var ip = require("ip");
const mqtt = require("mqtt");

app.set("secretKey", "ClaveSecreta"); // Clave Secreta para nuestro JWT


app.use(express.json());
app.use(cors());
app.use(logger("dev"));

app.use("/users", users);

app.use("/metereologias", metereologia); //rutra para create datos de metereologia
app.use("/metereologias/data", validateUser, metereologiadatos); //ruta para obtener datos


/***************************  MQTT     ************************************/
/*******************************************************************************/
var mqtthost = "node02.myqtthub.com";
var options = {
  port: 1883,
  host: "node02.myqtthub.com", // servidor
  clientId: "NODEJS_CLIENT", // ID Cliente
  username: "ClientNodeJS", // Usuario
  password: "ClientNodeJS", // Contraseña
  keepalive: 60
};

let client = mqtt.connect("mqtt://node02.myqtthub.com", options);

client.on("connect", function() {
  console.log("Conexión a MQTT");

  client.subscribe("metereologia/nodemcu1/datos", function(err) {
    console.log("Suscripción Exitosa a todos los topicos");
  });
});

//

client.on("message", function(topic, message) {
  console.log("Topico " + topic + "\nMensaje " + message.toString());
  let obj = JSON.parse(message.toString());

  let fecha_actual = Date.now();

  var metereologiaData = new metereologiaModel();
  metereologiaData.temperatura = obj.Temp;
  metereologiaData.humedad = obj.Humi;
  metereologiaData.direccion_viento = obj.Direc_v;
  metereologiaData.velocidad_viento = obj.Vel_v;
  metereologiaData.irradianza_solar = obj.Irradianza;
  metereologiaData.numero_estacion = 1;
  metereologiaData.fecha = fecha_actual;

  // save model to database
  metereologiaData.save(function(err, res) {
    if (err) return console.error(err);
    console.log(" Dato guardado.");
  });

});


// Para acceder a las rutas de metereologia hemos definido middleware para validar al usuario.
//middleware
function validateUser(req, res, next) {
  console.log(req.headers);
  jwt.verify(req.headers["x-access-token"], req.app.get("secretKey"), function(
    err,
    decoded
  ) {
    if (err) {
      res.json({status: "error", message: err.message, data: null});
    } else {
      // add user id to request
      req.body.userId = decoded.id;
      next();
    }
  });
}

////////////MQTT/////////////////////////////////////////

/////////////////////////////////////////////////////////////

// Manejando errores HTTP 404 para solicitudes de contenido inexistente
app.use(function(req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Manejo de errores, respuestas con codigo HTTP 500, HTTP 404
app.use(function(err, req, res, next) {
  console.log(err);

  if (err.status === 404) res.status(404).json({message: "Not found"});
  else res.status(500).json({message: "Error interno en el servidor!!"});
});
app.listen(5050, function() {
  console.log("El servidor ha sido inicializado: http://localhost:5050");
  console.log(ip.address());
});
