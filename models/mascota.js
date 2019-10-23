const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let mascotasValidas = {
    values: ['Perro', 'Gato'],
    message: '{VALUE} no es un tipo de mascota válido'
}

let tamanosValidos = {
    values: ['Enano', 'Pequeño', 'Mediano', 'Grande', 'Gigante'],
    message: '{VALUE} no es un tamaño de mascota válido'
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


let mascotaSchema = new Schema({

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },

    centro: {
        type: Schema.Types.ObjectId,
        ref: 'Centro',
        required: [true, 'El id del centro es un campo obligatorio']
    },

    provincia: {
        type: String,
        enum: provinciasValidas,
        required: true
    },

    comunidadAutonoma: {
        type: String,
        enum: comunidadesValidas,
        required: true
    },

    nombre: {
        type: String,
        required: [true, 'El nombre es un campo requerido']
    },

    tipo: {
        type: String,
        required: [true, 'El tipo de mascota campo requerido'],
        enum: mascotasValidas
    },

    raza: {
        type: String,
        required: [true, 'La raza es un campo requerido']
    },

    color: {
        type: String,
        required: [true, 'El color es un campo requerido']
    },

    edad: {
        type: String,
        required: [true, 'La edad es un campo requerido']
    },

    tamano: {
        type: String,
        required: [true, 'El tamaño es un campo requerido'],
        enum: tamanosValidos
    },

    peso: {
        type: String,
    },

    descripcion: {
        type: String,
    },

    otrosDatos: {
        type: String,
    },

    esterilizado: {
        type: Boolean,
        default: false,
        required: true
    },
    desparacitado: {
        type: Boolean,
        default: false,
        required: true
    },
    vacunas: {
        type: Boolean,
        default: false,
        required: true
    },
    chip: {
        type: Boolean,
        default: false,
        required: true
    },
    sociable: {
        type: Boolean,
        default: false,
        required: true
    },
    fechaPublicacion: {
        type: Date,
        required: true,
        default: Date.now()
    }



});
// mascotaSchema.methods.toJSON = function() {
//     let user = this;
//     let userObject = user.toObject();
//     delete userObject.password;
//     console.log(userObject)
//     return userObject;
// }

mascotaSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

module.exports = mongoose.model('Mascota', mascotaSchema)