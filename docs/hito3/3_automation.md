## Automatización con GitHub Actions de la publicación de la imagen Docker en DockerHub y Github Container Registry

Antes de nada, deberemos disponer de una cuenta en [DockerHub](https://hub.docker.com/) y crear un repositorio público para alojar la imagen de nuestra aplicación. No se muestran capturas de pantalla de este proceso, dado que ya disponía de cuenta en la plataforma. Además, es un proceso muy sencillo y rápido de realizar.

Github Container Registry es un servicio de almacenamiento de imágenes Docker que ofrece Github. Para poder utilizarlo, es necesario disponer de una cuenta en Github y de un repositorio público, requisitos sin los cuales no podríamos realizar esta asignatura, así que los damos por supuestos. Los contenedores creados se pueden consultar en el apartado "Packages" de nuestro repositorio.

Para automatizar la publicación de la imagen en DockerHub y Github Container Registry, se ha creado un fichero de configuración de Github Actions. Dicho fichero es una modificación del último script que se puede encontrar en [esta página web](https://docs.github.com/en/actions/publishing-packages/publishing-docker-images). 