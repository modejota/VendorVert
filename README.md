# VendorVert
---

### Repositorio para el proyecto de la asignatura "Cloud Computing: Fundamentos e Infraestructuras" del Máster en Ingeniería Informática de la UGR.

Sistema de ayuda a la toma de decisiones para pequeños negocios.

***

## Hito 0. Introducción.

La documentación de este hito se encuentra en [este directorio](docs/hito0). En él se encuentra la [descripción inicial del problema](docs/hito0/0_descripcion_problema.md) a resolver con este proyecto, cómo se ha creado este repositorio, la [configuración de Git y Github](docs/hito0/0_creacion_repositorio.md) que ha sido necesario realizar, así como una [descripción del entorno de trabajo](docs/hito0/0_entorno_trabajo.md) que se va a usar para el desarrollo del proyecto.

## Hito 1. Concretando y planificando el proyecto.

La documentación de este hito se encuentra en [este directorio](docs/hito1). En él se encuentra la descripción de los usuarios a los que se enfoca el proyecto, así como las [historias de usuario](docs/hito1/1_historias_usuario.md) que se han definido para el proyecto; los issues correspondientes a dichas historias de usuario han sido creados en Github. También se ha realizado una [descripción de los hitos](docs/hito1/1_hitos_proyecto.md) (milestones) en los que se va a dividir el proyecto; los cuales también se han creado en Github pertinentemente. 

En [este documento](docs/hito1/1_primeras_decisiones.md) se justifican las primeras decisiones que debemos tomar para el desarrollo del proyecto, como son el lenguaje de programación, el entorno de ejecución, el gestor de dependencias, y las primeras clases a crear. 

## Hito 2. Tests

La documentación de este hito se encuentra en [este fichero](docs/hito2/2_framework_tests.md). En él se describe la justificación del framework de tests, así como la biblioteca de aserciones, que se van a usar para el proyecto. Se detalla también la instalación y configuración de ambos, así como la creación de los primeros tests.

## Hito 3. Contenedores.

La documentación de este hito se encuentra en [esta carpeta](docs/hito3). En él se describe la instalación de Docker para uso uso en WSL2, la justificación de la elección del contenedor base, así como una descripción del Dockerfile empleado para la creación de nuestro propio contenedor.

También se adjunta documentación sobre cómo realizar el despliegue automático del contenedor en DockerHub y Github Container Registry haciendo uso de Github Actions. Se incluye también como actualizar el README del contenedor en DockerHub de forma automática cuando el fichero README de nuestro repositorio sufra cambios.

## Hito 4. Integración continua.

La documentación de este hito se encuentra en [esta carpeta](docs/hito4). En él se comparan diversos servicios de integración continua, y se justifica la elección de varios de ellos. Se describe también la configuración de dichos servicios.

## Hito 5. Microservicios.

La documentación de este hito se encuentra en [esta carpeta](docs/hito5). En él se describe la justificación de la elección de los microservicios: framework para la API REST, servicio de logging y servicio de configuración remota. También se describen las rutas de la API REST creada.

## Hito 6. Composición de servicios.

La documentación de este hito se encuentra en [esta carpeta](docs/hito6). En ella se puede encontrar la estructura del clúster, la explicación del fichero ``docker-compose``, los cambios que han sido necesarios realizar a la aplicación y una demostración de que todo funciona correctamente.