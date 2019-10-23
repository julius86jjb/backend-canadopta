const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let amplitudAdopcionValido = {
    values: ['Regional', 'Provincial', 'Nacional', 'Continental', 'Internacional'],
    message: '{VALUE} no es una amplitud de adopcion valida'
}

let provinciasValidas = {
    values: ['A Coruña', 'Alava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Avila', 'Badajoz', 'Barcelona', 'Burgos', 'Cáceres',
        'Cádiz', 'Cantabria', 'Castellón', 'Ciudad Real', 'Córdoba', 'Cuenca', 'Gerona', 'Granada', 'Guadalajara',
        'Guipúzcoa', 'Huelva', 'Huesca', 'Islas Baleares', 'Jaén', 'León', 'Lérida', 'Lugo', 'Madrid', 'Málaga', 'Murcia', 'Navarra',
        'Ourense', 'Palencia', 'Las Palmas', 'Pontevedra', 'La Rioja', 'Salamanca', 'Segovia', 'Sevilla', 'Soria', 'Tarragona',
        'Santa Cruz de Tenerife', 'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza'
    ],
    message: '{VALUE} no es una provincia valida'
}

let comunidadesValidas = {
    values: ["Andalucía", "Aragón", "Canarias", "Cantabria", "Castilla y León", "Castilla-La Mancha", "Cataluña", "Ceuta",
        "Comunidad Valenciana", "Comunidad de Madrid", "Extremadura", "Galicia", "Islas Baleares", "La Rioja", "Melilla",
        "Navarra", "País Vasco", "Principado de Asturias", "Región de Murcia"
    ],
    message: '{VALUE} no es una comunidad autónoma valida'
}

let tiposCentrosValidos = {
    values: ['Protectora', 'Albergue', 'Refugio', 'Perrera'],
    message: '{VALUE} no es un tipo de centro valido'
}

let centroSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es un campo requerido']
    },
    tipoCentro: {
        type: String,
        required: [true, 'El tipo de centro es un campo requerido'],
        enum: tiposCentrosValidos
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
    telefono2: {
        type: String,
        unique: true
    },
    web: {
        type: String,
        unique: true
    },
    personaContacto: { type: String, },
    descripcion: { type: String, },
    procesoAdopcion: { type: String, },
    amplitudAdopcion: {
        type: String,
        default: 'Regional',
        enum: amplitudAdopcionValido
    },
    totalAdoptables: {
        type: Number,
        default: 0
    },
    direccion_calle: { type: String },
    direccion_numero: { type: String, },
    direccion_provincia: { type: String, enum: provinciasValidas },
    direccion_comunidad: { type: String, enum: comunidadesValidas },
    direccion_CP: { type: String, },
    mapa_lat: { type: String, },
    mapa_lon: { type: String, },
    logo: { type: String, required: false },
    facebook: { type: String },
    instagram: { type: String },
    twitter: { type: String },
    youtube: { type: String },
    fechaRegistro: {
        type: Date,
        required: true,
        default: Date.now()
    }


});
// usuarioSchema.methods.toJSON = function() {
//     let user = this;
//     let userObject = user.toObject();
//     delete userObject.password;
//     console.log(userObject)
//     return userObject;
// }

centroSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

module.exports = mongoose.model('Centro', centroSchema)