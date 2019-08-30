// Requires

var express = require('express');
var mongoose = require('mongoose');

// Inicializar variables

var app = express();

// Conexion DB

mongoose.connection.openUri('mongodb://localhost/canadoptaDB', (err, res) => {
    if (err) throw err;
    console.log('Base de Datos: \x1b[32m%s\x1b[0m', 'online');
});

// Rutas

app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    })

});

// Escuchar Peticiones

app.listen(3001, () => {
    console.log('Express Server escuchando en puerto 3001: \x1b[32m%s\x1b[0m', 'online');
});