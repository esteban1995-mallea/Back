const metereologiaModel = require("../models/metereologia");
var bodyParser = require("body-parser");

module.exports = {
  getAll: function(req, res, next) {
    let metereologiaList = [];
    metereologiaModel.find({}, function(err, metereologias) {
      if (err) {
        next(err);
      } else {
        for (let metereologia of metereologias) {
          metereologiaList.push({
            id: metereologia._id,
            humedad: metereologia.humedad,
            direccion_viento: metereologia.direccion_viento,
            temperatura: metereologia.temperatura,
            velocidad_viento: metereologia.velocidad_viento,
            irradianza_solar: metereologia.irradianza_solar,
            numero_estacion: metereologia.numero_estacion,
            fecha: metereologia.fecha
          });
        }
        res.json({
          status: "success",
          message: "lista encontrada",
          data: {metereologias: metereologiaList}
        });
      }
    });
  },

  fechasrango: function(req, res, next) {
    let metereologiaList = [];
    metereologiaModel.find({}, function(err, metereologias) {
      if (err) {
        next(err);
      } else {
        for (let metereologia of metereologias) {
          metereologiaList.push(metereologia.fecha);
        }

        var max = new Date(Math.max(...metereologiaList));
        var min = new Date(Math.min(...metereologiaList));

        let metereologiaListfecha = [];

        let date = ("0" + max.getDate()).slice(-2);
        let month = ("0" + (max.getMonth() + 1)).slice(-2);
        let year = max.getFullYear();
        let fecha_data = year + "-" + month + "-" + date;

        let date1 = ("0" + min.getDate()).slice(-2);
        let month1 = ("0" + (min.getMonth() + 1)).slice(-2);
        let year1 = min.getFullYear();
        let fecha_data1 = year1 + "-" + month1 + "-" + date1;

        metereologiaListfecha.push(fecha_data1);
        metereologiaListfecha.push(fecha_data);

        res.json({
          status: "success",
          message: "lista encontrada",
          data: {metereologias: metereologiaListfecha}
        });
      }
    });
  },

  create: function(req, res, next) {
    var fecha_actual = Date.now();

    var metereologiaData = new metereologiaModel();
    metereologiaData.direccion_viento = req.body.direccion_viento;
    metereologiaData.humedad = req.body.humedad;
    metereologiaData.velocidad_viento = req.body.velocidad_viento;
    metereologiaData.temperatura = req.body.temperatura;
    metereologiaData.irradianza_solar = req.body.irradianza_solar;
    metereologiaData.numero_estacion = req.body.numero_estacion;
    metereologiaData.fecha = fecha_actual;

    var myData = new metereologiaModel(metereologiaData);
    myData.save().then(item => {
      res.status(200).send("datos recididos");
    });
  },

  obtener_fecha: function(req, res, next) {
    let date_ob = new Date();

    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let fecha_data = year + "-" + month + "-" + date;

    metereologiaModel.find({fecha: {$gt: fecha_data}}, function(err, userInfo) {
      if (err) {
        next(err);
      } else {
        res.json({
          status: "success",
          message: "Datos encontrados ",
          data: {metereologias: userInfo}
        });
      }
    });
  },

  obtener_fecha_filtradas: function(req, res, next) {
    console.log(req.body);

    let min = req.body.min;
    let max = req.body.max;

    console.log(min);

    metereologiaModel.find({fecha: {$gte: min, $lte: max}}, function(
      err,
      userInfo
    ) {
      if (err) {
        next(err);
      } else {
        res.json({
          status: "success",
          message: "Datos encontrados ",
          data: {metereologias: userInfo}
        });
      }
    });
  },

  ultimodato: function(req, res, next) {
    let metereologiaList = [];

    metereologiaModel.find({}, function(err, metereologias) {
      if (err) {
        next(err);
      } else {
        for (let metereologia of metereologias) {
          metereologiaList.push({
            id: metereologia._id,
            humedad: metereologia.humedad,
            direccion_viento: metereologia.direccion_viento,
            temperatura: metereologia.temperatura,
            velocidad_viento: metereologia.velocidad_viento,
            irradianza_solar: metereologia.irradianza_solar,
            numero_estacion: metereologia.numero_estacion,
            fecha: metereologia.fecha
          });
        }

        metereologiaList.sort(
          (a, b) => new Date(a.fechas) > new Date(b.fechas)
        );
        let length=metereologiaList.length
        console.log(metereologiaList[length-1])
      //  var max = new Date(Math.max(...metereologiaList.fecha));

        let metereologiaList2 = metereologiaList[length-1];
      //  metereologiaList2.push(max);

        res.json({
          status: "success",
          message: "lista encontrada",
          data: {metereologias: metereologiaList2}
        });
      }
    });
  }
};
