ons.ready(todoCargado);

//document.querySelector('ons-input').blur() evento al salir del focus del input

function todoCargado() {
    myNavigator = document.querySelector('#navigator');
 
 //   inicializar();
    alert('Cargado');
}
/* 
function inicializar() {
    // Oculto todo.
    ocultarSecciones();
    ocultarOpcionesMenu();

    // Chequeo si en el localStorage hay token guardado.
    tokenGuardado = window.localStorage.getItem("APPObligatorioToken");

    // Al chequeo de la sesión, le paso como parámetro una función anónima que dice qué hacer después.
    chequearSesion(function () {
        // Muestro lo que corresponda en base a si hay o no usuario logueado.
        if (!usuarioLogueado) {
            mostrarLogin();
        } else {
            mostrarHome();
            mostrarMenuUsuarioAutenticado();
            // mostrarMenuUsuarioAutenticado() no se si va en el obligatorio
        }
    });
}
 */
function login() {
    myNavigator.pushPage(`home.html`);
}


function registro() {
myNavigator.pushPage(`registro.html`)
}


function abrirMenu() {
   /* var menu = document.getElementById('menu');
    menu.open();*/

    document.querySelector("#menu").open();
}

/*
function irPagina(numeroPagina) {
    navegar(`paginaProducto${numeroPagina}`, false);
}

function navegar(paginaDestino, resetStack, datos) {
    if (resetStack) {
        myNavigator.resetToPage(`${paginaDestino}.html`)
    } else {
        myNavigator.pushPage(`${paginaDestino}.html`, { data: datos })
    }
    cerrarMenu();
}*/

function registrarUsuario() {}
/*
function iniciarSesion(dataUsuario) {
    usuarioLogueado = new Usuario(dataUsuario._id, dataUsuario.nombre, dataUsuario.apellido, dataUsuario.calle, dataUsuario.numeroP,dataUsuario.email, null);
    tokenGuardado = dataUsuario.token;
    localStorage.setItem("APPObligatorioToken", tokenGuardado);
    mostrarHome();
}
*/
/*
function chequearSesion(despuesDeChequearSesion) {
    // Asumo que no hay usuario logueado y en caso de que si, lo actualizo.
    usuarioLogueado = null;

    if (tokenGuardado) {
        // Hago la llamada ajax usando el endpoint de validación de token que me retorna el usuario.
        $.ajax({
            type: 'GET',
            url: urlBase + 'usuarios/session',
            contentType: "application/json",
            /**
             * El beforeSend lo uso para cargar el token en el header de la petición y
             * lo hago mediente la función cargarTokenEnRequest. Esta función se va a
             * ejecutar antes de enviar la petición (beforeSend).
             * Esto se debe hacer porque el header mediante el que se manda el token
             * es un header personalizado (usualmente comienzan por x-).
            
            beforeSend: cargarTokenEnRequest,
            // Volvemos a utilizar una función anónima.
            success: function (response) {
                usuarioLogueado = new Usuario(response._id, response.nombre, response.apellido, response.calle, response.numeroP, null);
            },
            error: errorCallback,
            complete: despuesDeChequearSesion
        });
    } else {
        // Si no tengo token guardado, el usuarioLogueado no se actualiza (queda null) y sigo de largo.
        despuesDeChequearSesion();
    }
}

// Carga el token en el header de la petición.
// Si quiero que la petición esté autenticada, debo llamarla en el beforeSend de la llamada ajax.
function cargarTokenEnRequest(jqXHR) {
    jqXHR.setRequestHeader("x-auth", tokenGuardado);
}

function cerrarSesion() {
    // Así remuevo específicamente el token guardado.
    // window.localStorage.removeItem("APPObligatorioToken");
    // Así vacío todo lo que haya guardado.
    window.localStorage.clear();
    inicializar();
}


/******************************
 * Variables globales
 ******************************/
//Navegación
let myNavigator;

// API
/* const urlBase = 'http://ec2-54-210-28-85.compute-1.amazonaws.com:3000/api/';
 no me entra a la API , probé lo que dijeron en el grupo pero no entra*/

// Sesión
//let usuarioLogueado;
//let tokenGuardado;

// Productos
//const producto = [];
