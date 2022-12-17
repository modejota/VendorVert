## Uso de Github Actions para la integración continua

Como mencionabamos en el [documento](4_CI.md) de elección de sistemas de integración continua, utilizaremos Github Actions para ejecutar los tests a partir del código fuente que se puede encontrar en el repositorio.

Esto se hace mediante la creación de un fichero de configuración de Github  `test-from-source.yml`, que se encuentra en la carpeta `.github/workflows` del repositorio. En este fichero se especifican las acciones que se quieren ejecutar.

Como se puede ver, es un fichero bastante sencillo, donde la parte más importante es la definición de `strategy matrix`. Esta construcción nos permite utilizar variables en una única definición de trabajo, de forma que podemos crear automáticamente varias ejecuciones de dicho trabajo en paralelo en función del valor de la variable.

En nuestro caso, definimos la variable `node-version` (podría tener cualquier otro nombre) para poder ejecutar los tests en varias versiones de Node.js. En este caso, se ejecutarán los tests en las versiones 14, 16 y 18. Esta elección no es arbitraria, sino que se fundamenta en las buenas prácticas. Debemos asegurarnos de que nuestro código funciona en diferentes versiones de Node.js, ya que es posible que en una versión anterior no se haya implementado una característica que sí que se encuentra en una versión posterior, o en versiones posteriores se hayan introducido cambios que pueden afectar a la funcionalidad de nuestro código, etc. Técnicamente deberíamos probar en todas las versiones, pero nos limitaremos a las LTS (Long Term Support) para ahorrar tiempo de ejecución (a pesar de que parece que no tenemos límite). Se elige la versión 14 por ser la mínima que soporta el framework de tests, la 16 por ser la anterior LTS y la 18 por ser la actual LTS.

En la parte de `jobs` se define el trabajo que se va a ejecutar. En este caso, se ejecuta el comando `npm test` para ejecutar los tests, previa instalación de las dependecias necesarias. Como se puede ver, se utiliza la variable `matrix.node-version` para especificar la versión de Node.js que se va a utilizar.

Si nos fijamos las siguientes imagenes, vemos como los tests se lanzan en paralelo para diferentes versiones del lenguaje y se ejecutan exitosamente (el ejemplo es para la versión 16 de Node.js, estando el código escrito en Node.js v18).

![Tests en paralelo](imgs/github_action_matrix.png))
![Exito en tests](imgs/github_action_node16_success.png)

Para terminar de explicar el funcionamiento de este fichero, cabe mencionar que especificamos que los tests sólo se ejecuten cuando se modifiquen ficheros JavaScript o TypeScript. Esto lo hacemos, una vez más, para ahorrar tiempo de ejecución innecesario. No tiene sentido que se vuelvan a ejecutar los tests sobre el código fuente si no se ha modificado dicho código fuente, podríamos simplemente estar escribiendo documentación.

Adicionalmente, se incluye el fichero `test-from-docker.yml`. Este fichero permite ejecutar los tests haciendo uso del contenedor Docker creado en el hito anterior. Como se puede ver, es un fichero sumamente sencillo, donde la única peculariadad es que hemos especificado que se ejecute cuando se haga "push" a una rama que no debería existir. Esto se hace para evitar que se ejecute de forma automática, ya que dijimos que los tests con el contenedor Docker los vamos a lanzar en CircleCI. Si algún día optamos por dejar de usar CircleCI, podemos utilizar este fichero para ejecutar los tests con el contenedor Docker en Github. 

Para demostrar que funciona, se ha probado a ejecutarlo. En la siguiente imagen se puede ver como se ejecutan los tests con el contenedor Docker correctamente, aunque la salida de Jest mediante la Github Action está algo rota.

![Tests con contenedor Docker](imgs/github_action_docker.png)