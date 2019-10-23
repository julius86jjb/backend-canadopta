var express = require('express');
var app = express();
const bcrypt = require('bcrypt');

var mdAuteticacion = require('../middlewares/autenticacion');


const Usuario = require('../models/usuario');
const Centro = require('../models/centro');
const Mascota = require('../models/mascota');


// =========================================================
// GET MASCOTA: Obtener listado de mascotas
// =========================================================

app.get('/', [mdAuteticacion.verificaToken], (req, res, next) => {

    var desde = req.query.desde || 0; //parametro opcional, si viene algo en el query, lo asignamos, sino, 0
    desde = Number(desde);

    Mascota.find({})
        .populate('usuario', 'nombre email img')
        .populate('centro', 'nombre email')
        .skip(desde)
        .limit(10)
        .exec(
            (err, mascotas) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Error get mascotas',
                        errors: err
                    });
                }

                Mascota.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        mascotas: mascotas

                    });
                });


            }
        )
})

// =========================================================
// Obtener mascota
// =========================================================

app.get('/:id', (req, res, next) => {
    let id = req.params.id;

    Mascota.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('centro', 'nombre email')
        .exec(
            (err, mascota) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Error get mascota',
                        errors: err
                    });
                }
                if (!mascota) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El centro con el id ' + id + ' no existe',
                        errors: { message: ' No existe un centro con ese ID' }
                    })
                }

                res.status(200).json({
                    ok: true,
                    mascota: mascota
                });

            }
        )
})

// =========================================================
// POST mascota: Crear una nueva mascota
// =========================================================


app.post('/', [mdAuteticacion.verificaToken], function(req, res) {

    let body = req.body;

    let mascota = new Mascota({
        usuario: req.usuario._id,
        centro: body.centro,
        nombre: body.nombre,
        tipo: body.tipo,
        raza: body.raza,
        color: body.color,
        edad: body.edad,
        tamano: body.tamano,
        peso: body.peso,
        descripcion: body.descripcion,
        otrosDatos: body.otrosDatos,
        esterilizado: body.esterilizado,
        desparacitado: body.desparacitado,
        vacunas: body.vacunas,
        chip: body.chip,
        sociable: body.sociable,
        fechaPublicacion: Date.now()


    })

    Centro.findById(body.centro, (err, centro) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al buscar el centro',
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

        mascota.provincia = centro.direccion_provincia;
        mascota.comunidadAutonoma = centro.direccion_comunidad;

        mascota.save((err, mascotaDB2) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al crear mascota',
                    errors: err
                })
            }

            res.status(201).json({
                ok: true,
                mascota: mascotaDB2
            })
        })

    })

})



// =========================================================
// Actualizar una mascota
// =========================================================


app.put('/:id', [mdAuteticacion.verificaToken, mdAuteticacion.verificaADMIN_o_MismoUsuario], (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Mascota.findById(id, (err, mascota) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar mascota',
                errors: err
            })
        }

        if (!mascota) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El mascota con el id ' + id + ' no existe',
                errors: { message: ' No existe un mascota con ese ID' }
            })
        }

        mascota.usuario = req.usuario._id;
        mascota.nombre = body.nombre;
        mascota.tipo = body.tipo;
        mascota.raza = body.raza;
        mascota.color = body.color;
        mascota.edad = body.edad;
        mascota.tamano = body.tamano;
        mascota.peso = body.peso;
        mascota.descripcion = body.descripcion;
        mascota.otrosDatos = body.otrosDatos;
        mascota.esterilizado = body.esterilizado;
        mascota.desparacitado = body.desparacitado;
        mascota.vacunas = body.vacunas;
        mascota.chip = body.chip;
        mascota.sociable = body.sociable;

        mascota.save((err, MascotaGuardada) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar mascota',
                    errors: err
                })
            }


            res.status(200).json({
                ok: true,
                mascota: MascotaGuardada
            });

        })

    })

})


// =========================================================
// Borrar una mascota
// =========================================================


app.delete('/:id', [mdAuteticacion.verificaToken, mdAuteticacion.verificaADMIN_o_MismoUsuario], function(req, res) {

    let id = req.params.id;

    Mascota.findByIdAndRemove(id, (err, MascotaBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar mascota',
                errors: err
            })
        }

        if (!MascotaBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un mascota con ese ID',
                errors: {
                    message: 'No existe un mascota con ese ID'
                }
            })
        }

        res.status(200).json({
            ok: true,
            mascota: MascotaBorrada
        });

    })
})

module.exports = app;