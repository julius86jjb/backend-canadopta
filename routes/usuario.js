var express = require('express');
var app = express();
const bcrypt = require('bcrypt');

var mdAuteticacion = require('../middlewares/autenticacion');


const Usuario = require('../models/usuario');


// =========================================================
// GET USUARIOS: Obtener listado de usuarios
// =========================================================

app.get('/', [mdAuteticacion.verificaToken, mdAuteticacion.verificaADMIN], (req, res, next) => {

    var desde = req.query.desde || 0; //parametro opcional, si viene algo en el query, lo asignamos, sino, 0
    desde = Number(desde);

    Usuario.find({}, 'nombre apellidos email telefono img role verificado google centro ultimaConexion ')
        .skip(desde)
        .limit(10)
        .exec(
            (err, usuarios) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Error get usuarios',
                        errors: err
                    });
                }

                Usuario.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        usuarios: usuarios

                    });
                });


            }
        )
})


// =========================================================
// POST USUARIO: Crear un nuevo usuario
// =========================================================


app.post('/', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        apellidos: body.apellidos,
        email: body.email,
        telefono: body.telefono,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        img: body.img,
        verificado: false,
        centro: body.centro,
        ultimaConexion: Date.now()


    })

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear Usuario',
                errors: err
            })
        }

        usuarioDB.password = ':)';

        res.status(201).json({
            ok: true,
            usuario: usuarioDB
        })
    })

})



// =========================================================
// Actualizar un usuario
// =========================================================


app.put('/:id', [mdAuteticacion.verificaToken, mdAuteticacion.verificaADMIN_o_MismoUsuario], (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            })
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: { message: ' No existe un usuario con ese ID' }
            })
        }

        usuario.nombre = body.nombre;
        usuario.apellidos = body.apellidos;
        usuario.telefono = body.telefono;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                })
            }

            usuarioGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        })

    })

})


// =========================================================
// Borrar un usuario
// =========================================================


app.delete('/:id', [mdAuteticacion.verificaToken, mdAuteticacion.verificaADMIN_o_MismoUsuario], function(req, res) {

    let id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            })
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID',
                errors: {
                    message: 'No existe un usuario con ese ID'
                }
            })
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    })
})

module.exports = app;