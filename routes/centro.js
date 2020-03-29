var express = require('express');
var app = express();
const bcrypt = require('bcrypt');

var mdAuteticacion = require('../middlewares/autenticacion');


const Usuario = require('../models/usuario');
const Centro = require('../models/centro');


// =========================================================
// GET CENTRO: Obtener listado de centros
// =========================================================

app.get('/', [mdAuteticacion.verificaToken], (req, res, next) => {

    var desde = req.query.desde || 0; //parametro opcional, si viene algo en el query, lo asignamos, sino, 0
    desde = Number(desde);

    Centro.find({})
        .skip(desde)
        .limit(10)
        .exec(
            (err, centros) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Error get centros',
                        errors: err
                    });
                }

                Centro.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        centros: centros

                    });
                });


            }
        )
})

// =========================================================
// Obtener centro
// =========================================================

app.get('/:id', (req, res, next) => {
    let id = req.params.id;

    Centro.findById(id)
        .exec(
            (err, centro) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Error get centro',
                        errors: err
                    });
                }
                if (!centro) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El centro con el id ' + id + ' no existe',
                        errors: { message: ' No existe un centro con ese ID' }
                    })
                }

                res.status(200).json({
                    ok: true,
                    centro: centro
                });

            }
        )
})

// =========================================================
// POST centro: Crear un nuevo centro
// =========================================================


app.post('/', function(req, res) {

    let body = req.body;

    let centro = new Centro({
        nombre: body.nombre,
        telefono: body.telefono,
        usuario: body.usuario,
        direccion_comunidad: body.direccion_comunidad,
        direccion_provincia: body.direccion_provincia,
        tipoCentro: body.tipoCentro,
        email: body.email,
        telefono2: body.telefono2,
        img: body.img,
        web: body.web,
        personaContacto: body.personaContacto,
        descripcion: body.descripcion,
        procesoAdopcion: body.procesoAdopcion,
        amplitudAdopcion: body.amplitudAdopcion,
        totalAdoptables: body.totalAdoptables,
        direccion_calle: body.direccion_calle,
        direccion_numero: body.direccion_numero,
        direccion_CP: body.direccion_CP,
        mapa_lat: body.mapa_lat,
        mapa_lon: body.mapa_lon,
        logo: body.logo,
        facebook: body.facebook,
        instagram: body.instagram,
        twitter: body.twitter,
        youtube: body.youtube,
        fechaRegistro: Date.now(),
        ultimaConexion: Date.now()
    })

    centro.save((err, centroDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el centro',
                errors: err
            })
        }


        res.status(201).json({
            ok: true,
            centro: centroDB
        })
    })

})



// =========================================================
// Actualizar un centro
// =========================================================


app.put('/:id', [mdAuteticacion.verificaToken, mdAuteticacion.verificaADMIN_o_MismoUsuario], (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Centro.findById(id, (err, centro) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar centro',
                errors: err
            })
        }

        if (!centro) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El centro con el id ' + id + ' no existe',
                errors: { message: ' No existe un centro con ese ID' }
            })
        }

        centro.nombre = body.nombre;
        centro.tipoCentro = body.tipoCentro;
        centro.email = body.email;
        centro.telefono = body.telefono;
        centro.telefono2 = body.telefono2;
        centro.web = body.web;
        centro.personaContacto = body.personaContacto;
        centro.emailPersonaContacto = body.emailPersonaContacto;
        centro.descripcion = body.descripcion;
        centro.procesoAdopcion = body.procesoAdopcion;
        centro.amplitudAdopcion = body.amplitudAdopcion;
        centro.totalAdoptables = body.totalAdoptables;
        centro.direccion_calle = body.direccion_calle;
        centro.direccion_numero = body.direccion_numero;
        centro.direccion_provincia = body.direccion_provincia;
        centro.direccion_comunidad = body.direccion_comunidad;
        centro.direccion_CP = body.direccion_CP;
        centro.mapa_lat = body.mapa_lat;
        centro.mapa_lon = body.mapa_lon;
        centro.facebook = body.facebook;
        centro.instagram = body.instagram;
        centro.twitter = body.twitter;
        centro.youtube = body.youtube;

        centro.save((err, centroGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar centro',
                    errors: err
                })
            }

            centroGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                centro: centroGuardado
            });

        })

    })

})


// =========================================================
// Borrar un centro
// =========================================================


app.delete('/:id', [mdAuteticacion.verificaToken, mdAuteticacion.verificaADMIN_o_MismoUsuario], function(req, res) {

    let id = req.params.id;

    Centro.findByIdAndRemove(id, (err, centroBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar centro',
                errors: err
            })
        }

        if (!centroBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un centro con ese ID',
                errors: {
                    message: 'No existe un centro con ese ID'
                }
            })
        }

        res.status(200).json({
            ok: true,
            centro: centroBorrado
        });

    })
})

module.exports = app;