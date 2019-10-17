// Requires

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables

var app = express();

//  BodyParser

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Conexion DB

mongoose.connection.openUri('mongodb://localhost/canadoptaDB', (err, res) => {
    if (err) throw err;
    console.log('Base de Datos: \x1b[32m%s\x1b[0m', 'online');
});


// Importar rutas
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var appRoutes = require('./routes/app');

// Rutas

app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


// Escuchar Peticiones

app.listen(3001, () => {
    console.log('Express Server escuchando en puerto 3001: \x1b[32m%s\x1b[0m', 'online');
});