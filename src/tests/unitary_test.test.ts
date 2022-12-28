import { ClientError } from "../errors/client_error";
import { HandlerError } from "../errors/handler_error";
import { handler } from "../handler";
import { Client } from "../models/client";
import { Product } from "../models/product";
import { ProductType } from "../models/product_type";

let aProduct: Product
let aClient: Client

beforeAll(() => {
    aProduct = handler.crear_producto(1,"Casio F91W","Casio",ProductType.RELOJERIA_COTIDIANA,12.90) 
    aClient = new Client(1,"John","Doe","johndoe@gmail.com")
})

describe('Tests unitarios de la aplicación', () => {

    describe('Test unitarios relativos a productos', () => {
        it('Debería probar la creación de productos', () => {
            expect(aProduct).toBeDefined()
            
            const invalidID = () => {
                handler.crear_producto(-1,"Casio F91W","Casio",ProductType.RELOJERIA_COTIDIANA,12.90)
            }
            expect(invalidID).toThrowError(HandlerError)
    
            const noName = () => {
                handler.crear_producto(1,"","",ProductType.INDEFINIDO,0.00)
            };
            expect(noName).toThrow(HandlerError) 
    
            const shortName = () => {
                handler.crear_producto(1,"A","",ProductType.INDEFINIDO,0.00)
            };
            expect(shortName).toThrow(HandlerError)  
    
            const longName = () => {
                handler.crear_producto(1,"This is gonna be an insanely long name so it shouldnt work at all","",ProductType.INDEFINIDO,0.00)
            };
            expect(longName).toThrow(HandlerError)  
    
            const noBrand = () => {
                handler.crear_producto(1,"Colonia de prueba","",ProductType.INDEFINIDO,0.00)
            };
            expect(noBrand).toThrow(HandlerError)  
    
            const shortBrand = () => {
                handler.crear_producto(1,"Colonia de prueba","A",ProductType.INDEFINIDO,0.00)
            };
            expect(shortBrand).toThrow(HandlerError)  
    
            const longBrand = () => {
                handler.crear_producto(1,"Colonia de prueba",
                                "This is gonna be an insanely long name so it shouldnt work at all",ProductType.INDEFINIDO,0.00)
            };
            expect(longBrand).toThrow(HandlerError)  
            
            const freePrice = () => {
                handler.crear_producto(1,"Colonia de prueba","Testing brand",ProductType.INDEFINIDO,0.00)
            };
            expect(freePrice).toThrow(HandlerError)
        })
    
        it('Debería probar los getters de los productos', () => {
            expect(aProduct.id_producto).toBe(1)
            expect(aProduct.nombre).toBe("Casio F91W")
            expect(aProduct.marca).toBe("Casio")
            expect(aProduct.tipo).toBe(ProductType.RELOJERIA_COTIDIANA)
            expect(aProduct.PVP).toBe(12.90)
        })
    })

    describe('Relativos a las facturas', () => {
        it('Debería probar la creación y añadido de facturas', () => {
            handler.crear_factura(1, aClient.id)
            expect(handler.get_num_items_factura(1) == 1)
    
            const repeatedID = () => {
                handler.crear_factura(1, aClient.id)
            };
            expect(repeatedID).toThrow(HandlerError)
    
            const invalidID = () => {
                handler.crear_factura(-10, aClient.id)
            };
            expect(invalidID).toThrow(HandlerError)
        })
    
        it('Debería obtener una factura', () => {
            let factura = handler.obtener_factura(1)
            let actual_date = new Date()
            expect(factura.fecha.toISOString().split('T')[0]).toStrictEqual(actual_date.toISOString().split('T')[0])
    
            const invalidID = () => {
                handler.obtener_factura(-1)
            };
            expect(invalidID).toThrow(HandlerError)
    
            const noExistingID = () => {
                handler.obtener_factura(67)
            };
            expect(noExistingID).toThrow(HandlerError)
        })
    
        it('Debería añadir un producto a una factura', () => {
            const invalidID_factura = () => {
                handler.aniadir_producto_factura(-10,aProduct,-99)
            };
            expect(invalidID_factura).toThrow(HandlerError)
            
            const invalidQuantity = () => {
                handler.aniadir_producto_factura(1,aProduct,-99)
            };
            expect(invalidQuantity).toThrow(HandlerError)
            
            handler.aniadir_producto_factura(1,aProduct,3)
            
            const alreadyExistingID = () => {
                handler.aniadir_producto_factura(1,aProduct,5)
            };
            expect(alreadyExistingID).toThrow(HandlerError)     
        })
    
        it('Debería obtener productos de una factura', () => {
            const invalidFactura = () => {
                handler.obtener_producto_factura(4,1)
            };
            expect(invalidFactura).toThrow(HandlerError)
            
            const invalidProducto = () => {
                handler.obtener_producto_factura(1,-2)
            };
            expect(invalidProducto).toThrow(HandlerError)    
            
            const noExstingProducto = () => {
                handler.obtener_producto_factura(1,99)
            };
            expect(noExstingProducto).toThrow(HandlerError)   
        
            let pair = handler.obtener_producto_factura(1,1)
            expect(pair?.[0].id_producto).toBe(1)
            expect(pair?.[1]).toBe(3)
            
            const noExistingFactura2 = () => {
                handler.get_num_items_factura(100)
            };
            expect(noExistingFactura2).toThrow(HandlerError) 

            expect(handler.get_all_facturas().get(1)?.productos.get(1)?.[0]).toBe(aProduct)
        })
    
        it('Debería poder actualizar cantidad de productos en una factura', () => {
            const invalidID_factura = () => {
                handler.actualizar_cantidad_producto_factura(-1,-1,24)
            };
            expect(invalidID_factura).toThrow(HandlerError) 
    
            const invalidID_producto = () => {
                handler.actualizar_cantidad_producto_factura(1,-1,24)
            };
            expect(invalidID_producto).toThrow(HandlerError) 
    
            handler.actualizar_cantidad_producto_factura(1,1,-4)
            expect(handler.obtener_producto_factura(1,1)[1]).toBe(0)
    
            const noExistingID = () => {
                handler.actualizar_cantidad_producto_factura(1,112,4)
            };
            expect(noExistingID).toThrow(HandlerError) 
    
            handler.actualizar_cantidad_producto_factura(1,1,7)
            expect(handler.obtener_producto_factura(1,1)?.[1]).toBe(7) 
        })
    
        it('Debería calcular el total de la factura', () => {
            let product2 = handler.crear_producto(2,"Giorgio Armani My Way","Giorgio Armano",ProductType.PERFUME,42.70)
            let product3 = handler.crear_producto(3,"Huawei Watch 3","Huawei",ProductType.RELOJERIA_PREMIUM,269.90)
            let product4 = handler.crear_producto(4,"Opel Corsa","Opel",ProductType.INDEFINIDO,2199.99)
    
            handler.aniadir_producto_factura(1,product2,2)
            handler.aniadir_producto_factura(1,product3,4)
            handler.aniadir_producto_factura(1,product4)
            
            let expected_total = 12.90*7+42.70*2+269.90*4
            expect(handler.calcular_total_factura(1).toFixed(2)).toStrictEqual(expected_total.toFixed(2)) 
    
            const noExistingFactura = () => {
                handler.calcular_total_factura(4)
            };
            expect(noExistingFactura).toThrow(HandlerError)
        })

        it('Debería poder modificar un producto en una factura', () => {
            let anotherProduct = handler.crear_producto(1,"Polo Ralph Lauren","Polo Ralph Lauren",ProductType.INDEFINIDO,24.90)
            const normalUpdate = () => {
                handler.actualizar_producto_factura(1,anotherProduct,100)
            }    
            expect(normalUpdate).not.toThrow(HandlerError)

            let anotherProduct2 = handler.crear_producto(122,"Polo Ralph Lauren","Polo Ralph Lauren",ProductType.INDEFINIDO,24.90)
            const notExistingProduct = () => {
                handler.actualizar_producto_factura(1,anotherProduct2,100)
            }
            expect(notExistingProduct).toThrow(HandlerError)
        })
    
        it('Debería eliminar un producto de la factura', () => {
            const invalidFactura = () => {
                handler.eliminar_producto_factura(-4,1)
            };
            expect(invalidFactura).toThrow(HandlerError)
    
            const noExistingProducto = () => {
                handler.eliminar_producto_factura(1,400)
            };
            expect(noExistingProducto).toThrow(HandlerError)      
            
            const invalidProducto = () => {
                handler.eliminar_producto_factura(1,-5)
            };
            expect(invalidProducto).toThrow(HandlerError)    
        
            handler.eliminar_producto_factura(1,1)
            expect(handler.get_num_items_factura(1)).toBe(3)
        })
    
        it('Debería eliminar una factura', () => {
            handler.eliminar_factura(1)
            expect(handler.get_num_facturas()).toBe(0)
    
            const noExistingFactura = () => {
                handler.eliminar_factura(4)
            };
            expect(noExistingFactura).toThrow(HandlerError)
        })
    })

   describe('Relativos al almacén', () => {
        it('Debería añadir productos al almacén', () => {
            const invalidQuantity = () => {
                handler.aniadir_producto_almacen(aProduct,-99)
            };
            expect(invalidQuantity).toThrow(HandlerError); 
            
            handler.aniadir_producto_almacen(aProduct)
            const alreadyExistingID = () => {
                handler.aniadir_producto_almacen(aProduct,12)
            };
            expect(alreadyExistingID).toThrow(HandlerError); 
        })

        it('Debería obtener productos del almacén', () => {
            const invalidID = () => {
                handler.obtener_producto_almacen(-4)
            };
            expect(invalidID).toThrow(HandlerError); 

            const noExistingID = () => {
                handler.obtener_producto_almacen(121)
            };
            expect(noExistingID).toThrow(HandlerError);  

            let otherProduct = handler.obtener_producto_almacen(1)
            expect(otherProduct?.[0]).toStrictEqual(aProduct)
        })

        it('Debería eliminar productos del almacén', () => {
            const invalidID = () => {
                handler.eliminar_producto_almacen(-4)
            };
            expect(invalidID).toThrow(HandlerError); 

            const noExistingID = () => {
                handler.eliminar_producto_almacen(121)
            };
            expect(noExistingID).toThrow(HandlerError);  

            handler.eliminar_producto_almacen(1)
            expect(handler.get_num_items_almacen()).toBe(0)
        })

        it('Debería asegurar cantidades positivas de los productos del almacén', () => {
            const invalidID = () => {
                handler.actualizar_cantidad_producto_almacen(-1,99)
            };
            expect(invalidID).toThrow(HandlerError); 
            
            handler.aniadir_producto_almacen(aProduct)
            handler.actualizar_cantidad_producto_almacen(1,4)
            expect(handler.obtener_producto_almacen(1)?.[1]).toBe(4)    

            const negativeQuantity = () => {
                handler.actualizar_cantidad_producto_almacen(1,-400)
            };
            expect(negativeQuantity).toThrow(HandlerError);

            const noExistingID = () => {
                handler.actualizar_cantidad_producto_almacen(121,4)
            };
            expect(noExistingID).toThrow(HandlerError); 
        })

        it('Debería actualizar productos en el almacén', () => {
            let modifiedProduct = handler.crear_producto(123,"Giorgio Armani My Way","Giorgio Armano",ProductType.PERFUME,42.70)
            const nonExistingID = () => {
                handler.actualizar_producto_almacen(modifiedProduct,200)
            };
            expect(nonExistingID).toThrow(HandlerError);

            const nullQuantity = () => {
                handler.actualizar_producto_almacen(modifiedProduct, -10)
            };
            expect(nullQuantity).toThrow(HandlerError);

            const normalUpdate = () => {
                handler.actualizar_producto_almacen(aProduct,100)
            };
            expect(normalUpdate).not.toThrow(HandlerError);
            const negativeUpdate = () => {
                handler.actualizar_producto_almacen(aProduct,-100)
            };
            expect(negativeUpdate).not.toThrow(HandlerError);
        })

        it('Debería saber qué productos hay en el almacén', () => {
            expect(handler.get_all_productos_almacen().get(1)?.[0]).toBe(aProduct)
        })
    })

    
    describe('Relativos a los clientes', () => {
        it('Debería probar la creación de clientes', () => {
            expect(aClient).toBeDefined()
            let client;
            
            const invalidID = () => {
                client = new Client(-1,"Juan","Pérez","fakemail@org.com") 
            }
            expect(invalidID).toThrowError(ClientError)
    
            const noName = () => {
                client = new Client(1,"","","fakemail@org.com") 
            };
            expect(noName).toThrow(ClientError) 
    
            const shortName = () => {
                client = new Client(1,"A","Pérez","fakemail@org.com") 
            };
            expect(shortName).toThrow(ClientError)  
    
            const longName = () => {
                client = new Client(-1,"This is gonna be an insanely long name so it shouldnt work at all","Pérez","fakemail@org.com") 

            };
            expect(longName).toThrow(ClientError)  
    
            const noSurname = () => {
                client = new Client(1,"Juanito","","fakemail@org.com") 
            };
            expect(noSurname).toThrow(ClientError)  
    
            const shortSurname = () => {
                client = new Client(1,"Juanito","A","fakemail@org.com") 
            };
            expect(shortSurname).toThrow(ClientError)  
    
            const longSurname = () => {
                client = new Client(1,"Juanito","This is gonna be an insanely long name so it shouldnt work at all","fakemail@org.com") 
            };
            expect(longSurname).toThrow(ClientError)  
            
            const noMail = () => {
                client = new Client(1,"Juanito","Pérez","")
            };
            expect(noMail).toThrow(ClientError)

            const invalidMail = () => {
                client = new Client(1,"Juanito","Pérez","fakemailorg")
            };
            expect(invalidMail).toThrow(ClientError)
        })
    
        it('Debería probar los getters de un cliente', () => {
            expect(aClient.id).toBe(1)
            expect(aClient.nombre).toBe("John")
            expect(aClient.apellidos).toBe("Doe")
            expect(aClient.email).toBe("johndoe@gmail.com")
        })
    })
    
})