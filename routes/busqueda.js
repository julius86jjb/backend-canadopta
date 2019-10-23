var express = require('express');
var app = express();

const Centro = require('../models/centro');
const Mascota = require('../models/mascota');
const Usuario = require('../models/usuario');

// ==================================================== //
// Busqueda por collecion
// ==================================================== //

app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var expresionRegular = RegExp(busqueda, 'i');

    var tabla = req.params.tabla;

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, expresionRegular);
            break;
        case 'mascotas':
            promesa = buscarMascotas(busqueda, expresionRegular);
            break;
        case 'centros':
            promesa = buscarCentros(busqueda, expresionRegular);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son mascotas, usuarios y centros',
                err: { mensaje: 'Tabla/coleccion incorrectos' }
            })
            break;
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        })
    })


})





// ==================================================== //
// Busqueda general
// ==================================================== //
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var expresionRegular = RegExp(busqueda, 'i');


    Promise.all([
            buscarCentros(busqueda, expresionRegular),
            buscarMascotas(busqueda, expresionRegular),
            buscarUsuarios(busqueda, expresionRegular)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                centros: respuestas[0],
                mascotas: respuestas[1],
                usuarios: respuestas[2]
            })
        })

});


function buscarCentros(busqueda, expresionRegular) {

    return new Promise((resolve, reject) => {

        Centro.find({ nombre: expresionRegular })
            .populate('usuario', 'nombre email')
            .exec((err, centros) => {

                if (err) {
                    reject('Error al cargar centros', err);
                } else {
                    resolve(centros);
                }


            })
    })

}

function buscarMascotas(busqueda, expresionRegular) {

    return new Promise((resolve, reject) => {

        Mascota.find({ nombre: expresionRegular })
            .populate('usuario', 'nombre email')
            .populate('centro', 'nombre email')
            .exec((err, mascotas) => {

                if (err) {
                    reject('Error al cargar mascotas', err);
                } else {
                    resolve(mascotas);
                }


            })
    })

}

function buscarUsuarios(busqueda, expresionRegular) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email rol  img')
            .or([{ nombre: expresionRegular }, { email: expresionRegular }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al buscar en usuarios', err)
                } else {
                    resolve(usuarios);
                }
            })

    })

}





module.exports = app;