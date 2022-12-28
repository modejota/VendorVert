## Elección del framework para el desarrollo de la API REST
---

En el marco del hito 5 deberemos realizar el diseño e implementación de una API REST que nos permita acceder a los recursos de la aplicación, para lo que necesitaremos un framework que nos apoye en esta tarea. 

Los principales criterios que se ha nseguido para la elección del framework son los siguientes:
- Velocidad. Debe permitir servir el máximo número de peticiones por segundo posible, ya que este es un requisito importante para la aplicación y fundamental para mantener contentos a los usuarios.
- Facilidad de uso. Debe ser sencillo desarrollar con él, ya que no podemos dedicar mucho tiempo a aprender a usarlo. 
- Popularidad. Debe ser un framework que se use mucho, ya que de esta forma podremos encontrar más información sobre él y más gente que lo use, lo que facilitará la resolución de dudas y problemas. Además, es más probable que se mantenga actualizado y se corrigan errores.
- Documentación. Debe tener una buena documentación, ya que de esta forma podremos aprender a usarlo más fácilmente. Idealmente, la documentación debería estar en español, ya que así nos será más fácil entenderla. 
- Soporte con el resto de herramientas utilizadas durante el proyecto. Especialmente, con TypeScript (en general), el framework de tests (Jest) y el logger (que ya adelantamos que será Pino).

Nótese que existen infinidad de frameworks para desarrollar APIs REST, por lo que no podemos analizar todos ellos. Por ello, hemos decidido analizar los más populares, que son los siguientes:
- Express
- Koa
- Ts.ED
- NestJS
- Fastify

## Frameworks analizados
---

### Express

Express es un framework muy popular para el desarrollo de API REST en Node.js, seguramente el más popular. Se supone que es fácil de usar, ya que se basa en el patrón middleware, que permite añadir gran cantidad de funcionalidades a la aplicación de forma muy sencilla. Además, cuenta con buena integración con TypeScript, ya que se puede usar con el módulo @types/express.

Sin embargo, algunas de sus supuestas ventajas (como el uso de middleware) pueden ser contraproducentes, ya que pueden ralentizar la aplicación y dificultar el entendimiento del código. Además, parece tener una curva de aprendizaje considerable, por lo que convendría buscar otras alternativas que sean realmente más fáciles de usar.

Express ha sido lo que históricamente se ha usado para desarrollar APIs REST en Node.js, pero parece que está perdiendo popularidad en favor de otros frameworks más modernos y fáciles de usar. De hecho, en año anteriores "se prohibía" su uso en esta asignatura.

### Koa

Koa es otro framework muy popular para la implementación de API REST en Node.js. Curiosamente, está desarrollado por el mismo equipo que Express.

Aun así, existen algunas diferencias entre ambos frameworks. Koa es más ligero que Express, con una estructura más simple y fácil de entender (en parte gracias a la menor dependencia de middleware) y mayor soporte para concurrencia. 

Es un firme candidato que deberemos tener en cuenta, aunque como veremos más adelante, hay otros frameworks que nos pueden ofrecer más ventajas.

### Ts.ED

Otro framework más, desarrollado esta vez directamente sobre TypeScript, por lo que se garantiza "compatibilidad total". Está construido sobre Express/Koa (se puede elegir). 

Ofrece una gran cantidad de características, mediante un sistema basado en clases que se pueda ampliar y modificar, multitud de decoradores, etc. Se hace mucho hincapié en la facilidad de mantener un espacio de trabajo estructurado y organizado.

Tras ojear un poco la documentación no me convence demasiado el estilo que hay que seguir para usar este framework, me da la sensación de que hay mucho boilerplate, el sistema para manejear los controladores no es demasiado intuitivo, y que no hay control total a la hora de realizar operaciones como validaciones de los datos recibidos. Por lo tanto, descartamos casi por completo el uso de este framework.

### NestJS

Al igual que el anterior, está construido sobre Express y TypeScript. Parece gozar de una reputación muy alta, según diversas web consultadas, por su facilidad de uso y su gran cantidad de características.

Sin embargo, tiene una gran falla, y es que para crear un proyecto con NestJS hay que usar su CLI, que es una herramienta que se instala de forma global y que genera un proyecto con una estructura algo compleja y poco intuitiva. Esto implica que tendría que mover y reestructurar todo el proyecto, lo que no es una tarea sencilla (en parte por la pelea que habría que tener con Git). 

Aun así, decidí probarlo, y la hacerlo me ví bastante abrumado con el montón de clases, opciones, decoradores y demás que hay que configurar para crear incluso un proyecto sencillo. Decidí descartar NestJS casi por completo debido a su aparente complejidad inicial.

### Fastify

A diferencia de los demás, este es un framework que no está construido sobre Express y/o Koa. Fastify es un framework "desarrollado desde cero" cuyo objetivo primordial es la velocidad.

Es un framework muy ligero, que promete consumir pocos recursos y ofrecer una gran velocidad de respuesta. Además, promete ser muy fácil de usar, y tener una curva de aprendizaje muy baja. Si se desea añadir funcionalidades, se puede hacer mediante plugins, que son módulos que se pueden instalar de forma independiente, aunque la funcionalidad "base" parece ser suficiente en nuestro caso. 

Tras probarlo, puedo constatar que las promesas que hacen se cumplen, ya que permite empezar a trabajar muy rápidamente, sin apenas configuración, y con un código muy sencillo de entender. Además, la documentación es bastante útil y proporciona muchos ejemplos.

Este framework tiene tres características que me gustan bastante. La primera de ellas es un sistema de validación "automática" de los datos que envía un cliente, de manera que se pueden rechazar peticiones incosistentes muy fácilmente, reduciendo el código que necesitas "escribir por ti mismo" para ello. La segunda es que tiene integrado por defecto Pino como servicio de logging, aunque más orientado al desarrollo que a producción, como ya veremos en su [apartado](5_eleccion_logger.md). La tercera es la facilidad con la que se puede testear la aplicación desarrollada, ya que no necesita levantar un servidor para ello al contar con soporte para "fake HTTP requests via injection". Esto es bastante de agradecer, ya que nos ahorramos más de un quebradero de cabeza.

Por todo esto, **decidí usar Fastify como framework para el desarrollo de la API REST.**

