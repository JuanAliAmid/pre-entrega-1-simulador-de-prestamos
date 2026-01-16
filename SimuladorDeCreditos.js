
//SIMULADOR DE PRESTAMOS

let prestamos = [];
let menu;

function pedirNombre(mensaje) {  // pide el nombre del cliente
    
    let nombreAPedir = prompt(mensaje);
    while (nombreAPedir === null || !isNaN(nombreAPedir) || nombreAPedir === '') {
        nombreAPedir = prompt(mensaje);
    }
    return nombreAPedir;
} 

function pedirCantidadDeDinero(dinero) { // pide la cantidad de dinero que necesita 
    let dineroAPedir = Number(prompt(dinero));
    while (dineroAPedir <= 0 || isNaN(dineroAPedir) || dineroAPedir % 1 !== 0) {
        dineroAPedir = Number(prompt(dinero));
    }
    return dineroAPedir;
}

function pedirCantidadDeCuotas(cuotas) { // pide la cantidad de cuotas en las que va a abonar el prestamo
    let cuotasAPedir = Number(prompt(cuotas));
    while (isNaN(cuotasAPedir) || (cuotasAPedir !== 3 && cuotasAPedir !== 6 && cuotasAPedir !== 12)) {
        cuotasAPedir = Number(prompt(cuotas));
    }
    return cuotasAPedir;
}

while (menu !== '3') {  // inicio de menu 
    menu = prompt('Seleccione la operacion que desea realizar:\n 1 - Solicitar préstamo\n 2 - Mostrar resumen del prestamo solicitado\n 3 - Salir');

    if (menu === '1') {

        let nombre = pedirNombre('Ingrese su nombre');
        let monto = pedirCantidadDeDinero('Ingrese la cantidad de dinero que desea solicitar');
        let cuotas = pedirCantidadDeCuotas('Ingrese la cantidad de cuotas que desea realizar:\n 3 cuotas obteniendo un 10% de recargo\n 6 cuotas obteniendo un 15% de recargo\n 12 cuotas obteniendo un 20% de recargo');

        alert('Préstamo realizado con exito');

        let interes;

        if (cuotas === 3) {// 3  cuotas con interes de 10%
            interes = 0.1;
        } else if (cuotas === 6) {// 6 cuotas con interes de 15%
            interes = 0.15; 
        } else if (cuotas === 12) {// 12 cuotas con interes de 20%
            interes = 0.2;
        }

        let total = monto * (1 + interes); // total con el porcentaje de intereses 

        let valorPorCuota = total / cuotas; // valor a pagar por cada cuota 

        valorPorCuota = valorPorCuota.toFixed(2); // Busqué un metodo para minimizar la cantidad de decimales
        total = total.toFixed(2);

        const prestamo = {
            nombreCliente: nombre,
            montoPedido: monto,
            cuotasARealizar: cuotas,
            totalConIntereses: total,
            montoDeCadaCuota: valorPorCuota
        }

        prestamos.push(prestamo);
            
    } else if (menu === '2') {
        if (prestamos.length === 0) {
            alert('No hay préstamos registrados')
        } else {

           for (let i = 0; i < prestamos.length; i++) { // resumen del prestamo
                alert(`Numero de préstamo: ${i+1}\n Nombre de cliente: ${prestamos[i].nombreCliente}\n Monto solicitado: $${prestamos[i].montoPedido}\n Cantidad de cuotas: ${prestamos[i].cuotasARealizar}\n Total con intereses: $${prestamos[i].totalConIntereses}\n Monto a abonar por cuota: $${prestamos[i].montoDeCadaCuota}`)          
            } 

        }
    } else if (menu === '3') {
        alert('Operación finalizada');
    } else {
        alert('Dato inválido');
    }
}