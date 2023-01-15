const moongose = require('mongoose');


const subArraySchema = new moongose.Schema({
    barcode: { 
        type: Number, 
        required: true,
        validate: {
            validator: isNonNegative,
            message: 'El barcode debe ser un número no negativo'
         },
    },
    cantidad: { 
        type: Number, 
        required: true,
        validate: {
            validator: isNonNegative,
            message: 'La cantidad debe ser un número no negativo'
        }
    }
});

const productSchema = new moongose.Schema({
    
    numFactura: {
        type: Number,
        required: true,
        validate: {
            validator: isNonNegative,
            message: 'El número de factura debe ser un número no negativo'
        },
    },
    
    clienteDNI: {
        type: Number,
        required: true,
        validate: {
            validator: isNonNegative,
            message: 'El DNI del cliente debe ser un número no negativo'
        },
    },

    productos: {
        type: [subArraySchema],
    },


}, {
    timestamps: true,   // Adds createdAt and updatedAt. createdAt makes sense and may be useful, as it is the date of creation.
    versionKey: false,
});



export default moongose.model('Bills', productSchema);

function isNonNegative(value: Number) { return value >= 0; }
