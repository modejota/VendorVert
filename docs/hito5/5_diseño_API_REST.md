## Diseño de la API REST

Las rutas de la API se organizan entorno a tres recursos, los productos que hay presentes en el almacén de la tienda, las facturas del negocioy los clientes que compran en la tienda y generan dichas facturas, aunque estas últimas también pueden generarse como resultado de comprar a un proveedor. Así, atendemos a las operaciones CRUD básicas y dejamos la infraestructura preparada para la posterior implementación de la lógica de negocio que satisfará las historias de usuario.

Antes de entrar en detalle sobre las rutas, es necesario explicar algunas cosas que se han tenido en cuenta durante el desarrollo de la aplicación.

### Parsers

Se han tenido que desarrollar parsers para poder devolver en formato JSON las facturas almacenadas en el sistema y los productos dentro de dichas facturas. Esto es porque el método Object.fromEntries(...) no se aplica de manera "recursiva", es decir, no convierte a JSON tablas hash que haya dentro de otras tablas hash. Por lo tanto, al convertir nuestros datos había ocasiones en las que obteníamos objetos JSON (o parte de ellos) vacíos. Los métodos implementados solucionan esta problemática, permitiendo generar un JSON válido que devolver al cliente, aunque es previsible que haya que modificarlos (o incluso prescindir de ellos) en el futuro cuando se utilice la base de datos. Recordemos que por ahora todo está almacenado en memoria.

### Validación de datos

Fastify permite simplificar bastante la validación de los datos que deben recibir las distintas funciones de la API. Pasando objetos a los distintos campos del schema de la función se pueden especificar restricciones. Por ejemplo:

Para una petición que haga uso de los verbos POST, PUT o PATCH, se pueden especificar los datos esperados en el cuerpo de la petición mediante el campo body del schema. Puede especificarse, para cada valor, su tipo, si es obligatorio u opcional y valores mínimos y máximos, longitudes mínimas y máximas en caso de ser string, entre otras cosas.
Para una petición, en general, se pueden especificar partes de la URI "parametrizables", permitiendo comprobar, por ejemplo, si se tiene un determinado valor mínimo. Esto se hace con el campo params del schema.
En caso de que no se cumpla alguna de las restricciones especificadas, como que un valor sea menor de lo esperado, o falte algún dato obligatorio en el cuerpo de una petición, Fastify se encarga de responder automáticamente con código HTTP 400 y el mensaje de error correspondiente. Los siguientes son algunos ejemplos:

```
{ "statusCode": 400 , "error": "Bad Request", "message": "body.id should be >= 1" }
{ "statusCode": 400, "error": "Bad Request", "message": "body should have required property 'nombre'" }
```

### Logging

Se ha añadido también el sistema de logging en la API, de manera que se registre cuando se producen creaciones, modificaciones o borrados de los recursos (por el interés que tiene mantener un seguimiento del estado de estos), así como de los errores HTTP404 que tengan lugar. No se ha incluido el logging de peticiones GET, ya que se considera que no aporta información relevante, pero podría añadirse en el futuro si se considera necesario de forma sencilla.

### Tests

Se han desarrollado nuevos tests, centradps tanto en asegurar que se dispone de las rutas que cabría esperar, como que estas proporcionan la respuesta esperada ante determinados datos de entrada. Para ello, se ha seguido haciendo uso de Jest. 

Dado que aún no tendríamos porqué tener desplegado el servicio, se hace uso de la función ``inject`` de Fastify para realizar los "test de integración". Esta función permite realizar "peticiones HTTP fake" a la aplicación de manera que, sin tener el servidor levantado, Fastify redirige la petición HTTP a la función correspondiente y nos devuelve el resultado de su ejecución, como si el servidor sí que estuviera levantado. La capacidad de hacer esto fue un motivo para elegir Fastify como framework para la API.

## Rutas de la API

A continuación, se detallan las rutas de la API, agrupadas por el verbo HTTP que se utilice para acceder a ellas. Algunas consideraciones adicionales son añadidas en las secciones correspondientes.

#### Verbo GET
---

| URI		| Descripción						|
| ---		| ---							|
| / | Mostrar mensaje de bienvenida a la API
| /status | Comprobar que la aplicación está en línea |
| /products	| Obtención de todos los productos del almacén		|
| /products/:id	| Obtención del producto con ID único id del almacén	|
| /invoices	| Obtención de todas las facturas disponibles en el sistema			|
| /invoices/:id	| Obtención de la factura con ID único id del sistema	|
| /invoices/:id/client | Obtención del cliente de la factura con ID único id	|
| /invoices/:id/product/:idp	| Obtención del producto con ID único idp de la factura con ID único id	|
| /invoices/:id/total	|	Obtención del importe total de la factura con ID único id |
| /clients    | Obtención de todos los clientes del sistema		|
| /clients/:id | Obtención del cliente con ID único id del sistema	|
| /clients/:id/invoices | Obtención de todas las facturas del cliente con ID único id	|

El verbo GET se utiliza para obtener información del servidor. En este caso, se utiliza para obtener información sobre los productos, facturas y clientes del sistema.

En el caso de las facturas, la información recuperada de los productos se limitará a un identificador numérico y una cantidad, mientras que la información de los clientes se limitará a un identificador numérico. 

Este comportamiento no es arbitrario, sino que se fundamenta en dos motivos:
- Devolviendo solo el identificador numérico del producto, se evita el consumo de un tráfico de banda innecesario, así como proveer información que no tiene porque ser necesaria para el cliente, o que puede disponer de facturas anetriores. Si desea mas detalles sobre el producto, puede realizar una nueva petición GET a la ruta /products/:id, con el identificador numérico del producto que le interese.
- Devolviendo solo el identificador numérico del cliente, se evita exponer información sensible del mismo. Si desea más detalles sobre el cliente, puede realizar una nueva petición GET a la ruta /clients/:id, con el identificador numérico del cliente que le interese. Aunque no se ha implementado aún, dicha ruta tendría que estar protegida con un sistema de autenticación, de manera que solo los administradores del sistema puedan acceder a estos datos en su conjunto, y de forma que un cliente sí que pueda acceder a sus propios datos. 

#### Verbo POST
---

| URI		| Descripción						|
| ---		| ---							|
| /products	| Creación/actualización del producto cuyo ID único sea el enviado en el cuerpo de la petición		|
| /invoices	| Creación de la factura cuyo ID único sea el enviado en el cuerpo de la petición			|
| /invoices/:id	| Creación del producto cuyo ID único sea el enviado en el cuerpo de la petición, en la factura con el ID único especificado en la URL |
| /clients	| Creación del cliente cuyo ID único sea el enviado en el cuerpo de la petición		|

El verbo POST se utiliza, principalmente, para crear un nuevo recurso en el servidor. Opcionalmente, en algunas APIs, se puede utilizar para realizar modificaciones de un recurso ya existente, aunque esto se desaconseja, ya que el "estándar" nos dice que la operación POST no debe ser idempotente, es decir, que si se realiza la misma petición varias veces, el resultado no será el mismo. Para realizar modificaciones de un recurso ya existente, se utilizará el verbo PUT, que sí es idempotente. 

En un intento de seguir esta filosofía, en nuestro caso se decide que el intentar crear un producto o una factura con un ID único que ya exista en el sistema se devuelva al cliente un error HTTP 409 (Conflict).

#### Verbo PUT
---

| URI		| Descripción						|
| ---		| ---							|
| /products/:id	| Modificación de los datos del producto con ID único especificado en la URL del almacén	|
| /invoices/:id/product/:idp	| Modificación de los datos del producto con ID único idp en la factura con ID único id		|
| /clients/:id	| Modificación de los datos del cliente con ID único id del sistema		|

Dado que los identificadores se pasan como parte de la URI, no es necesarios adjuntarlos en el cuerpo de la petición. 

Como mencionábamos anteriormente, el verbo PUT si es idempotente. Por lo tanto, modificará aquellos recursos existentes, y de no existir los creará.

Nótese que no se dispone de un verbo PUT para modificar la fecha de una factura (la cual se genera automáticamente en el momento de su creación), ya que no tiene sentido modificarla. Para modificar el cliente de una factura se ha de utilizar el verbo PATCH, ya que no se trata de una modificación completa del recurso, sino de una modificación parcial.

#### Verbo DELETE
---

| URI		| Descripción						|
| ---		| ---							|
| /products/:id	| Borrado del producto con ID único id del almacén	|		|
| /invoices/:id	| Borrado de la factura con ID único id del sistema	|
| /invoices/:id/product/:idp	| Borrado del producto con ID único idp de la factura con ID único id	|
| /clients/:id	| Borrado del cliente con ID único id del sistema	|

#### Verbo PATCH
---

| URI		| Descripción						|
| ---		| ---							|
| /products/:id	| Actualización de la cantidad del producto con ID único id del almacén	|		|
| /invoices/:id/client	| Actualización del identificador del cliente en la factura con ID único id del sistema	|
| /invoices/:id/product/:idp	| Actualización de la cantidad del producto con ID único idp de la factura con ID único id	|

El verbo PATCH es utilizado para realizar modificaciones parciales de un recurso. En nuestro caso, se utiliza para actualizar la cantidad de un producto en el almacén o en una factura, ya que entendemos que es la operación de modificación más común que se realizará sobre un producto. En caso de querer actualizar otros de sus datos, aunque sea de forma parcial, se utilizará el verbo PUT. En el caso de las facturas, se utiliza para actualizar el cliente de la misma, ya que no se trata de una modificación completa del recurso, sino de una modificación parcial. 
