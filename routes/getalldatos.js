// Cargamos el modulo express
const express = require('express');
const router = express.Router();
// Cargamos el controlador de videojuegos
const metereologiaController = require('../app/api/controllers/metereologia');
// Especificamos nuestras rutas teniendo en cuenta los metodos creados en nuestro controlador
router.get('/getall', metereologiaController.getAll);
router.get('/obtenerfechas', metereologiaController.obtener_fecha);
router.get('/rangofechas', metereologiaController.fechasrango);
router.post('/fechasfiltradas', metereologiaController.obtener_fecha_filtradas);
router.get('/ultimodato', metereologiaController.ultimodato);




module.exports = router;
