//Cargando el modulo de mongoose
const mongoose = require("mongoose");
//Configurando la conexion para MongoDB, Debemos indicar el puerto y la IP de nuestra BD

const uri =
  "mongodb+srv://Mallea95:g85FX4xTNPlajOgd@cluster0.ffbri.gcp.mongodb.net/Tesis?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on("connected", function() {
  console.log("Conectado con Mongo");
});

// If the connection throws an error
mongoose.connection.on("error", function(err) {
  console.log("Error Mongo:" + err);
});

// When the connection is disconnected
mongoose.connection.on("disconnected", function() {
  console.log("Mongo desconectado");
});

mongoose.Promise = global.Promise;
module.exports = mongoose;
