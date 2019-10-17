const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN', 'GESTOR', 'GESTOR2', 'GESTOR3', 'BASICO'],
    message: '{VALUE} no es un rol válido'
}

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es un campo requerido']
    },
    apellidos: {
        type: String,
        required: [true, 'Los apellidos son un campo requerido']
    },
    email: {
        type: String,
        required: [true, ' El email es un campo requerido'],
        unique: true
    },
    telefono: {
        type: String,
        required: [true, ' El teléfono de contacto es un campo requerido'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'El password es un campo requerido']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'BASICO',
        enum: rolesValidos
    },
    verificado: {
        type: Boolean,
        default: false,
        required: true
    },
    google: {
        type: Boolean,
        default: false
    },
    centro: {
        type: Schema.Types.ObjectId,
        ref: 'Centro',
        required: false
    },
    ultimaConexion: {
        type: Date
    }
});
// usuarioSchema.methods.toJSON = function() {
//     let user = this;
//     let userObject = user.toObject();
//     delete userObject.password;
//     console.log(userObject)
//     return userObject;
// }

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

module.exports = mongoose.model('Usuario', usuarioSchema)