// Cargamos el modulo express
const express = require('express');
const router = express.Router();
// Cargamos el controlador de videojuegos
const metereologiaController = require('../app/api/controllers/metereologia');
// Especificamos nuestras rutas teniendo en cuenta los metodos creados en nuestro controlador

router.post('/create', metereologiaController.create);

module.exports = router;
