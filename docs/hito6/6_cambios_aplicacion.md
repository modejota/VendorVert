## Cambios en la aplicación.

Para poder levantar un servidor con nuestra aplicación ha sido necesario modificar el Dockerfile que veníamos usando desde prácticas anteriores, dado que el uso que se le daba al contenedor ha cambiado.

Los cambios que se han realizado son los siguientes:
- Se ha establecido el ``WORKDIR`` en ``/app``, que es el directorio donde se encuentra el código de la aplicación.
- Se ha establecido el puerto 3030 como el puerto de escucha de la aplicación. Será por este puerto por el que el usuario final acceda a la aplicación.
- Se ha cambiado la orden del gestor de tareas en el ``ENTRYPOINT`` por ``npm run start``. Esta orden también ha sido modificada, ya que gracias al paquete ``ts-node`` se puede ejecutar el código de TypeScript sin necesidad de compilarlo previamente, lo que nos ahorra muchos quebraderos de cabeza.

Para levantar el servidor y que este se conecte a la base de datos ha sido necesario instalar el paquete ``mongoose`` y modificar en gran medida el código de la aplicación. Es en el fichero ``src/index.ts`` donde se realiza la conexión con la base de datos y se levanta el servidor.

Las ``data classes`` que se usaban para representar las entidades de valor (modelos) han sido sustituidas por ``schemas`` que se usan para definir la estructura de los documentos que se van a almacenar en la base de datos. Todo esto gestionado por debajo por el paquete ``mongoose``.

En consecuencia, gran parte de las validaciones que se hacían en el código de dichas ``data classes`` han sido sustituidas por validaciones que se realizan en los propios esquemas y en los controladores de la API (antes y despues de recibir la petición). 

Como era de esperar, el código de los controladores ha sido modificado sustancialmente, ya que ahora se usa el paquete ``mongoose`` y los esquemas creados para realizar las operaciones CRUD en la base de datos.

Además, dada la incorporación de la pila ELK para los logs, se ha tenido que cambiar la configuración del logger ``pino``, de manera que los logs se envíen a Logstash por el puerto 5000 y no se guarden en ficheros, como en prácticas anteriores. Para ello, hemos tenido que instalar el paquete ``pino-elasticsearch``. Asociado a esto, se ha tenido que cambiar la clase que contenía la configuración general de la app, pues sobraran propiedades relativas a las rutas de almacenamiento de los logs.

Por último, también es necesario modificar el fichero de tests de la API mínimamente, de manera que establezca una conexión propia con una base de datos aislada para pruebas, y que elimine el contenido de la base de datos tras cada ejecución de la batería de tests. A partir de ahora, los tests se deben lanzar con el contenedor de la base de datos levantado, pero deja de haber un contenedor específico para los tests, por lo que se lanzarán con la orden ``npm run test`` del gestor de tareas. Dado que los tests se ejecutan desde fuera del clúster, sus logs no quedarán registrados.