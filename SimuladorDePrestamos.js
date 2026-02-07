
//SIMULADOR DE PRESTAMOS

const inputNombre = document.getElementById('nombre');
const inputMonto = document.getElementById('monto');
const inputCuotas = document.getElementById('cuotas');
const divResultado = document.getElementById('resultado');
const inputBuscar = document.getElementById('inputBuscar');

const btonBuscar = document.getElementById('botonBuscar');
const btonAgregar = document.getElementById('botonAgregar');
const btonListar = document.getElementById('botonListar');
const btonTotal = document.getElementById('botonTotal');

let prestamos = [];

const prestamosRecuperados = JSON.parse(localStorage.getItem('prestamos')); // Se recuperan los préstamos guardados para mantener la info anterior

function estadoDeBoton () { // Si no hay prestamos el boton de mostrar listado de los mismos no va a estar visible
    if (prestamos.length === 0) {
        btonListar.style.display = 'none';
    } else {
        btonListar.style.display = 'block';
    }
}

if (prestamosRecuperados) {
    prestamos = prestamosRecuperados; // Si hay datos guardados, estos se les asignan al array 'prestamos' desde lo recuperado del localStorage
}
estadoDeBoton(); // Invoco la funcion en esta posicion porque recien acá voy a saber si hay prestamos o no.

class CrearPrestamo {
    constructor (nombre, monto, cuotas) {
        this.nombre = nombre;
        this.monto = Number(monto);
        this.cuotas = Number(cuotas);
        this.intereses = this.calcularIntereses();
        this.total = this.calcularTotal();
        this.valorPorCuota = this.calcularValorXCuota();
    }
    calcularIntereses () {
    switch(this.cuotas) { // Intereses dependiendo la cantidad de cuotas
        case 3:
            return 0.1;
        case 6:
            return 0.15;
        case 12:
            return 0.2;
        default:
            return 0;   
        }
    }

    calcularTotal () {
        return + (this.monto * (1 + this.intereses)).toFixed(2);
    }

    calcularValorXCuota () {
        if (this.cuotas === 0) return 0;
        return + (this.total/this.cuotas).toFixed(2);
    }
}


const agregarPrestamo = (nombre, monto, cuotas) => {
    const prestamo = new CrearPrestamo (nombre, monto, cuotas);
    prestamos.push(prestamo);
    return prestamo;
}


btonAgregar.addEventListener('click', () => { // Carga los prestamos.

    const nombre = inputNombre.value;
    const monto = Number(inputMonto.value); // Toman los datos ingresados por el usuario
    const cuotas = Number(inputCuotas.value);
    const cuotasAceptables = [3,6,12]; 

    if (nombre === '' || monto <= 0 || !cuotasAceptables.includes(cuotas)) {
        divResultado.textContent = 'Datos inválidos';
        return;
    }

    const prestamo = agregarPrestamo(nombre, monto, cuotas);
    guardadoDeDatos();

    divResultado.textContent = `Préstamo concedido a nombre de: ${prestamo.nombre} - Total a pagar con intereses: $${prestamo.total}`

    inputNombre.value = '';
    inputMonto.value = ''; // Vacian los datos para esperar nuevos ingresos.
    inputCuotas.value = '';

    estadoDeBoton(); // La invoco en esta posicion porque cambió el estado de los datos y depende del array actualizado.
});


function buscarPorNombre () { // Busca prestamos por nombres.
     
    const buscar = inputBuscar.value.trim(); //Toma lo que el usuario escribió en el input, quito los espacios extra del inicio y final.
    if (!isNaN(buscar) || buscar === '') {
        divResultado.textContent = 'Dato incorrecto, ingrese el nombre a buscar';
        return;
    }

    let nombre1 = prestamos.find(p => p.nombre.toLowerCase() === buscar.toLowerCase()); 

    if (nombre1) {
        divResultado.textContent = `Nombre: ${nombre1.nombre} - Monto pedido: $${nombre1.total} en ${nombre1.cuotas} cuotas de $${nombre1.valorPorCuota}`;
    } else {
        divResultado.textContent = 'No se encontraron prestamos con ese nombre';
    }
}
btonBuscar.addEventListener('click', () => {
    buscarPorNombre();
})


btonListar.addEventListener('click', () => { // Listado de prestamos.
    divResultado.innerHTML = '';

    prestamos.forEach (a => {
        const pHtml = document.createElement('p');
        pHtml.textContent = `Nombre: ${a.nombre} - Total a pagar: $${a.total}`; //Creo un elemento HTML nuevo, le doy info y luego lo inserto en el div para mostrarlo en la página.
        divResultado.appendChild(pHtml); 
    })
});


function totalDePrestamos () {  // Muestra el total de todos los prestamos dados
    if (prestamos.length === 0) {
        divResultado.textContent = 'No hay préstamos cargados';
        return;
    }

    let totalGeneral = prestamos.reduce((a, b) => {
        return a + b.total;
    },0)
    divResultado.textContent = `Total general de prestamos: $${totalGeneral}`;
}
btonTotal.addEventListener('click', () => {
    totalDePrestamos();
} )


function guardadoDeDatos () { // Guardado 
    localStorage.setItem('prestamos', JSON.stringify(prestamos));
}






 