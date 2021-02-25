ons.ready(todoCargado);

//document.querySelector('ons-input').blur() evento al salir del focus del input

function todoCargado() {
    myNavigator = document.querySelector('#navigator');
    inicializar();
    alert('Cargado');
    // no me está mostrando el alert
}

function inicializar() {
    // Chequeo si en el localStorage hay token guardado.
    tokenGuardado = window.localStorage.getItem("APPRecetasToken");

    // Al chequeo de la sesión, le paso como parámetro una función anónima que dice qué hacer después.
    chequearSesion(function () {
        // Muestro lo que corresponda en base a si hay o no usuario logueado.
        if (!usuarioLogueado) {
            login();
        } else {
            mostrarHome();
              }
    });
}



function login() {
    myNavigator.pushPage(`home.html`);
}

function mostrarHome() {
    myNavigator.pushPage(`home.html`);
}


function registro() {
myNavigator.pushPage(`registro.html`)
}


function abrirMenu() {
       document.querySelector("#menu").open();
}

function irCatalogo() {
    myNavigator.pushPage(`catalogo.html`);
    cerrarMenu();
}

function irFavoritos() {
    myNavigator.pushPage(`favoritos.html`);
    cerrarMenu();
}

function irPedidos() {
    myNavigator.pushPage(`pedidos.html`);
    cerrarMenu();
}


function cerrarMenu() {
       document.querySelector("#menu").close();
}

function cerrarSesion() {
    window.localStorage.clear();
    //inicializar();
    // va inicializar y no va pushpage, solo la puse para probar el boton
  myNavigator.pushPage(`login.html`);
    
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
            url: http://ec2-54-210-28-85.compute-1.amazonaws.com:3000/api/ + 'usuarios/session',
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




/******************************
 * Variables globales
 ******************************/
//Navegación
let myNavigator;

// API
const urlBase = 'https://recetas-api-taller.herokuapp.com/api/';
/*le puse la de recetas para poder probarlo*/

/* const urlBase = 'http://ec2-54-210-28-85.compute-1.amazonaws.com:3000/api/producto';
 no me entra a la API , probé lo que dijeron en el grupo pero no entra*/

// Sesión
//let usuarioLogueado;
let tokenGuardado;

// Productos
//const producto = [];

/* Registro */

function registrarUsuario() {
   // $("#pRegistroMensajes").html("");
    
    let nombreIngresado = $("#nombre").val();
    let apellidoIngresado = $("#apellido").val();
    let calleIngresada = $("#calle").val();
    let numeroPIngresado = $("#numeroP").val();
    let emailIngresado = $("#email").val();
    let passwordIngresado1 = $("#password1").val();
    let passwordIngresado2 = $("#password2").val();

    
    if (nombreIngresado == "" || apellidoIngresado == "" || calleIngresada == "" || numeroPIngresado == "" || emailIngresado == "" || passwordIngresado1 == "" || passwordIngresado2 == "") {
        $("#mensajeVacio").html("Todos los campos son obligatorios");
      
    }
    if (passwordIngresado1 != passwordIngresado2) {
        $("#mensajePassword1").html("Todos los campos son obligatorios");
    }
         if (passwordIngresado1.length < 8) {
                       $("#mensajePassword2").html("La clave debe ser mínimo de 8 caracteres.");}

        //falta verificar que el mail ingresado sea único, que no esté repetido
    if (nombreIngresado != "" && apellidoIngresado != "" && calleIngresada != "" && numeroPIngresado != "" && emailIngresado != "" && passwordIngresado1 == passwordIngresado2 && passwordIngresado1 != "" && passwordIngresado2 != "" && passwordIngresado1.length > 7 && passwordIngresado2.length > 7) {
       
        $("#mensajeOk").html("Se ha registrado correctamente.");
       
        // document.getElementById("passwordIngresado1").value = "";
        // document.getElementById("passwordIngresado2").value = "";
    }
        }// no me está mostrando cuando todo ok

/* SI PONGO ACA EL CONSTRUCTOR NO LO PONGO EN EL JS DE CLASES, VER COMO LO VAMOS A HACER
    verificacionDeDatos();
   
    // El correo debe tener un formato válido.
    // El correo debe ser único en el sistema (no se puede validar). 
    const datosUsuario = {
        nombre: nombreIngresado,
        apellido: apellidoIngresado,
        calle: calleIngresada,
        numeroPuerta: numeroPIngresado,
        email: emailIngresado,
        password: passwordIngresado1
    };

    $.ajax({
        type: 'POST',
        url: urlBase + 'usuarios',
        contentType: "application/json",
        data: JSON.stringify(datosUsuario),
            success: function () {
            alert("El usuario ha sido creado correctamente");
            login();
        },
        error: errorCallback
    })
}
*/

