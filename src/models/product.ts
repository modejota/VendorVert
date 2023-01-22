const mongoose = require('mongoose');
import { Constants as C } from '../constants/constants';

const productSchema = new mongoose.Schema({
    barcode: { 
        type: Number, 
        required: true, 
        validate: {
            validator: isNonNegative,
            message: 'El barcode debe ser un número no negativo'
         },
    },

    nombre: { 
        type: String, 
        required: true,
        minlenght: C.LON_NOMBRE_MIN,
        maxlenght: C.LON_NOMBRE_MAX, 
    },

    marca: { 
        type: String, 
        required: true,
        minlenght: C.LON_MARCA_MIN,
        maxlenght: C.LON_MARCA_MAX,
     },

    tipo: { 
        type: Number,   // ProductType enum mapped to int 
        required: true 
    },

    PVP: { 
        type: Number, 
        required: true,
        validate: {
            validator: isNonNegative,
            message: 'El PVP debe ser un número no negativo'
         },
    },

    cantidad: {
        type: Number,
        required: true, // This is not required in the API, but it is required in the database. API defaults to cantidad = 0.
        validate: {
            validator: isNonNegative,
            message: 'La cantidad debe ser un número no negativo'
        },
    }
}, {
	timestamps: true,   // Adds createdAt and updatedAt. May be useful for the user, but it could be removed without problems.
	versionKey: false,
});

export default mongoose.model('Products', productSchema);

function isNonNegative(value: Number) { return value >= 0; }