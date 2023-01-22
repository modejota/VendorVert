## Explicación del fichero ``docker-compose.yml``

En este apartado, vamos a copiar el fichero ``docker-compose.yml`` y hacer algunos comentarios sobre él.

```yaml
version: '3.9'

# Servicios/contenedores que componen el clúster
services:
  app:
    # Nos aseguramos del Dockerfile que se va a utilizar
    container_name: vendorvert-app
    build:
      context: .
      dockerfile: Dockerfile
    # Para que la aplicación este completamente operativa necesita esperar al arranque de la base de datos
    depends_on: 
      - mongodb
    external_links:
      - mongodb
    # Toma el código de la aplicación de la carpeta actual
    volumes:
      - .:/app
    # Expone sus servicios en el puerto 3030 al exterior
    ports:
      - 3030:3030

  mongodb:
    container_name: mongodb
    image: mongo:latest
    # Guardará los datos en la carpeta ./data en el repositorio
    volumes:
      - ./data:/data/db
    # Expone sus servicios en el puerto 27017 al exterior. Esto lo hacemos para poder gestionar la BD desde el exterior (con Visual Studio Code), pero por seguridad sería conveniente no hacerlo.
    ports:
      - 27017:27017

  # Administrador de logs
  elasticsearch:
    image: elasticsearch:7.17.8
    # Necesita puertos específicos para funcionar y comunicarse con el resto de la pila
    ports:
      - 9200:9200
      - 9300:9300
      - 9600:9600
    # Variable de entorno necesaria
    environment:
      - "discovery.type=single-node"

  # Interfaz web para visualizar los logs
  kibana:
    image: kibana:7.17.8
    # Accesible desde el exterior en su puerto por defecto
    ports:
      - 5601:5601
    # Necesita elasticsearch para funcionar, así que espera a su arranque
    depends_on:
      - elasticsearch

  # Recoge los logs de la aplicación y los envía a elasticsearch
  logstash:
    image: logstash:7.17.8
    # Puerto asignado por defecto
    ports:
      - 5000:5000
    # Persistencia de los logs y de donde toma la configuración. Se separa la orden por claridad.
    volumes:
      - type: bind
        source: ./logstash_pipeline
        target: /usr/share/logstash/pipeline
    # Necesita elasticsearch para funcionar, así que espera a su arranque
    depends_on:
      - elasticsearch
```

Para poder realizar esta configuración he tenido que consultar varios tutoriales y documentación de la propia herramienta. Particularmente, cabe destacar que los puertos que me han funcionado han sido los indicados, después de probar varias combinaciones sugeridas; y que no ha sido necesario definir un ``network`` que conecte explícitamente los contenedores de la pila ELK.