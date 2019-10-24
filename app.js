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
var centroRoutes = require('./routes/centro');
var mascotaRoutes = require('./routes/mascota');
var loginRoutes = require('./routes/login');
var appRoutes = require('./routes/app');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');

// Rutas

app.use('/usuario', usuarioRoutes);
app.use('/centro', centroRoutes);
app.use('/mascota', mascotaRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);

app.use('/', appRoutes);


// Escuchar Peticiones

app.listen(3001, () => {
    console.log('Express Server escuchando en puerto 3001: \x1b[32m%s\x1b[0m', 'online');
});

//idgooglesingin

// 1023152870500-glc3619p64kein5ep5igdvtfhs7jngkd.apps.googleusercontent.com

// secret id

// fKb-_u-zdRRTEmYxyP70erAF