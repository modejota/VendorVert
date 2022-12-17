## Uso de CircleCI para la integración continua

Como mencionabamos en el [documento](4_CI.md) de elección de sistemas de integración continua, utilizaremos CircleCI para ejecutar los tests a partir del contenedor Docker que se construyó en el hito anterior.

Lo primero que debemos hacer, obviamente es crearnos una cuenta en CircleCI. No se muestra el proceso de creación puesto que ya cuento con una cuenta, más que es el típico proceso que no requiere demasiada explicaicón.

Una vez creada la cuenta, debemos vincularla con nuestro repositorio de Github. Para ello, nos dirigimos a la sección de "Projects" y seleccionamos el repositorio que queremos vincular, dándole al botón "Set Up Project". Una vez seleccionado, nos aparecerá una pantalla como la siguiente:

![Vinculación de repositorio](imgs/circleci_startup.png)

Dado que ya tengo el fichero de configuración en la rama del hito 4, usaré la opción "Fastest", con la que la configuración se realiza automáticamente. Terminada esta, nos redirije al dashboard del proyecto en CircleCI, donde podemos ver el estado de los últimos builds. Por defecto, CircleCI lanza una build la primera vez que configuramos el repositorio, para asegurarse de que todo funciona correctamente. Dentro de la configuración del repositorio, puede especificarse que se paren de ejecutar los tests; reactivarlos implica repetir este proceso, con la salvedad de que no se lanza la build de comprobación.

El fichero de configuración es bastante intuitivo; definimos un trabajo en el que usamos la imagen Docker y ejecutamos los tests llamando al gestor de tareas. Posteriormente, usamos un "workflow" para llamar a dicho trabajo. Por defecto, CircleCI ejecuta los tests en un contenedor Docker "Large", pero como no necesitamos tantos recursos especificamos con `resource_class: small` que se ejecute en uno con menos recursos, lo que nos ahorrará créditos (e hipotéticamente dinero).

Si consultamos la ejecución de los test, nos aparecerá algo una salida como la siguiente:

![Results](imgs/circleci_docker_tests.png)

y si desplegamos la sección de "Running test in Docker Container" podremos consultar el ya familiar log de ejecución de los tests de Jest. En esta ocasión si está correctamente formateado, no como en Github Action.

![Extended results](imgs/circleci_docker_tests_expanded.png)



