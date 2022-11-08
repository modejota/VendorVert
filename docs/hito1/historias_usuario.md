En este documento se procede a la descripción de los usuarios implicados en el problema planteado, así como qué desean estos hacer con la aplicación desarrollada mediante el uso de historias de usuario.

## Usuarios
---

- Un dependiente será un empleado cualquiera de una tienda, encargado del trato con el cliente y la gestión del inventario en su local. Ocasionalmente se encargará de la gestión de las ventas, pero no será su función principal.
- El gestor será parte del personal administrativo del negocio, siendo este el encargado principal de la gestión de ventas, así como de analizar la evolución del negocio y tomar decisiones estratégicas con el fin de mejorar la rentabilidad del negocio.

## Historias de usuario
---

- [HU1](https://github.com/modejota/VendorVert/issues/2) -> Como gestor, quiero poder predecir, con un mínimo de 30 días de antelación (aunque idealmente sería configurable), los productos de los que debo disponer en el almacén para suplir la demanda de los clientes en próximas campañas.
- [HU2](https://github.com/modejota/VendorVert/issues/3) -> Como gestor, quiero poder disponer de una estimación de la liquidez del negocio, en función de ingresos percibidos y a percibir, así como de gastos realizados y a realizar. De esta manera, se asegurará el tener un cierto margen de maniobra a la hora de realizar ciertas transacciones, como pagar a proveedores o hacer frente a los impuestos.
- [HU3](https://github.com/modejota/VendorVert/issues/4) -> Como gestor, quiero poder predecir la afluencia de clientes al local en determinadas fechas y franjas horarias. Especialmente orientado a campañas de alto volumen de ventas, como San Valentín, Navidades o Reyes Magos, en las que es probable que deba ampliarse el número de dependientes o incluso el horario de apertura.
- [HU4](https://github.com/modejota/VendorVert/issues/5) -> Como gestor, quiero disponer de un informe de los productos más vendidos en función del tipo de cliente. De esta manera, se podrá realizar una campaña de marketing dirigida a cierto tipo de clientes, con el fin de fidelizarlos y aumentar la rentabilidad del negocio.
- [HU5](https://github.com/modejota/VendorVert/issues/6) -> Como gestor, quiero disponer de un sistema que me recomiende cómo vender un producto en función de su precio, su stock y su demanda; o público potencial al que dirigir su venta, entre otros factores. Especialmente orientado a productos nuevos cuyo nicho de mercado no esté claramente definido, o a productos que se encuentren en una fase de descenso importante de ventas (de manera que se corre el riesgo de almacenarlos indefinidamente sin darles salida). 

No se consideran como parte de las historias de usuario las operaciones CRUD, al carecer de lógica de negocio alguna. En particular, deberemos ser capaces de gestionar el stock de los productos del inventario y manejar las facturas. Estos elementos serán a partir de los cuales realicemos los cáulculos que realmente aportan valor a la aplicación. Nótese que estas operaciones CRUD son las que deberá realizar un dependiente del negocio en su día a día.