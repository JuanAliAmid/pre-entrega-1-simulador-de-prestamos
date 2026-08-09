# Simulador de préstamos

Proyecto desarrollado como entrega final del curso de JavaScript en Coderhouse.

## Demo

[Ver proyecto](https://simulador-de-prestamos-orpin.vercel.app/)

## Descripción:

Este proyecto es un simulador de préstamos desarrollado en JavaScript. Permite registrar préstamos, calcular intereses según la cantidad de cuotas, listar préstamos otorgados, buscar por ID de cliente, eliminar préstamos a través de su ID, modificar cuotas y calcular el total general. Gestionar los datos de forma dinámica utilizando el DOM y almacenamiento local.

## Funcionalidades:

- Agregar préstamo con nombre, monto y cantidad de cuotas.
- Cálculo de intereses según la cantidad de cuotas ingresadas:
    - 3 cuotas → 10%
    - 6 cuotas → 15%
    - 12 cuotas → 20%
- Modificar la cantidad de cuotas de un préstamo.
- Listar los préstamos registrados.
- Calcular el total general de los préstamos.
- Eliminar préstamos en base a su ID.
- Buscar préstamos en base a si ID
- Los préstamos se almacenan en localStorage para mantener la información aunque se recargue la página.
- Uso del DOM para mostrar y actualizar los datos en pantalla.
- Uso de librerías externas para mejorar la experiencia de usuario:
    - SweetAlert2 (confirmaciones)
    - Toastify (notificaciones)


## Desafíos

- Implementar una clase con métodos propios para encapsular la lógica de cálculo de cada préstamo
- Manejar el contador de IDs correctamente al recuperar datos desde localStorage o JSON, usando `Math.max` para no repetir IDs
- Generar dinámicamente el select y botón de edición solo cuando se encuentra un préstamo, sin tenerlos fijos en el HTML
- Priorizar localStorage sobre el JSON para mantener los cambios del usuario entre sesiones

## Tecnologías utilizadas:

- HTML
- JavaScript
- DOM
- localStorage
- Fetch
- SweetAlert2
- Toastify
