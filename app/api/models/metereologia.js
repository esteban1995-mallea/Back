// Cargamos el módulo de mongoose
const mongoose = require('mongoose');
//Definimos los esquemas
const Schema = mongoose.Schema;
// Creamos el objeto del esquema con sus correspondientes campos
const MetereologiaSchema = new Schema({
 velocidad_viento: {
  type: Number,
 },
 humedad: {
  type: Number,
 },
 direccion_viento: {
  type: Number,
 },
 temperatura: {
  type: Number,
 },
 irradianza_solar: {
  type: Number,
  },
  numero_estacion: {
   type: Number,
 },
  fecha: {
   type: Date,
   default:Date.now,
  }
});

// Exportamos el modelo para usarlo en otros ficheros
module.exports = mongoose.model('Metereologia', MetereologiaSchema);
