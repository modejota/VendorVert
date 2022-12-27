import server from "../app";
import { ProductType } from "../models/product_type";

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
    nombre: "Cliente 1 modificado",
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
            expect(response.json()).toEqual({result: `Product with ID ${aProduct.id} added successfully to storage.`})
            expect(response.headers['location']).toEqual(`/products/${aProduct.id}`)
        })

        it ('Debería fallar al POSTear un producto ya existente', async () => { 
            const response = await server.inject({
                url: "/products",
                method: 'POST',
                payload: aProduct,
            });
            expect(response.statusCode).toBe(409);
            expect(response.json()).toEqual({result: `Product with ID ${aProduct.id} already exists.`})
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
            expect(response.json()).toEqual({error: `Product with ID ${nonExistingID} not found.`})
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
            expect(response.json()).toEqual({result: `Product with ID ${aProduct.id} updated successfully.`})
        })

        it ('Debería crear un nuevo producto al intentar modificar (PUT) uno no existente', async () => {
            const response = await server.inject({
                url: `/products/${nonExistingID}`,
                method: 'PUT',
                payload: modifyingProductData,
            });
            expect(response.statusCode).toBe(201);
            expect(response.json()).toEqual({result: `Product with ID ${nonExistingID} added successfully to storage.`})
            expect(response.headers['location']).toEqual(`/products/${nonExistingID}`)
        })

        it ('Debería modificar la cantidad de un producto (PATCH)', async () => {
            const response = await server.inject({
                url: `/products/${aProduct.id}`,
                method: 'PATCH',
                payload: {cantidad: anotherQuantity},
            });
            expect(response.statusCode).toBe(200);
            expect(response.json()).toEqual({result: `Quantity available of product with ID ${aProduct.id} updated successfully.`})
        })

        it ('Debería DELETEar un producto', async () => {
            const response = await server.inject({
                url: `/products/${nonExistingID}`,
                method: 'DELETE',
            });
            expect(response.statusCode).toBe(200);
            expect(response.json()).toEqual({result: `Product with ID ${nonExistingID} deleted successfully.`})
        })

        it ('Debería fallar al DELETEar un producto no existente', async () => {
            const response = await server.inject({
                url: `/products/${nonExistingID}`,
                method: 'DELETE',
            });
            expect(response.statusCode).toBe(404);
            expect(response.json()).toEqual({error: `Product with ID ${nonExistingID} not found.`})
        })

        it ('Debería fallar al modificar la cantidad de un producto (PATCH) no existente', async () => {
            const response = await server.inject({
                url: `/products/${nonExistingID}`,
                method: 'PATCH',
                payload: {cantidad: anotherQuantity},
            });
            expect(response.statusCode).toBe(404);
            expect(response.json()).toEqual({error: `Product with ID ${nonExistingID} not found.`})
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
            expect(response.json()).toEqual({result: `Client with ID ${aClient.id} created successfully.`})

            const response2 = await server.inject({
                url: '/clients',
                method: 'POST',
                payload: anotherClient,
            });
            expect(response2.statusCode).toBe(201);
            expect(response2.json()).toEqual({result: `Client with ID ${anotherClient.id} created successfully.`})
        })

        it ('Debería fallar al POSTear un cliente con ID ya existente', async () => {
            const response = await server.inject({
                url: '/clients',
                method: 'POST',
                payload: aClient,
            });
            expect(response.statusCode).toBe(409);
            expect(response.json()).toEqual({error: `Client with ID ${aClient.id} already exists.`})
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
            expect(response.json()).toEqual({error: `Client with ID ${nonExistingID} not found.`})
        })

        it ('Debería GETear todos los clientes', async () => {
            const response = await server.inject({
                url: '/clients',
                method: 'GET',
            });
            expect(response.statusCode).toBe(200);
            expect(response.json().clientes.length).toBe(2);
        })

        it ('Debería modificar un cliente (PUT)', async () => {
            const response = await server.inject({
                url: `/clients/${aClient.id}`,
                method: 'PUT',
                payload: modifyingClientData,
            });
            expect(response.statusCode).toBe(200);
            expect(response.json()).toEqual({result: `Client with ID ${aClient.id} updated successfully.`})
        })

        it ('Debería fallar al modificar un cliente (PUT) no existente', async () => {
            const response = await server.inject({
                url: `/clients/${nonExistingID}`,
                method: 'PUT',
                payload: modifyingClientData,
            });
            expect(response.statusCode).toBe(404);
            expect(response.json()).toEqual({error: `Client with ID ${nonExistingID} not found.`})
        })

        it ('Debería borrar un cliente (DELETE)', async () => {
            const response = await server.inject({
                url: `/clients/${aClient.id}`,
                method: 'DELETE',
            });
            expect(response.statusCode).toBe(200);
            expect(response.json()).toEqual({result: `Client with ID ${aClient.id} deleted successfully.`})
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
            expect(response.statusCode).toBe(201);
            expect(response.json()).toEqual({result: `Invoice with ID ${aInvoice.id} created successfully.`})
            expect(response.headers['location']).toEqual(`/invoices/${aInvoice.id}`)
        })

        it ('Debería fallar al POSTear una factura ya existente', async () => {
            const response = await server.inject({
                url: "/invoices",
                method: 'POST',
                payload: {id: aInvoice.id, idc: aInvoice.id},
            });
            expect(response.statusCode).toBe(409);
            expect(response.json()).toEqual({error: `Invoice with ID ${aInvoice.id} already exists.`})
        })

        it ('Debería POSTear un producto a una factura', async () => {
            const response = await server.inject({
                url: `/invoices/${aInvoice.id}`,
                method: 'POST',
                payload: aProduct,
            });
            expect(response.statusCode).toBe(201);
            expect(response.json()).toEqual({result: `Product with ID ${aProduct.id} added to invoice with ID ${aInvoice.id} successfully.`})
            expect(response.headers['location']).toEqual(`/invoices/${aInvoice.id}/products/${aProduct.id}`)
        })
        
        it ('Debería fallar al modificar un producto existente mediante POST', async () => {
            const response = await server.inject({
                url: `/invoices/${aInvoice.id}`,
                method: 'POST',
                payload: aProduct,
            });
            expect(response.statusCode).toBe(409);
            expect(response.json()).toEqual({error: `Product with ID ${aProduct.id} already exists in invoice with ID ${aInvoice.id}.`})
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
            expect(response.json()).toEqual({error: `Invoice with ID ${nonExistingID} not found.`})
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
            expect(response.json().products.length).toBe(1);
        })

        it ('Debería fallar al obtener un producto no existente de una factura (GET)', async () => {
            const response = await server.inject({
                url: `/invoices/${aInvoice.id}/products/${nonExistingID}`,
                method: 'GET',
            });
            expect(response.statusCode).toBe(404);
            expect(response.json()).toEqual({error: `Product with ID ${nonExistingID} not found in invoice with ID ${aInvoice.id}.`})
        })

        it ('Debería obtener el importe total de una factura (GET)', async () => {
            let expectedTotal = 1499 
            const response = await server.inject({
                url: `/invoices/${aInvoice.id}/total`,
                method: 'GET',
            });
            expect(response.statusCode).toBe(200);
            expect(response.json().total).toBe(expectedTotal);
        })

        it ('Debería fallar al obtener el importe total de una factura (GET) no existente', async () => {
            const response = await server.inject({
                url: `/invoices/${nonExistingID}/total`,
                method: 'GET',
            });
            expect(response.statusCode).toBe(404);
            expect(response.json()).toEqual({error: `Invoice with ID ${nonExistingID} not found.`})
        })

        it ('Debería modificar un producto de una factura (PUT)', async () => {
            const response = await server.inject({
                url: `/invoices/${aInvoice.id}/products/${aProduct.id}`,
                method: 'PUT',
                payload: modifyingProductData,
            });
            expect(response.statusCode).toBe(200);
            expect(response.json()).toEqual({result: `Product with ID ${aProduct.id} updated in invoice with ID ${aInvoice.id} successfully.`})
        })

        it ('Debería actualizar la cantidad de un producto de una factura (PATCH)', async () => {
            const response = await server.inject({
                url: `/invoices/${aInvoice.id}/products/${aProduct.id}`,
                method: 'PATCH',
                payload: {cantidad: anotherQuantity},
            });
            expect(response.statusCode).toBe(200);
            expect(response.json()).toEqual({result: `Quantity of product with ID ${aProduct.id} updated in invoice with ID ${aInvoice.id} successfully.`})
        })

        it ('Debería fallar al actualizar la cantidad de un producto de una factura (PATCH) no existente', async () => {
            const response = await server.inject({
                url: `/invoices/${aInvoice.id}/products/${nonExistingID}`,
                method: 'PATCH',
                payload: {cantidad: anotherQuantity},
            });
            expect(response.statusCode).toBe(404);
            expect(response.json()).toEqual({error: `Product with ID ${nonExistingID} not found in invoice with ID ${aInvoice.id}.`})
        })

        it ('Debería borrar un producto de una factura (DELETE)', async () => {
            const response = await server.inject({
                url: `/invoices/${aInvoice.id}/products/${aProduct.id}`,
                method: 'DELETE',
            });
            expect(response.statusCode).toBe(200);
            expect(response.json()).toEqual({result: `Product with ID ${aProduct.id} deleted from invoice with ID ${aInvoice.id} successfully.`})
        })

        it ('Debería fallar al borrar un producto de una factura (DELETE) no existente', async () => {
            const response = await server.inject({
                url: `/invoices/${aInvoice.id}/products/${nonExistingID}`,
                method: 'DELETE',
            });
            expect(response.statusCode).toBe(404);
            expect(response.json()).toEqual({error: `Product with ID ${nonExistingID} not found in invoice with ID ${aInvoice.id}.`})
        })

        // Need some bills to test this, that's why it's here
        it ('Debería obtener el número de facturas de un cliente (GET)', async () => {
            const response = await server.inject({
                url: `/clients/${aClient.id}/invoices`,
                method: 'GET',
            });
            expect(response.statusCode).toBe(200);
            expect(response.json().facturas.length).toBe(1);
        })

        it ('Debería fallar al intentar cambiar el cliente de una factura no existente (PATCH)', async () => {
            const response = await server.inject({
                url: `/invoices/${nonExistingID}/client`,
                method: 'PATCH',
                payload: {id: anotherClient.id},
            });
            expect(response.statusCode).toBe(404);
            expect(response.json()).toEqual({error: `Invoice with ID ${nonExistingID} not found.`})
        })
        
        it ('Debería actualizar el cliente de una factura (PATCH)', async () => {
            const response = await server.inject({
                url: `/invoices/${aInvoice.id}/client`,
                method: 'PATCH',
                payload: {id: anotherClient.id},
            });
            expect(response.statusCode).toBe(200);
            expect(response.json()).toEqual({result: `Client in invoice with ID ${aInvoice.id} updated successfully to ID ${anotherClient.id}.`})
        })

        
        it ('Debería fallar al actualizar el cliente (no existente) de una factura (PATCH)', async () => {
            const response = await server.inject({
                url: `/invoices/${aInvoice.id}/client`,
                method: 'PATCH',
                payload: {id: nonExistingID},
            });
            expect(response.statusCode).toBe(404);
            expect(response.json()).toEqual({error: `Client with ID ${nonExistingID} not found.`})
        })
        

        it ('Debería borrar una factura (DELETE)', async () => {
            const response = await server.inject({
                url: `/invoices/${aInvoice.id}`,
                method: 'DELETE',
            });
            expect(response.statusCode).toBe(200);
            expect(response.json()).toEqual({result: `Invoice with ID ${aInvoice.id} deleted successfully.`})
        })

        it ('Debería fallar al borrar una factura (DELETE) no existente', async () => {
            const response = await server.inject({
                url: `/invoices/${nonExistingID}`,
                method: 'DELETE',
            });
            expect(response.statusCode).toBe(404);
            expect(response.json()).toEqual({error: `Invoice with ID ${nonExistingID} not found.`})
        })

    })
    
})
