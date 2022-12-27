## Elección del servicio de configuración remota

En el marco de este hito también necesitamos elegir un servicio que nos permita abstraer la configuración de algunos parámetros de la aplicación, pudiendo estos ser modificados de forma remota y distribuida.

Utilizaré [dotenv](https://www.npmjs.com/package/dotenv) para guardar parejas de claves-valor en un fichero ".env" . En este se econtrarán  los parámetros de configuración susceptibles de ser modificados, como el directorio donde guardar los logs, o el nombre del fichero JSON donde se almacenan dichos logs, así como el puerto en el que escucha el servidor. En el futuro puede que se requiera de más de estas variables de entorno. Nótese que estos parámetros podrían ser potenialmente sensibles, por lo que no se incluirán en el repositorio público.

Para la configuración remota, no hay demasiadas alternativas entre las que escoger. Las opciones se resumen básicamente en [Consul](https://www.npmjs.com/package/consul) y [Etcd3](https://www.npmjs.com/package/etcd3). Nótese que hay otras herramientas como Ansible, Chef, Puppet, etc. que también se pueden utilizar para este fin, pero que parece que no son las más adecuadas para este caso. También hay servicios de configuración remota en el marco de plataformas como [AWS](https://aws.amazon.com), pero dado que no se van a utilizar dichas plataformas, no se consideran.

Aunque es cierto que Etcd3 lleva un par de años sin actualizarse, parece ser una opción madura ymuy popular. La elegiremos en parte por este motivo, y en parte por recomendación del profesor del curso pasado. Además, es previsible que ni siquiera lleguemos a levantar el servidor de Etcd3, aunque dejemos la configración preparada para ello, por lo que no debería ser tan importante esta decisión.

