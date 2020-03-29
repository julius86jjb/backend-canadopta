var express = require('express');
var app = express();
const bcrypt = require('bcrypt');
const fs = require('fs');

var mdAuteticacion = require('../middlewares/autenticacion');

const jwt = require('jsonwebtoken');
var FE_URL = require('../config/config').FE_URL;

var promisedHandlebars = require("promised-handlebars");
var Q = require("q");
var Handlebars = promisedHandlebars(require("handlebars"), {
    Promise: Q.Promise
});


const Usuario = require('../models/usuario');
const TokenVerificaEmail = require('../models/tokenVerificaEmail');

const nodemailer = require("nodemailer");
var crypto = require('crypto');


var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "julius.1986@gmail.com",
        pass: "vvthdvzjmtdcefnd"
    },
    tls: {
        rejectUnauthorized: false
    }
});


Handlebars.registerHelper("helper", function(value) {
    return Q.delay(100).then(function() {
        return value;
    });
});


// =========================================================
// GET USUARIOS: Obtener listado de usuarios
// =========================================================

app.get('/', [mdAuteticacion.verificaToken, mdAuteticacion.verificaADMIN], (req, res, next) => {

    var desde = req.query.desde || 0; //parametro opcional, si viene algo en el query, lo asignamos, sino, 0
    desde = Number(desde);

    Usuario.find({}, 'nombre apellidos email telefono img role verificado google ultimaConexion ')
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
// GET USUARIOS: Obtener listado de usuarios coincidentes con un email
// =========================================================

app.get('/verificaEmailDisponible/:email', (req, res, next) => {
    let email = req.params.email;
    Usuario.count({ email: email }, (err, conteo) => {
        res.status(200).json({
            ok: true,
            total: conteo

        });
    });

})


// =========================================================
// POST USUARIO: Crear un nuevo usuario
// =========================================================


var readHTMLFile = function(path, callback) {
    fs.readFile(path, { encoding: "utf-8" }, function(err, html) {
        if (err) {
            throw err;
            callback(err);
        } else {
            callback(null, html);
        }
    });
};



function enviarEmailActivacion(user, res) {

    var token = new TokenVerificaEmail({
        _usuarioID: user._id,
        token: crypto.randomBytes(16).toString('hex')
    });

    token.save((err, tokenDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Inténtelo de nuevo más tarde',
                errors: { message: 'Error al guardar el token de activacion' }
            });
        }
        if (tokenDB) {


            let confirmationUrl = FE_URL + `/confirmar_email/${user._id}`;



            readHTMLFile(
                "./assets/confirmarEmailTemplate/confirmar_email.html",
                (err, html) => {

                    if (err) throw err;

                    var template = Handlebars.compile(html);
                    template({
                            user: user.nombre + ' ' + user.apellidos,
                            link: confirmationUrl

                        })
                        .then(template => {

                            (mailOptions = {
                                to: user.email,
                                subject: "CANADOPTA - Confirmar email",
                                html: template
                            }),
                            smtpTransport.sendMail(mailOptions, err => {
                                if (err) {

                                    return res.status(500).json({
                                        ok: false,
                                        mensaje: 'Inténtelo de nuevo más tarde',
                                        errors: { message: 'Error al mandar el email' }
                                    });
                                } else {

                                    return res.status(200).json({
                                        ok: true,
                                        mensaje: 'Un email ha sido enviado a' + user.email,
                                        usuario: user

                                    });

                                }
                            });
                        });
                }
            );
        }
    });
}

// app.post('/', function(req, res) {
//     console.log('entra en back');
//     let body = req.body;
//     let usuario = new Usuario({
//         nombre: body.nombre,
//         apellidos: body.apellidos,
//         email: body.email,
//         telefono: body.telefono,
//         password: bcrypt.hashSync(body.password, 10),
//         role: body.role,
//         img: body.img,
//         verificado: false,
//         ultimaConexion: Date.now()


//     })

//     usuario.save((err, usuarioDB) => {
//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 mensaje: 'Inténtelo de nuevo más tarde',
//                 errors: { message: 'Error al guardar el usuario' }
//             })
//         }
//         if (usuarioDB) {

//             enviarEmailActivacion(usuarioDB, res);

//         }
//     })

// })

// =========================================================
// Crear Usuarios
// =========================================================

app.post('/', function(req, res) {
    console.log('entra en back');
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
        ultimaConexion: Date.now()


    })

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Inténtelo de nuevo más tarde',
                errors: { message: 'Error al guardar el usuario' }
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
// Reenviar Email Confirmación
// =========================================================

app.get('/reenviar_email/:id', function(req, res, next) {
    let user_id = req.params.id;
    Usuario.findOne({ _id: user_id }, function(err, user) {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Inténtelo nuevamente en unos minutos',
                errors: { message: 'Error al buscar el usuario' }
            })
        }
        if (!user) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Inténtelo nuevamente en unos minutos',
                errors: { message: ' No existe el usuario' }
            });
        }
        if (user.verificado) {
            return res.status(409).json({
                ok: false,
                mensaje: 'Inicie sesión con el email "' + user.email + '"',
                errors: { message: 'Su cuenta ya fue activada anteriormente' }
            });
        }


        if (user) {

            TokenVerificaEmail.deleteMany({ _usuarioID: user._id }, (err, resp) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Inténtelo nuevamente en unos minutos',
                        errors: { message: 'Error al borrar tokens de activación antiguos' }
                    });
                }
                if (resp) {
                    enviarEmailActivacion(user, res);
                }
            });


        }

    })
})




// =========================================================
// Verificar Email Usuario
// =========================================================

app.get('/confirmarEmail/:id', function(req, res) {

    let user_id = req.params.id;

    TokenVerificaEmail.findOne({ _usuarioID: user_id }, (err, tokenDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el token',
                errors: err
            })
        }

        if (!tokenDB) {

            return res.status(414).json({
                ok: false,
                mensaje: 'Su email de activación ha caducado, haga click en el siguiente botón para volver a recibir el email',
                errors: { message: ' No existe el token' },
                user_id: user_id
            });
        }

        Usuario.findOne({ _id: tokenDB._usuarioID }, function(err, usuarioDB) {

            if (!usuarioDB) {
                return res.status(415).json({
                    ok: false,
                    mensaje: 'No ha sido posible encontrar un usuario para este token de verificación',
                    errors: { message: ' No existe el usuario' }
                });
            }

            if (usuarioDB.verificado) {
                return res.status(416).json({
                    ok: false,
                    mensaje: 'La cuenta ya fue activada anteriormente, inicie Sesión con su dirección de email',
                    errors: { message: ' El email ya ha sido confirmado anteriormente' }
                });
            }

            usuarioDB.verificado = true;
            usuarioDB.save((err, usuarioGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'No ha sido posible actualizar el usuario',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    mensaje: 'El email' + usuarioGuardado.email + ' ha sido confirmado!',
                    usuario: usuarioGuardado

                });
            });


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

app.get('/borrarEnRegistro/:id', function(req, res) {

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