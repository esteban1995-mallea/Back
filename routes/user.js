// Cargamos el modulo express
const express = require('express');
const router = express.Router();
// Cargamos el controlador del usuario
const userController = require('../app/api/controllers/user');
// Especificamos nuestras rutas teniendo en cuenta los metodos creados en nuestro controlador, y especificando que seran rutas que usaran el metodo POST
router.post('/register', userController.create);
router.post('/getalluser', userController.getall);
router.post('/authenticate', userController.authenticate);
router.post('/delete', userController.deleteById);
router.post('/update', userController.updateById);
router.get('/obtener/:_id', userController.getById);
module.exports = router;
