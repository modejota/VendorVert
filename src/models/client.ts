const mongoose = require('mongoose');
import { Constants as C } from '../constants/constants';

const productSchema = new mongoose.Schema({
    DNI: {
        type: Number,
        required: true,
        validate: {
            validator: isNonNegative,
            message: 'El DNI debe ser un número no negativo'
        },
    },

    nombre: {
        type: String,
        required: true,
        minlenght: C.LON_NOMBRE_CLIENTE_MIN,
        maxlenght: C.LON_NOMBRE_CLIENTE_MAX,
    },

    apellidos: {
        type: String,
        required: true,
        minlenght: C.LON_APELLIDOS_CLIENTE_MIN,
        maxlenght: C.LON_APELLIDOS_CLIENTE_MAX,
    },

    email: {
        type: String,
        required: true,
        validate: {
            validator: isEmail,
            message: 'El email no tiene un formato válido'
        },
    },

}, {
    timestamps: true,   // Adds createdAt and updatedAt. createdAt makes sense and may be useful, as it is the date of creation.
    versionKey: false,
});

export default mongoose.model('Clients', productSchema);

function isNonNegative(value: Number) { return value >= 0; }
function isEmail(value: string) { return C.EMAIL_REGEX.test(value); }   // It is doubled-checked in the API.

