
//SIMULADOR DE PRESTAMOS

const inputNombre = document.getElementById('nombre');
const inputMonto = document.getElementById('monto');
const selectCuotas = document.getElementById('cuotas');
const divResultado = document.getElementById('resultado');
const inputBuscarId = document.getElementById('inputBuscar');

const inputId = document.getElementById('id');

const btonBuscarId = document.getElementById('botonBuscarId');
const btonAgregar = document.getElementById('botonAgregar');
const btonListar = document.getElementById('botonListar');
const btonTotal = document.getElementById('botonTotal');
const btonId = document.getElementById('idEliminar');

//============================ VARIABLES GLOBALES ============================

let prestamos = [];
let idContador = 0;
let prestamoSeleccionado = null; // acá guardamos el préstamo que encontramos para modificarlo después

//============================ CLASS ============================

class CrearPrestamo {
    constructor (nombre, monto, cuotas, id = null) {
        this.id = id ?? idContador ++;  //Si id NO es null ni undefined, usa id, sino se usa idContador
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
        if (this.cuotas === 0) return this.total; // si no quiere pago en cuotas solo abona el total sin intereses
        return + (this.total/this.cuotas).toFixed(2);
    }

    actualizacionDeCuotas(nuevasCuotas){ // este metodo sirve para cambiar la cantidad de cuotas el préstamo
        this.cuotas = Number(nuevasCuotas);
        this.intereses = this.calcularIntereses();
        this.total = this.calcularTotal();
        this.valorPorCuota = this.calcularValorXCuota();
    }
}

function estadoDeBoton () { // Si no hay prestamos el boton de mostrar listado de los mismos no va a estar visible
    if (prestamos.length === 0) {
        btonListar.style.display = 'none';
    } else {
        btonListar.style.display = 'block';
    }
}

//============================ FUNCIONES QUE MODIFICAN EL ARRAY ============================

const agregarPrestamo = (nombre, monto, cuotas) => {
    const prestamo = new CrearPrestamo (nombre, monto, cuotas);
    prestamos.push(prestamo);
    return prestamo;
}

function eliminarPorId(){ 
    if (prestamos.length === 0) {
        notificacion("No hay préstamos cargados", "#e5be01", "black");
        return;
    }

    const idBorrar = Number(inputId.value);
    const lengthAnterior = prestamos.length;

    if (idBorrar < 0){
        notificacion("Número inválido", "#9f0000", "white");
        return;
    }

    const siIdExiste = prestamos.some(a => a.id ===idBorrar);
    if (!siIdExiste) {
        notificacion("No se encontraron préstamos con ese id", "#e5be01", "black"); 
        return;
    }
    
    Swal.fire({
        title: "¿Deseas borrarlo realmente?",
        text: "No podrás volver a recuperarlo",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#038a5d",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, quiero borrarlo!",
        cancelButtonText: "No, quiero mantener el préstamo"
    }).then((result) => {
        if (result.isConfirmed) {
            prestamos = prestamos.filter(a => a.id !== idBorrar);

            if(prestamos.length < lengthAnterior) {
                guardadoDeDatos();
                estadoDeBoton();
            }

            divResultado.innerHTML = '';
            listado()
            Swal.fire({
                title: "Eliminado",
                text: "El préstamo ha sido eliminado con éxito",
                icon: "success"
            });
        }
    });
    inputId.value = '';
}

//============================ GUARDADO ============================

function guardadoDeDatos () {
    localStorage.setItem('prestamos', JSON.stringify(prestamos));
}

//============================ FUNCIONES DE UI ============================

function notificacion (mensaje, color, colorTexto){ 
    Toastify({
        text: mensaje,
        style: {
            background: color,
            color:colorTexto,
        },
        duration: 3000,
        gravity: "right",
        position: "right"
    }).showToast();
}

function buscarPorId () { 
    if (prestamos.length === 0) {
        notificacion("No hay préstamos cargados", "#e5be01", "black");
        return;
    }

    const idBuscar = Number(inputBuscarId.value);
    

    if (isNaN(idBuscar ) || idBuscar < 0){
        notificacion("Número inválido", "#9f0000", "white");
        return;
    }

    const IdEncontrado = prestamos.find(a => a.id === idBuscar);

    if(!IdEncontrado) {
        notificacion("No se encontraron préstamos con ese ID", "#e5be01", "black");
        return;
    } 
    

    prestamoSeleccionado = IdEncontrado; // guarda el préstamo encontrado en la variable global para poder editarlo

    // creo un selct nuevo para elegir la nuevas cuotas y un boton para confirmar la edición 
    divResultado.innerHTML = `<p>ID N°: ${IdEncontrado.id}</p>
     <p>Nombre: ${IdEncontrado.nombre}</p> 
     <p>Monto pedido: $${IdEncontrado.total} en ${IdEncontrado.cuotas} cuotas de $${IdEncontrado.valorPorCuota}</p>
        <label>Nuevas cuotas:</label>
    <select id="selectEditar" class="select"> 
        <option value="">Seleccionar cuotas</option>
        <option value="0"> Un único pago</option>
        <option value="3">3 Cuotas → 10% de recargo</option>
        <option value="6">6 Cuotas → 15% de recargo</option>
        <option value="12">12 Cuotas → 20% de recargo</option>
    </select> 

    <button id="btnGuardar" class="botones">Guardar cambios</button>`; //no dejo este select y boton fijos en el html porque solo tienen sentido cuando existe un préstamo buscado

    const btonGuardar = document.getElementById('btnGuardar')
    const selectCuotasNuevas = document.getElementById('selectEditar')

    btonGuardar.addEventListener('click', () => {
    const nuevasCuotas = Number(selectCuotasNuevas.value);

        if (isNaN(nuevasCuotas) || nuevasCuotas < 0) {
            notificacion("Selecciona un número de cuotas válido", "#9f0000", "white");
            return;
        }
        if (nuevasCuotas === IdEncontrado.cuotas) {
            notificacion("No hubo cambios en el número de cuotas", "#e5be01", "black");
            return;
        }

        IdEncontrado.actualizacionDeCuotas(nuevasCuotas); // invóco al metodo que cambia las cuotas para recalcular todo en base a la nueva cantidad de ellas
        guardadoDeDatos()
        notificacion("Préstamo modificado exitosamente", "#4d7841", "white")
        divResultado.innerHTML = `<p>Préstamo actualizado</p> <p> Nuevas cuotas: ${IdEncontrado.cuotas}</p> <p> Nuevo total: $${IdEncontrado.total}</p>`
        
    })
    inputBuscarId.value = '';
}

function listado (){ //listado de prestamos
    divResultado.innerHTML = '';
    prestamos.forEach (a => {
        const pHtml = document.createElement('p');
        pHtml.textContent = `ID N°: ${a.id} | Nombre: ${a.nombre} | Total: $${a.total} | Cuotas: ${a.cuotas}`;
        divResultado.appendChild(pHtml); 
    })
}

function totalDePrestamos () {  // Muestra el total de todos los prestamos dados
    if (prestamos.length === 0) {
        notificacion("No hay préstamos cargados", "#e5be01", "black");
        return;
    }

    let totalGeneral = prestamos.reduce((a, b) => {return a + b.total},0);
    divResultado.textContent = `Total general de préstamos: $${totalGeneral}`;
}

//============================ JSON ============================

async function data () {
    try{
        const response = await fetch ('data.json');
        if(!response.ok) throw new Error("Error al cargar Json");  // Si la respuesta del fetch no fue exitosa evito que siga ejecutando el resto de codigo y salto directamente al catch
        const data = await response.json();
        prestamos = data.prestamos.map (a => new CrearPrestamo(a.nombre, a.monto, a.cuotas, a.id));

        if (prestamos.length > 0){ // Este bloque toma el id más grande, y le asigna el id siguiente al nuevo prestamo, más que nada es para "preparar" el contador para el nuevo prestamo
            const maxId = Math.max(...prestamos.map(a => a.id));
            idContador = maxId +1;
        }

        estadoDeBoton();

    } catch (error){
        console.warn("Ocurrió un error ",error);
    }
}

//============================ INICIO DE LA APP ============================

function inicioDeApp (){
    const prestamosRecuperados = JSON.parse(localStorage.getItem('prestamos')); // Se recuperan los préstamos guardados para mantener la info anterior

    if (prestamosRecuperados && prestamosRecuperados.length > 0) {
    prestamos = prestamosRecuperados.map (a => new CrearPrestamo(a.nombre, a.monto, a.cuotas, a.id)); // Si hay datos guardados, estos se les asignan al array 'prestamos' desde lo recuperado del localStorage
    
    if (prestamos.length > 0) { 
        const maxId = Math.max(...prestamos.map(a => a.id));
        idContador = maxId + 1;
    }
    estadoDeBoton(); 
    } else {
        data();
    }
}

//============================ BOTONES ============================

btonBuscarId.addEventListener('click', buscarPorId);

btonId.addEventListener('click', eliminarPorId);

btonAgregar.addEventListener('click', () => { // Carga los prestamos.

    const nombre = inputNombre.value.trim();
    const monto = Number(inputMonto.value); // Toman los datos ingresados por el usuario
    const cuotas = Number(selectCuotas.value); 

    if (nombre === '' || isNaN(monto) || monto <= 0 || selectCuotas.value === '') { 
        notificacion("Datos inválidos, intente nuevamente", "#9f0000", "white");
        return;
    }

    const prestamo = agregarPrestamo(nombre, monto, cuotas);
    guardadoDeDatos();
    notificacion("Préstamo cargado exitosamente", "#4d7841", "white")
    divResultado.innerHTML = `<p>Préstamo concedido a nombre de: ${prestamo.nombre}</p> <p>Total a abonar con intereses: $${prestamo.total}</p> <p>El pago se realizará en ${prestamo.cuotas} cuotas de $${prestamo.valorPorCuota}</p> <p>ID N°: ${prestamo.id}</p>`

    inputNombre.value = '';
    inputMonto.value = ''; // Vacian los inputs para esperar nuevos ingresos.
    selectCuotas.value = '';

    estadoDeBoton(); // La invoco en esta posicion porque cambió el estado de los datos y depende del array actualizado.
});

btonListar.addEventListener('click', () => { 
    if (divResultado.innerHTML !== '') {
        divResultado.innerHTML = ''; // Si la lista no esta vacía, la vacío
    } else {     
        listado(); // Si está vacía, llamo a listado y muestro la lista 
    }
});

btonTotal.addEventListener('click', totalDePrestamos);

//============================ EJECUCIÓN ============================
inicioDeApp();



