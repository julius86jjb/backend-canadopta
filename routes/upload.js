var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

const Usuario = require('../models/usuario');
const Mascota = require('../models/mascota');
const Centro = require('../models/centro');

var app = express();

app.use(fileUpload({ useTempFiles: true }));

app.put('/:tipo/:id', (req, res, next) => {


    var tipo = req.params.tipo;

    var id = req.params.id

    //Tipos de coleccion

    var tiposValidos = ['centros', 'mascotas', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no válido',
            errors: { message: 'Tipo de coleccion no válido' }
        })
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono ningún archivo',
            errors: { message: 'Debe seleccionar una imagen' }
        })
    }

    // Obtener nombre del archivo

    var archivo = req.files.imagen;

    var nombreCortado = archivo.name.split('.');

    var extensionArchivo = nombreCortado[nombreCortado.length - 1];


    var extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];


    // Extensiones validas

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            errors: { message: 'Las extensiones válidas son' + extensionesValidas.join(', ') }
        })
    }

    // Nombre de archivo personalizado

    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // Mover el archivo

    var path = `./uploads/${tipo}/${nombreArchivo}`;
    console.log(path);
    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            })
        }


        subirPorTipo(tipo, id, nombreArchivo, res);
    })

});



function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    usuario: { message: 'usuario no existe' }
                })
            }

            // si el usuario ya tenia iamgen obtenemos el path antiguo y eliminamos imagen anterior
            var pathViejo = './uploads/usuarios/' + usuario.img;

            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen Actualizada',
                    usuario: usuarioActualizado
                })
            })

        })
    }

    if (tipo === 'mascotas') {
        Mascota.findById(id, (err, mascota) => {

            if (!mascota) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Mascota no existe',
                    mascota: { message: 'mascota no existe' }
                })
            }

            // si el usuario ya tenia iamgen obtenemos el path antiguo y eliminamos imagen anterior
            var pathViejo = './uploads/mascotas/' + mascota.img;

            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            mascota.img = nombreArchivo;

            mascota.save((err, mascotaActualizado) => {

                mascotaActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen Actualizada',
                    mascota: mascotaActualizado
                })
            })

        })
    }

    if (tipo === 'centros') {
        Centro.findById(id, (err, centro) => {

            if (!centro) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Centro no existe',
                    centro: { message: 'centro no existe' }
                })
            }

            // si el usuario ya tenia iamgen obtenemos el path antiguo y eliminamos imagen anterior
            var pathViejo = './uploads/centros/' + centro.img;

            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            centro.img = nombreArchivo;

            centro.save((err, centroActualizado) => {

                centroActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen Actualizada',
                    centro: centroActualizado
                })
            })

        })
    }
}

module.exports = app;