En este documento se justifican las primeras decisiones técnicas tomadas en el proyecto. En particular, se procede a la justificación del lenguaje de programación utilizado, así como el entorno de ejecución y gestor de dependencias asociados. También se comenta la creación de las primeras clases del proyecto.

## Lenguaje de programación
---

El lenguaje que he decido utilizar para este proyecto es TypeScript.

Llevo un tiempo queriendo aprender/utilizar este lenguaje, así que la libertad de elección de esta asignatura me da una excusa perfecta para finalmente hacerlo, por lo menos a nivel básico.

Los motivos "técnicos" que me han llevado a esta decisión son, principalmente, los siguientes:

- Posee una sintaxis relativamente parecida a la de lenguajes que ya he utilizado previamente, como Kotlin. 
- Permite tanto programación orientada a objetos como funcional.
- Es un lenguaje de tipado fuerte y estático. Es decir, una vez se le asigna un tipo a una variable, no podré cambiarlo, y si lo intento, fallará el proceso de "compilación". Es más sencillo detectar posibles errores, aunque no es infalible. 
- Permite especificar distintos ámbitos de visibilidad para las variables. Podré declarar variables privadas y gestionarlas mediante métodos.
- Permite la creación de clases abstractas e interfaces, las cuales considero bastante útiles.
- TypeScript está construido por encima de JavaScript, por lo que, de ser necesario, podré ejecutar código JavaScript desde TypeScript sin mayores dificultades.

Tras haber instalado NPM (lo cual se comenta más abajo), he instalado el compilador de TypeScript como dependencia de desarrollo
mediante el comando
```
npm i typescript --save-dev
```

## Entorno de ejecución 
---

El entorno de ejecución que he decidido utilizar es Node.js.

Los principales motivos por los que lo he elegido son los siguientes:

- Permite trabajar tanto con JavaScript como con TypeScript "out of the box", tanto en el lado del cliente como en el lado del servidor.
- Trabaja de forma asíncrona y dirigida por eventos, por lo que permite hacer muchas cosas al mismo tiempo, se tiene un muy buen rendimiento.
- Goza de gran popularidad, una comunidad bastante activa, y es usado por grandes compañías, lo que transmite confianza.

Una alternativa es Deno, un entorno de ejecución multiplataforma que utiliza TypeScript por defecto. Su principal ventaja es la ejecución de código en modo "sandbox". Su principal "desventaja" es la necesidad de convertir los módulos NPM y la falta de estandarización de ES modules.

El entorno de ejecución de Node.js ya se encontraba instalado por defecto en mi sistema operativo, sin embargo, la versión instalada, la cual he comprobado haciendo uso del comando `node -v`, era algo antigua (v.12.22.9, sin mantenimiento desde abril de 2022), por lo que he instalado el gestor de versiones de Node.js (NVM) mediante los siguientes comandos para actualizar a una versión más reciente.
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
```
Instalado NVM, he actualizado Node.js a su versión LTS más reciente (18.12.1, con soporte hasta abril de 2025), mediante el comando `nvm install --lts`

## Gestor de paquetes
---

El gestor de paquetes que he decidido utilizar es el por defecto de Node.js, NPM. Según la documentación oficial, NPM ya viene instalado con Node.js, pero en mi caso no era así por lo que he tenido que instarlo manualmente haciendo uso de la orden
```
sudo apt-get install npm
```

A pesar de ser el gestor de paquetes más utilizado, NPM no es la única opción. Existen otros gestores de paquetes, como Yarn.

Por lo que he podido leer, el rendimiento entre ambos gestores de dependencias es bastante similar para un número bajo de dependencias, como esperamos que sea el caso, aunque sí que es verdad que Yarn es más rápido cuando se trabaja con un gran número de dependencias, principalmente por trabajar en paralelo y su sistema de caché, lo que le ha hecho ganar popularidad en los últimos años. 

Técnicamente, NPM es un gestor de dependencias, pero posee funcionalidades básicas como gestor de tareas. Por el momento, utilizaré NPM también como gestor de tareas, aunque conforme se avance en los hitos de la asignatura es posible que se deba estudiar la necesidad de utilizar un gestor de tareas específico, como Gulp o Grunt.

## Creación de las primeras clases	
---

Con el objetivo de avanzar en el desarrollo del primer milestone del proyecto, se han creado las siguientes clases y enumerados:

- [**Product**](../../src/models/product.ts): clase representa un producto de la tienda, y será necesario tanto para la gestión del inventario del negocio como para la gestión de ventas. Posee un identificador único, un nombre, una marca, un tipo y un precio. 
- [**ProductType**](../../src/models/product_type.ts): enumerado que representa un tipo de producto. Se han especificado algunos tipos de productos, basados en lo que vende el negocio de mi familia, pero se podrán añadir más en el futuro.
- [**Storage**](../../src/models/storage.ts): clase que representa un almacén. Posee un identificador único (correspondiente al código de barras del producto), y una lista de parejas (producto, cantidad) que representa el inventario del almacén de una tienda.
- [**ProductError**](../../src/errors/product_error.ts): clase que representa un error relacionado con la gestión de productos. Contiene un mensaje de error.
- [**StorageError**](../../src/errors/storage_error.ts): clase que representa un error relacionado con la gestión del inventario. Contiene un mensaje de error.
- [**Constants**](../../src/constants/constants.ts): clase que contiene constantes que se utilizarán en el proyecto. Por ahora, se han definido constantes usadas para la validación de los datos que se deben especificar para crear un producto y gestionarlo dentro del inventario.

Aunque va en contra de las buenas prácticas, aún no se han añadido los tests que comprueben que el código desarrollado funciona correctamente, dado que esto se realizará en el siguiente hito de la asignatura. Por el momento, sólo se ha comprobado que el código "compila".