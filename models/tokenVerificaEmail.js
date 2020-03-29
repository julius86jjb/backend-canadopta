const mongoose = require('mongoose');

let Schema = mongoose.Schema;


let tokenVerificaEmailSchema = new Schema({
    _usuarioID: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 3600000
    }
});

module.exports = mongoose.model('TokenVerificaEmail', tokenVerificaEmailSchema)