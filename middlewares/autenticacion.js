const jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

exports.verificaToken = (req, res, next) => {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;

        next();

        // res.status(201).json({
        //     ok: true,
        //     decoded
        // })

    });



};

exports.verificaADMIN = (req, res, next) => {

    var usuario = req.usuario
    console.log(usuario);
    console.log(usuario.role);
    if (usuario.role === 'ADMIN') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Token no válido - No es Admin'
            },
            errors: { message: 'No es admin' }
        });
    }

};


exports.verificaADMIN_o_MismoUsuario = (req, res, next) => {

    var usuario = req.usuario
    var id = req.params.id;

    if (usuario.role === 'ADMIN' || usuario._id === id) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Token no válido - No es Admin ni es el mismo usuario'
            },
            errors: { message: 'No es admin o mismo usuario' }
        });
    }

};