import server from "../app";

describe('Test de la ruta por defecto y de estado', () => {

    it('Default route', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/'
        })
        expect(response.statusCode).toBe(200)
        expect(response.json()).toEqual({ message: 'Welcome to VendorVert API' })
    })

    it('Status route', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/status'
        })
        expect(response.statusCode).toBe(200)
        expect(response.json()).toEqual({ hello: 'I am live!' })
    })


})

// More tests to come. One suite per controller.