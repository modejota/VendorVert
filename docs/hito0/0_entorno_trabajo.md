# Entorno de trabajo

## Sistema operativo

Durante la realización de este proyecto se va a utilizar "Windows Subsystem for Linux" (WSL2) para poder trabajar con un kernel de Linux completo, concretamente Ubuntu 22.04, en un entorno Windows. 

Una de las principales ventajas de WSL es que tiene acceso a la totalidad de los recursos del sistema, a diferencia de las máquinas virtuales, por lo que podrían ejecutarse aplicaciones pesadas con mayor facilidad. Además, se puede acceder a los archivos de Windows desde el sistema Linux, y viceversa, por lo que se puede trabajar con los dos sistemas operativos de forma simultánea sin dificultades. De hecho, el explorador de archivos de Windows tiene un  icono en el lateral que permite acceder a los archivos de todas las distribuciones Linux instaladas, incluso sin tenerlas "encendidas". 

Por defecto, WSL2 no proporciona una entorno gráfico completo, pero esto no es problema. La gestión de archivos se puede realizar desde el explorador de archivos de Windows, y en las últimas versiones de WSL2 se pueden ejecutar aplicaciones gráficas desde la terminal, creándose ventanas independientes para estas.

Para instalar WSL2 y una distribución, Ubuntu por defecto, simplemente debemos ejecutar el comando
```
wsl --install
```
La versión por defecto de Ubuntu instalada a fecha de redacción de este documento es la 20.04, pero se actualizar a la 22.04 haciendo uso del gestor de paquetes ``apt``. Alternativamente, se puede instalar una versión diferente de Ubuntu, o cualquier otra distribución Linux desde la Microsoft Store. Técnicamente, también se pueden instalar ciertas distribuciones desde línea de comandos con la propia herramienta ``wsl``, pero esto no es recomendable ya que el listado es muy limitado y está desactualizado.

En [este enlace](https://learn.microsoft.com/es-es/windows/wsl/install) puede encontrar más información respecto de la instalación y configuración básica de WSL2.


## Editor de código

Como editor de código se va a utilizar Visual Studio Code, ya que es un IDE multiplataforma, ligero y con una gran cantidad de extensiones que nos van a resultar de gran utilidad. VSCode se puede descargar desde [este enlace](https://code.visualstudio.com/), o si se es fan de los gestores de paquetes, como es mi caso, se puede instalar haciendo uso de la herramienta ``winget``, preinstalada en las últimas versiones de Windows 10 y 11, mediante el comando
```
winget install Microsoft.VisualStudioCode
```
Para aquel lector interesado, puede encontrarse más información sobre ``winget`` en [este enlace](https://docs.microsoft.com/en-us/windows/package-manager/winget/).

Nótese que estamos instalando el IDE en Windows, a pesar de que vamos a trabajar haciendo uso de WSL. Nada nos impide instalar VSCode dentro de Ubuntu 22.04 y lanzarlo mediante línea de comandos, sin embargo, [la guía oficial de Microsoft](https://code.visualstudio.com/docs/remote/wsl) recomienda instalarlo en Windows y hacer uso de la extensión ``Remote - WSL`` para poder trabajar con el IDE como si este se encontrara dentro de Ubuntu 22.04, ahorrándonos el tener dos instalaciones diferentes del software en una misma máquina.

Otros IDE, como los del grupo de JetBrains (IntelliJ o PyCharm), también permiten el modus operandi de trabajar con WSL que acabamos de mencionar, pero sólo con las versiones "profesionales", las cuales son de pago aunque se pueden conseguir de forma gratuita para estudiantes.

## Configuración de Git

En la mayoría de distribuciones Linux viene instalado por defecto el cliente de Git, por lo que no deberemos preocuparnos por esto. En caso de hacer uso de Windows, deberemos descargarlo desde [este enlace](https://git-scm.com/downloads) e instalarlo nosotros mismos. Alternativamente, podemos instalarlo en Windows mediante ``winget`` con el siguiente comando:
```
winget install Git.Git
```

Para poder trabajar con Git, es necesario configurar el nombre de usuario y el correo electrónico, que se utilizarán para identificar al autor de los commits. Para ello, se ejecutan los dos comandos que se muestran a continuación.

```
git config --global user.name "José Alberto Gómez García"
git config --global user.email "modej@correo.ugr.es"
```

Se ha utilizado el comando ``--global`` para que la configuración se aplique a todos los repositorios de Git que se creen en el sistema. Si se desea configurar un repositorio en concreto, deberemos ejecutar los mismos comandos, pero sin el parámetro ``--global``, dentro del repositorio en cuestión.

Opcionalmente, se puede configurar el editor de texto que se utilizará por defecto para escribir los mensajes de los commits. Para ello, y teniendo en cuenta que yo utilizo Visual Studio Code, deberé ejecutar el comando

```
git config core.editor "code -w"
```
Sin embargo, no realizaré esta configuración ya que estoy acostumbrado a escribir los mensajes de los commits desde la terminal, y no desde "ficheros de configuración" en el IDE. 

Por último, para especificar cual es el repositorio remoto al que se van a subir los cambios y nuevos ficheros que vayamos creando, se ejecuta el comando 
```
git remote set-url origin git@github.com:modejota/VendorVert.git
```
Hecho esto, ya podemos empezar a trabajar con nuestro repositorio en Git y Github.
