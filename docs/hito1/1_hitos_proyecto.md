# Hitos del proyecto

En este documento se procede a la descripción de los hitos en los cuales se divide el desarrollo del software.

- [M1](https://github.com/modejota/VendorVert/milestone/1) -> Sistema de gestión de almacén.

En primer lugar, y como piedra angular del proyecto, se deberá disponer de un sistema que permita gestionar los diversos productos presentes en el almacén de una o varias tiendas. 

- [M2](https://github.com/modejota/VendorVert/milestone/2) -> Sistema de gestión de ventas.

Una vez se dispone del sistema de gestión de almacén, se deberá desarrollar el módulo de gestión de las ventas. Este se encargará de manejar el balance económico del negocio, y modificará el estado del almacén a partir de las facturas que correspondan (re-abastecimiento por parte de proveedores, por ejemplo).

- [M3](https://github.com/modejota/VendorVert/milestone/3) -> Sistema de gestión de usuarios.

Se deben desarrollar un módulo que permita definir usuarios (particulares, bien identificados, y genéricos), de forma que se puedan asociar las compras a la persona o perfil de persona que las realiza. 

- [M4](https://github.com/modejota/VendorVert/milestone/4) -> Sistema de informes. 

Se buscará desarrollar la parte del software encargada poder generar informes (predicciones y recomendaciones) basados en la información recabada por lo módulos desarrollados en hitos anteriores y técnicas de inteligencia artificial. En función de la dificultad del desarrollo, este milestone es susceptible de ser subdivido a posteriori en otros de menor complejidad. Véase los issues [HU1](https://github.com/modejota/VendorVert/issues/2), [HU2](https://github.com/modejota/VendorVert/issues/3), [HU3](https://github.com/modejota/VendorVert/issues/4), [HU4](https://github.com/modejota/VendorVert/issues/5) y [HU5](https://github.com/modejota/VendorVert/issues/6) para más información.

- [M5](https://github.com/modejota/VendorVert/milestone/5) -> Acceso distribuido al sistema

Se desarrollará una API que permita la comunicación con el software desarrollado, y, por tanto, el manejo de los recursos desarrollados durante los tres primeros hitos de manera distribuida. 

- [M6](https://github.com/modejota/VendorVert/milestone/6) -> Migración y compatibilidad.

Se deberá realizar un proceso de migración de las posibles bases de datos utilizadas por otros software de gestión de negocios empleados con anterioridad en los mismos.

- [M7](https://github.com/modejota/VendorVert/milestone/7) -> Despliegue.

Se deberá realizar el despliegue del software en un servidor en la nube, de forma que pueda ser utilizado por los gestores de los negocios adheridos. 