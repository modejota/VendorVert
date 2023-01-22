import server from '../app';
import { ProductType } from '../models/product_type';
import mongoose from 'mongoose'

//Está pensado para lanzarse de forma independiente al compose. De ahí que la URL de la base de datos sea localhost, puerto 27017 expuesto
beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/vendorvert_tests')
    .then(() => {
        console.log('MongoDB connected...') })
    .catch(err => {
        console.log(err)
    });
    mongoose.set('strictQuery', false);
});

afterAll(async () => {
    //Drop the testing database after all tests are done.
    //Native dropDatabase() didnt work, so I had to delete all collections manually, not the database itself
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
    await mongoose.connection.close();
});

let nonExistingID = 9029
let anotherQuantity = 1031
let aProduct = {
    id: 1,
    nombre: "Producto 1 de ejemplo",
    marca: "Marca 1 de ejemplo",
    tipo: ProductType.JOYERIA_ORO,
    PVP: 149.90,
    cantidad: 10
}
let modifyingProductData = {
    nombre: "Producto 1 de ejemplo modificado",
    marca: "Marca 1 de ejemplo modificado",
    tipo: ProductType.JOYERIA_PLATA,
    PVP: 59.90,
    cantidad: 5
}
let aInvoice = {
    id: 1,
    fecha: '2022-12-15',    // YYYY-MM-DD
    productos: [
        {
            id: 1,
        }
    ],
    cliente: 1
}
let aClient = {
    id: 1,
    nombre: "Cliente 1 de ejemplo",
    apellidos: "Apellidos 1 de ejemplo",
    email: "emaildeejemplo@fake.com"
}
let modifyingClientData = {
    nombre: "Cliente 1 modificado", //ID not needed, it's the same and it's specified in the URL
    apellidos: "Apellidos 1 modificado",
    email: "mailmodified@fake.com"
}
let anotherClient = {
    id: 2,
    nombre: "Cliente 2 de ejemplo",
    apellidos: "Apellidos 2 de ejemplo",
    email: "emailfakesuperfake@fake.com"
}

describe('Tests de la API REST', () => {

    describe('Ruta por defecto y de estado', () => {

        it ('Ruta por defecto', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/'
            })
            expect(response.statusCode).toBe(200)
            expect(response.json()).toEqual({ greeting: 'Welcome to VendorVert API' })
        })
    
        it ('Ruta de estado', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/status'
            })
            expect(response.statusCode).toBe(200)
            expect(response.json()).toEqual({ hello: 'I am live!' })
        })

    })

    describe('Relativos al inventario', () => {

        it ('Debería POSTear un producto', async () => {
            const response = await server.inject({
                method: 'POST',
                url: '/products',
                payload: aProduct,
            });
            expect(response.statusCode).toBe(201);
            expect(response.headers['location']).toEqual(`/products/${aProduct.id}`)
        })

        it ('Debería fallar al POSTear un producto ya existente', async () => { 
            const response = await server.inject({
                url: "/products",
                method: 'POST',
                payload: aProduct,
            });
            expect(response.statusCode).toBe(409);
        })

        it ('Debería devolver un producto (GET)', async () => {
            const response = await server.inject({
                url: `/products/${aProduct.id}`,
                method: 'GET',
            });
            expect(response.statusCode).toBe(200);
        })

        it ('Debería fallar al acceder (GET) a un producto no existente', async () => {
            const response = await server.inject({
                url: `/products/${nonExistingID}`,
                method: 'GET',
            });
            expect(response.statusCode).toBe(404);
        })

        it ('Debería devolver todos los productos (GET)', async () => {
            const response = await server.inject({
                url: '/products',
                method: 'GET',
            });
            expect(response.statusCode).toBe(200);
            // Not checking the content of the response, as it would need tons of boilerplate code
        })

        it ('Debería modificar un producto (PUT)', async () => {
            const response = await server.inject({
                url: `/products/${aProduct.id}`,
                method: 'PUT',
                payload: modifyingProductData,
            });
            expect(response.statusCode).toBe(200);
        })

        it ('Debería crear un nuevo producto al intentar modificar (PUT) uno no existente', async () => {
            const response = await server.inject({
                url: `/products/${nonExistingID}`,
                method: 'PUT',
                payload: modifyingProductData,
            });
            expect(response.statusCode).toBe(201);
            expect(response.headers['location']).toEqual(`/products/${nonExistingID}`)
        })

        it ('Debería modificar la cantidad de un producto (PATCH)', async () => {
            const response = await server.inject({
                url: `/products/${aProduct.id}`,
                method: 'PATCH',
                payload: {cantidad: anotherQuantity},
            });
            expect(response.statusCode).toBe(200);
        })

        it ('Debería DELETEar un producto', async () => {
            const response = await server.inject({
                url: `/products/${nonExistingID}`,
                method: 'DELETE',
            });
            expect(response.statusCode).toBe(200);
        })

        it ('Debería fallar al DELETEar un producto no existente', async () => {
            const response = await server.inject({
                url: `/products/${nonExistingID}`,
                method: 'DELETE',
            });
            expect(response.statusCode).toBe(404);
        })

        it ('Debería fallar al modificar la cantidad de un producto (PATCH) no existente', async () => {
            const response = await server.inject({
                url: `/products/${nonExistingID}`,
                method: 'PATCH',
                payload: {cantidad: anotherQuantity},
            });
            expect(response.statusCode).toBe(404);
        })

    })
    
    describe('Relativos a los datos de clientes', () => {
       it ('Debería POSTear un cliente', async () => {
            const response = await server.inject({
                url: '/clients',
                method: 'POST',
                payload: aClient,
            });
            expect(response.statusCode).toBe(201);

            const response2 = await server.inject({
                url: '/clients',
                method: 'POST',
                payload: anotherClient,
            });
            expect(response2.statusCode).toBe(201);
        })

        it ('Debería fallar al POSTear un cliente con ID ya existente', async () => {
            const response = await server.inject({
                url: '/clients',
                method: 'POST',
                payload: aClient,
            });
            expect(response.statusCode).toBe(409);
        })

        it ('Debería GETear un cliente', async () => {
            const response = await server.inject({
                url: `/clients/${aClient.id}`,
                method: 'GET',
            });
            expect(response.statusCode).toBe(200);
        })

        it ('Debería fallar al GETear un cliente no existente', async () => {
            const response = await server.inject({
                url: `/clients/${nonExistingID}`,
                method: 'GET',
            });
            expect(response.statusCode).toBe(404);
        })

        it ('Debería GETear todos los clientes', async () => {
            const response = await server.inject({
                url: '/clients',
                method: 'GET',
            });
            expect(response.statusCode).toBe(200);
        })

        it ('Debería modificar un cliente (PUT)', async () => {
            const response = await server.inject({
                url: `/clients/${aClient.id}`,
                method: 'PUT',
                payload: modifyingClientData,
            });
            expect(response.statusCode).toBe(200);
        })

        it ('Debería crear un cliente no existente (PUT)', async () => {
            const response = await server.inject({
                url: `/clients/${nonExistingID}`,
                method: 'PUT',
                payload: modifyingClientData,
            });
            expect(response.statusCode).toBe(201);
        })

        it ('Debería borrar un cliente (DELETE)', async () => {
            const response = await server.inject({
                url: `/clients/${anotherClient.id}`,
                method: 'DELETE',
            });
            expect(response.statusCode).toBe(200);
        })

    })

    describe('Relativos a las facturas', () => {

        it ('Debería POSTear una factura vacía', async () => {
            // Need a client, as default one was deleted
            const notGonnaBeUsed = await server.inject({
                url: '/clients',
                method: 'POST',
                payload: aClient,
            });

            const response = await server.inject({
                url: '/invoices',
                method: 'POST',
                payload: {id: aInvoice.id, idc: aClient.id},
            });
            //expect(response.statusCode).toBe(201);
            expect(response.headers['location']).toEqual(`/invoices/${aInvoice.id}`)
        })

        it ('Debería fallar al POSTear una factura ya existente', async () => {
            const response = await server.inject({
                url: "/invoices",
                method: 'POST',
                payload: {id: aInvoice.id, idc: aInvoice.id},
            });
            expect(response.statusCode).toBe(409);
        })

        it ('Debería POSTear un producto a una factura', async () => {
            const response = await server.inject({
                url: `/invoices/${aInvoice.id}`,
                method: 'POST',
                payload: {barcode: aProduct.id, cantidad: aProduct.cantidad},
            });
            expect(response.statusCode).toBe(201);
            expect(response.headers['location']).toEqual(`/invoices/${aInvoice.id}/products/${aProduct.id}`)
        })
        
        it ('Debería fallar al modificar un producto existente mediante POST', async () => {
            const response = await server.inject({
                url: `/invoices/${aInvoice.id}`,
                method: 'POST',
                payload: {barcode: aProduct.id, cantidad: anotherQuantity},
            });
            expect(response.statusCode).toBe(409);
        })

        it ('Debería obtener todas las facturas (GET)', async () => {
            const response = await server.inject({
                url: '/invoices',
                method: 'GET',
            });
            expect(response.statusCode).toBe(200);
            // Not checking the content of the response, as it would need tons of boilerplate code
        })

        it ('Debería obtener una factura (GET)', async () => {
            const response = await server.inject({
                url: `/invoices/${aInvoice.id}`,
                method: 'GET',
            });
            expect(response.statusCode).toBe(200);
        })

        it ('Debería fallar al obtener una factura (GET) no existente', async () => {
            const response = await server.inject({
                url: `/invoices/${nonExistingID}`,
                method: 'GET',
            });
            expect(response.statusCode).toBe(404);
        })

        it ('Debería obtener un producto de una factura (GET)', async () => {
            const response = await server.inject({
                url: `/invoices/${aInvoice.id}/products/${aProduct.id}`,
                method: 'GET',
            });
            expect(response.statusCode).toBe(200);
        })

        it ('Debería obtener todos los productos de una factura (GET)', async () => {
            const response = await server.inject({
                url: `/invoices/${aInvoice.id}/products`,
                method: 'GET',
            });
            expect(response.statusCode).toBe(200);
        })

        it ('Debería fallar al obtener un producto no existente de una factura (GET)', async () => {
            const response = await server.inject({
                url: `/invoices/${aInvoice.id}/products/${nonExistingID}`,
                method: 'GET',
            });
            expect(response.statusCode).toBe(404);
        })

        it ('Debería obtener el importe total de una factura (GET)', async () => {
            const response = await server.inject({
                url: `/invoices/${aInvoice.id}/total`,
                method: 'GET',
            });
            expect(response.statusCode).toBe(200);
        })

        it ('Debería fallar al obtener el importe total de una factura (GET) no existente', async () => {
            const response = await server.inject({
                url: `/invoices/${nonExistingID}/total`,
                method: 'GET',
            });
            expect(response.statusCode).toBe(404);
        }) 

        it ('Debería actualizar la cantidad de un producto de una factura (PATCH)', async () => {
            const response = await server.inject({
                url: `/invoices/${aInvoice.id}/products/${aProduct.id}`,
                method: 'PATCH',
                payload: {cantidad: anotherQuantity},
            });
            expect(response.statusCode).toBe(200);
        })

        it ('Debería fallar al actualizar la cantidad de un producto de una factura (PATCH) no existente', async () => {
            const response = await server.inject({
                url: `/invoices/${aInvoice.id}/products/${nonExistingID}`,
                method: 'PATCH',
                payload: {cantidad: anotherQuantity},
            });
            expect(response.statusCode).toBe(404);
        })

        it ('Debería borrar un producto de una factura (DELETE)', async () => {
            const response = await server.inject({
                url: `/invoices/${aInvoice.id}/products/${aProduct.id}`,
                method: 'DELETE',
            });
            expect(response.statusCode).toBe(200);
        })

        it ('Debería fallar al borrar un producto de una factura (DELETE) no existente', async () => {
            const response = await server.inject({
                url: `/invoices/${aInvoice.id}/products/${nonExistingID}`,
                method: 'DELETE',
            });
            expect(response.statusCode).toBe(404);
        })

        // Need some bills to test this, that's why it's here
        it ('Debería obtener el número de facturas de un cliente (GET)', async () => {
            const response = await server.inject({
                url: `/clients/${aClient.id}/invoices`,
                method: 'GET',
            });
            expect(response.statusCode).toBe(200);
        })

        it ('Debería fallar al intentar cambiar el cliente de una factura no existente (PATCH)', async () => {
            const response = await server.inject({
                url: `/invoices/${nonExistingID}/client`,
                method: 'PATCH',
                payload: {id: anotherClient.id},
            });
            expect(response.statusCode).toBe(404);
        })
        
        it ('Debería fallar al actualizar el cliente (no existente) de una factura (PATCH)', async () => {
            const response = await server.inject({
                url: `/invoices/${aInvoice.id}/client`,
                method: 'PATCH',
                payload: {id: anotherClient.id},
            });
            expect(response.statusCode).toBe(404);
        })

        
        it ('Debería fallar al actualizar el cliente (no existente) de una factura (PATCH)', async () => {
            const response = await server.inject({
                url: `/invoices/${aInvoice.id}/client`,
                method: 'PATCH',
                payload: {id: nonExistingID+1}, // +1 to avoid the same ID as the previous test, that created that client
            });
            expect(response.statusCode).toBe(404);
        })
        

        it ('Debería borrar una factura (DELETE)', async () => {
            const response = await server.inject({
                url: `/invoices/${aInvoice.id}`,
                method: 'DELETE',
            });
            expect(response.statusCode).toBe(200);
        })

        it ('Debería fallar al borrar una factura (DELETE) no existente', async () => {
            const response = await server.inject({
                url: `/invoices/${nonExistingID}`,
                method: 'DELETE',
            });
            expect(response.statusCode).toBe(404);
        })

    })
    
})
