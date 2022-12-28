## Elección del servicio de logging

Nuestra aplicación necesita disponer de un servicio que nos permita mantener un registro de lo que sucede durante su actividad. Es decir, necesitamos un servicio de logging.

Los principales requisitos que le podemos pedir al servicio de logging es que introduzca el menor overhead posible en la aplicación, que sea fácil de configurar y que pueda exportar los logs en formato JSON, para que puedan ser procesados por herramientas de análisis de logs (como [logz.io](https://logz.io/)) si se quisiese. Deseable es que se tenga algún tipo de salida "embellecida" para poder visualizar los logs en un entorno de desarrollo en la terminal de una manera amigable.

A continuación, detallo un poco mis andaduras probando diferentes servicios de logging el año pasado, en un intento de encontrar aquel que cumpla con los requisitos que hemos establecido de la mejor manera posible. Para ello, "me dí un paseo" por la [página de npm](https://www.npmjs.com/) buscando paquetes que se ajustasen a lo que necesitábamos.

En primer lugar, probé [tslog](https://www.npmjs.com/package/tslog), ya que tenía algunas características interesantes.  

- Estaba escrito en Typescript, por lo que debería funcionar sin problema.
- Permitía salida a fichero JSON o de forma "embellecida" por terminal. Y he de decir que la salida por terminal es de las más bonitas que he encontrado.
- Parecía marcar los errores con bastante precisión, por lo que la información que nos proporciona es bastante completa y potencialmente útil.
- No tiene dependencias, por lo que hay menos posibilidad de que haya conflictos con otras dependencias y/o de generar vulnerabilidades de seguridad.
- Se actualiza con frecuencia, por lo que es probable que siga siendo mantenida en el futuro.

Sin embargo, cuando lo probé no conseguí que la salida por terminal funcionase correctamente (se pisaba con el texto de Jest, aparentemente por un conflicto con el sistema de gestión de colores de ambas aplicaciones), no reconocía los errores si se producían en constructores y la información de los mismos al exportar a JSON no era demasiada. Por lo que, aunque parecía una buena opción, la descartamos por el momento.

Posteriormente, barajé usar [typescript-logging](https://www.npmjs.com/package/typescript-logging), el cual ha sido re-escrito por completo en el último año. 

Sin embargo, hay 3 puntos que no me han gustado demasiado. El primero de ellos es que lleva sin actualizarse 5 meses (y cuando el año pasado lo consulté, la versión "original" ya llevaba un año sin actualizarse), por lo que no parece probable que cuente con un mantenimiento activo en el futuro. El segundo es que, aunque es una librería aparentemente completa, no es demasiado fácil de configurar ni utilizar, generandose a mi juicio mucho boilerplate. Y el tercero es que, aunque es bastante configurable, no parece permitir exportar los logs a JSON.

Buscando herramientas "más profesionales" acabé probando [winston](https://www.npmjs.com/package/winston), el cual es un servicio de logging bastante popular, con cerca de 8 millones de descargas semanales.

Había leído muy buenas reseñas sobre él, pero no conseguí hacerlo funcionar correctamente. Se suponía que traía instalado los @types para Typescript, pero no los reconocía; y si los instalaba manualmente entraban en conflicto con los que se suponía que traía. A pesar de tener muchísimas descargas y aparente buena fama, el hecho de que lleve unos 5 meses sin actualizarse tampoco me da buena espina, así que lo descarté y decidí buscar algo más reciente.

Finalmente, probé, y **acabé decantandome por [pino](https://www.npmjs.com/package/pino)**, el cual es un servicio de logging bastante popular, con más de 3 millones de descargas semanales, y que se actualiza con frecuencia. 

Este cumple con todos los requisitos que hemos establecido anteriormente. Es muy fácil de configurar y utilizar, ya que el código necesario para hacerlo funcionar es poco y bastante claro. Además, es bastante configurable, permite exportar los logs a JSON, y dichos logs son bastante completos.

Aparentemente, es bastante rápido e introduce muy poco overhead, por lo que no debería suponer un problema de rendimiento. 

Finalmente, cuenta con dos puntos que me gustan bastante. El primero de ellos es que viene integrado en [fastify](https://www.npmjs.com/package/fastify), por lo que la compatibilidad debería estar garantizada. El segundo es que existe un paquete adicional llamado [pino-pretty](https://www.npmjs.com/package/pino-pretty) que permite embellecer la salida por terminal de una forma realmente sencilla. Lo probé y también funcionaba perfectamente, tenía muchas opciones y permite personalizar bastante la salida, la cual es muy bonita y organizada.
