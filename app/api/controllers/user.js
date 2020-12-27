// Cargamos el modelo recien creado
const userModel = require("../models/user");
// Cargamos el módulo de bcrypt
const bcrypt = require("bcrypt");
// Cargamos el módulo de jsonwebtoken
const jwt = require("jsonwebtoken");

// Codificamos las operaciones que se podran realizar con relacion a los usuarios
module.exports = {
  getById: function(req, res, next) {

    userModel.findById(req.params._Id, function(err, userInfo) {
      if (err) {
        next(err);
      } else {
        res.json({
          status: "success",
          message: "usuario encontrado",
          data: {user: userInfo}
        });
      }
    });
  },

  getall: function(req, res, next) {
    let userList = [];
    userModel.find({}, function(err, userInfo) {
      if (err) {
        next(err);
      } else {
        for (let user of userInfo) {
          userList.push({
            id: user._id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            password: user.password,
            admin: user.admin
          });
        }
        res.json({
          status: "success",
          message: "lista encontrada",
          data: {users: userList}
        });
      }
    });
  },

  create: function(req, res, next) {
    userModel.create(
      {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        password: req.body.password,
        admin: false
      },
      function(err, result) {
        if (err) next(err);
        else userModel.save;
        res.json({
          status: "success",
          message: "Usuario agregado exitosamente!!!",
          data: 0
        });
      }
    );
  },

  updateById: function(req, res, next) {

    let user_id = req.body.id;
    userModel.findByIdAndUpdate(
      user_id,
      {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        password: req.body.password,
        admin: req.body.admin,
      },
      function(err, UpdateInfo) {
        if (err) next(err);
        else {
          res.json({
            status: "success",
            message: "Usuario actualizado",
            data: null
          });
        }
      }
    );
  },

  //Metodo para eliminar algun registro de la base de datos por ID
  deleteById: function(req, res, next) {
  

    userModel.findByIdAndRemove(req.body.id, function(err, DeleteInfo) {
      if (err) next(err);
      else {
        res.json({status: "success", message: "Usuario eliminado", data: null});
      }
    });
  },

  authenticate: function(req, res, next) {
    userModel.findOne({email: req.body.email}, function(err, userInfo) {
      if (err) {
        next(err);
      } else {
        if (bcrypt.compareSync(req.body.password, userInfo.password)) {
          const token = jwt.sign({id: userInfo._id}, req.app.get("secretKey"), {
            expiresIn: "1h"
          });
          res.json({
            status: "Ok",
            message: "El usuario ha sido autenticado!!!",
            data: {user: userInfo, token: token}
          });
        } else {
          res.json({
            status: "error",
            message: "Invalido email/password!!",
            data: null
          });
        }
      }
    });
  }
};
