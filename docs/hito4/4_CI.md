## Sistemas de integración continua (CI) 

En este hito vamos a configurar un sistema de integración continua para nuestro proyecto. Antes de nada, deberemos investigar qué ventajas y desventajas nos ofrece cada uno de ellos. En este documento nos centraremos en los que seguramente sean los más utilizados en la actualidad, pero hay otras alternativas.

[Github Actions](https://github.com/features/actions).  
- Es la plataforma de integración continua que ofrece el propio Github, por lo que no es necesario realizar ninguna configuración adicional para poder utilizarla. La integración es total, permitiendo ver los resultados de las pruebas directamente desde la interfaz de Github.
- Se puede utilizar de forma gratuita sin demasiadas restricciones. En ningún momento se menciona el tiempo de ejecución (o créditos) de los que se dispone, aunque sí que existe un límite en función del tipo de usuario que se tenga. Con el plan "Github Student" se supone que el límite es de 3000 minutos al mes (correspondiente a un usuario Pro), pero el informe de la propia plataforma me muestra que no he consumido ni un solo minuto (cuando obviamente sí que lo he hecho). 
- La sintaxis de los ficheros de configuración es relativamente sencilla y se puede encontrar mucha documentación al respecto. De hecho, hay muchos ficheros por defecto para acciones comunes.
- Permite ampliar la funcionalidad haciendo uso de "actions" creadas por terceros, que se pueden encontrar en el [Marketplace](https://github.com/marketplace?type=actions). Puede que no sea tan útil para la integración continua, pero sí que puede ser interesante para otras tareas como la publicación de documentación, la generación de releases, etc. De hecho, ya se hizo uso de esta funcionalidad en el hito 3.
- Permite ejecutar tests en paralelo para distintas versiones de un lenguaje de una manera bastante fácil y cuenta con soporte para ejecutar tests en contenedores Docker.

[TravisCI](https://travis-ci.org/). 
- En años anteriores se ha utilizado este sistema, pero desde el pasado curso se necesita introducir una tarjeta de crédito para poder utilizarlo, a pesar de usar el plan gratuito del que se dispone por ser desarrolladores "open-source" y además estudiantes. De todos modos dicho plan gratuito solo dura un mes, por lo que no es una opción viable dados los tiempos que manejamos en la asignatura. Son estos motivos, y otros como filtraciones de datos de usuarios en el pasado, por los que se ha decidido no utilizar TravisCI.
- En cualquier caso, es seguramente una de las plataformas más utilizadas en la actualidad para la integración continua. Destaca por su buena integración con Github (lo que facilita el proceso de configuración) y por su sencillez de uso. Los ficheros de configuración son muy sencillos y se pueden encontrar muchos ejemplos en la propia documentación de la plataforma. Destaca la facilidad para ejecutar tests en paralelo para distintas versiones de un lenguaje y el soporte para ejecutar tests en contenedores Docker.

[CircleCI](https://circleci.com/). 
- Esta no requiere aportar ningún tipo de información de pago para poder utilizarla, al menos teniendo la condición de "Github Student". El plan gratuito ofrece 6000 minutos de ejecución para proyectos "en general" y 8000 minutos para proyectos "open-source". 
- La plataforma es bastante intuitiva y fácil de utilizar. Por ejemplo, te guía en el proceso de configuración de la integración continua, te proporciona "ficheros de configuración plantilla" con los ajutes más habituales para multitud de lenguajes de programación, te informa de errores mientras vas redactando el propio fichero de configuración y te permite enviar los cambios en configuración directamente al repositorio de Github.
- Cumple con uno de los requisitos que necesitamos satisfacer en este hito, que es la ejecución de los tests haciendo uso del contenedor Docker generado en hitos anteriores. 
- La principal desventaja es que no se encuentra demasiado integrada con Github, por lo que hay que activar los "Github Checks" y consultar los resultados de las pruebas desde la propia plataforma, y no desde la interfaz de Github, como podemos hacer con Github Actions o TravisCI.

[SemaphoreCI](https://semaphoreci.com/). 
- Es una plataforma de integración continua que ofrece un plan gratuito para proyectos open-source. El plan "normal" tiene un periodo de prueba de 14 días.
- El funcionamiento de esta plataforma es muy similar al de CircleCI, hasta el punto de no poder encontrar ninguna diferencia reseñable entre ambas, más allá de la distintas sintaxis que utilizan para escribir los ficheros de configuración, que en cualquier caso son sencillas. Prefiero usar la anterior, que parece contar con mejor reputación.

## Elección del sistema de integración continua

En el marco de este hito haremos uso de 2 de estas plataformas de integración continua, Github Actions y CircleCI, aunque técnicamente bastaría con utilizar la primera, dados los requisitos del hito. Se decide utilizar también CircleCI para conocer como utilizar una plataforma "de terceros" y aprender algo más sobre la integración continua. Para un proyecto más complejo podría tener sentido repartir las tareas de integración continua entre varias plataformas, para acelerar el tiempo de ejecución de los tests, asegurar que alguna plataforma no falla, etc.

Haremos uso de las Github Action para ejecutar los tests a partir del código fuente que se encuentra en el repositorio. Esto se hace dada la facilidad con la que se pueden configurar tests en paralelos para diversas versiones del lenguaje de programación con este sistema. Por otro lado, haremos uso tanto de Github Actions como de CircleCI para ejecutar los tests a partir del contenedor Docker generado en el hito anterior. 

En los otros ficheros de documentación de este hito se puede encontrar más información sobre la configuración de cada uno de estos sistemas de integración continua.
