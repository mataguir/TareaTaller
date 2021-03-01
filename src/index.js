/******************************
 * Variables globales
 ******************************/
// Navegacion
let myNavigator;

// API
const urlBase = 'http://ec2-54-210-28-85.compute-1.amazonaws.com:3000/api/';

// Sesion
let usuarioLogueado;
let tokenGuardado;

// Productos
let productoAComprar;

let emailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

ons.ready(todoCargado);

//document.querySelector('ons-input').blur() evento al salir del focus del input

function todoCargado() {
    myNavigator = document.querySelector('#navigator');
    inicializar();
}

function inicializar() {
    // Chequeo si en el localStorage hay token guardado.
    tokenGuardado = window.localStorage.getItem('APPObligatorioToken');

    // Al chequeo de la sesion, le paso como parametro una funcion anonima que dice que hacer despues.
    chequearSesion(function () {
        // Muestro lo que corresponda en base a si hay o no usuario logueado.
        if (usuarioLogueado) {
            mostrarHome();
        } else {
            login();
        }
    });
}

function cerrarSesion() {
    window.localStorage.clear();
    //inicializar();
    // va inicializar y no va pushpage, solo la puse para probar el boton
    myNavigator.pushPage(`login.html`);
    cerrarMenu();
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

/******************************
 * INICIO DE SESION
 ******************************/

function inicioSesionHandler() {
    usuarioAIngresar = verificarLogin();
    if (usuarioAIngresar) {
        enviarLogin(usuarioAIngresar)
    }
}

function enviarLogin(datosUsuario) {
    $.ajax({
        type: 'POST',
        url: urlBase + 'usuarios/session',
        contentType: 'application/json',
        data: JSON.stringify(datosUsuario),
            success: iniciarSesion,
        error: loginErrorCallback
    });
}

function verificarLogin() {
    let emailUsuario = $('#login-email').val();
    let passwordUsuario = $('#login-password').val();

    if (emailUsuario != '' && passwordUsuario != '') {

        if (emailformat.test(emailUsuario)) {

            if (passwordUsuario.length >= 8) {
                const usuarioAIngresar = {
                    email: emailUsuario,
                    password: passwordUsuario
                };

                return usuarioAIngresar;
            }
            else {
                $('#respuesta-login').html('El password debe tener al menos 8 caracteres');
            }
        }
        else {
            $('#respuesta-login').html('Formato de email inválido');
        }
    }
    else{
        $('#respuesta-login').html('Todos los campos son obligatorios');
    }
    return false;
}

function iniciarSesion(dataUsuario) {
    usuarioLogueado = new Usuario(dataUsuario.data.nombre, dataUsuario.data.apellido, dataUsuario.data.direccion, dataUsuario.data.email, null);
    tokenGuardado = dataUsuario.data.token;
    localStorage.setItem('APPObligatorioToken', tokenGuardado);
    mostrarHome();
}

function chequearSesion(despuesDeChequearSesion) {
    // Asumo que no hay usuario logueado y en caso de que si, lo actualizo.
    usuarioLogueado = null;

    if (tokenGuardado) {
        // Hago la llamada ajax usando el endpoint de validacion de token que me retorna el usuario.
        $.ajax({
            type: 'GET',
            url: urlBase + 'usuarios/session',
            contentType: 'application/json',
            /**
             * El beforeSend lo uso para cargar el token en el header de la peticion y
             * lo hago mediente la funcion cargarTokenEnRequest. Esta funcion se va a
             * ejecutar antes de enviar la peticion.
             * Esto se debe hacer porque el header mediante el que se manda el token
             * es un header personalizado (usualmente comienzan por x-).
             **/
            beforeSend: cargarTokenEnRequest,
            success: function (response) {
                usuarioLogueado = new Usuario(response.data.nombre, response.data.apellido, response.data.direccion, response.data.email, null);
            },
            error: usuarioLogueadoErrorCallback,
            complete: despuesDeChequearSesion
        });
    } else {
        // Si no tengo token guardado, el usuarioLogueado no se actualiza (queda null) y sigo de largo.
        despuesDeChequearSesion();
    }
}

// Carga el token en el header de la peticion.
function cargarTokenEnRequest(jqXHR) {
    jqXHR.setRequestHeader('x-auth', tokenGuardado);
}

/******************************
 * REGISTRO
 ******************************/

function registrarUsuario() {
    usuarioARegistrar = verificarRegistro();

    if (usuarioARegistrar) {
        enviarRegistro(usuarioARegistrar);
    }
}

function enviarRegistro(datosUsuario) {
    $.ajax({
        type: 'POST',
        url: urlBase + 'usuarios',
        contentType: 'application/json',
        data: JSON.stringify(datosUsuario),
        success: iniciarSesion,
        error: registroErrorCallback
    });
}

function verificarRegistro() {
    let nombreIngresado = $('#nombre').val();
    let apellidoIngresado = $('#apellido').val();
    let calleIngresada = $('#calle').val();
    let numeroPIngresado = $('#numeroP').val();
    let emailIngresado = $('#email').val();
    let passwordIngresado1 = $('#password1').val();
    let passwordIngresado2 = $('#password2').val();

    if (nombreIngresado != '' && apellidoIngresado != '' && calleIngresada != '' && numeroPIngresado != '' && emailIngresado != '' && passwordIngresado1 != '' && passwordIngresado2 != '') {

        if (emailformat.test(emailIngresado)) {

            if (passwordIngresado1.length >= 8) {
            
                if (passwordIngresado1 == passwordIngresado2) {
                    let direccion = calleIngresada + ' ' + numeroPIngresado;

                    usuarioARegistrar = new Usuario(nombreIngresado, apellidoIngresado, direccion, emailIngresado, passwordIngresado1);

                    return usuarioARegistrar;
                }
                else {
                    $('#respuesta-registro').html('El password no coincide');
                }
            }
            else {
                $('#respuesta-registro').html('El password debe tener al menos 8 caracteres.');
            }
        }
        else {
            $('#respuesta-registro').html('Formato de email inválido');
        }
    }
    else{
        $('#respuesta-registro').html('Todos los campos son obligatorios');
    }
    return false;
}

function loginErrorCallback(error) {
    $('#respuesta-login').html(error.responseJSON.error);
}

function registroErrorCallback(error) {
    $('#respuesta-registro').html(error.responseJSON.error);
}

function usuarioLogueadoErrorCallback(error) {
    console.log(error.responseJSON.error);
}

/******************************
 * PRODUCTOS
 ******************************/

function mostrarProductos() {
    traerProductos();
}

function traerProductos() {
    $.ajax({
        type: 'GET',
        url: urlBase + 'productos',
        contentType: 'application/json',
        beforeSend: cargarTokenEnRequest,
        success: function (response) {
            cargarProductos(response.data);
        },
        error: traerProductosErrorCallback
    });
}

function traerProductosErrorCallback(error) {
    console.log(error.responseJSON.error);
}

function cargarProductos(productos) {
    $('#tabla-resultados-productos').html('');
    for (let i = 0; i < productos.length; i++) {
        $('#tabla-resultados-productos').append(`<tr onclick="detalleProducto(${i})" data-id="${productos[i]._id}"><td>${productos[i].nombre}</td><td>${productos[i].precio}</td><td>${productos[i].urlImagen}</td><td>${productos[i].codigo}</td><td>${productos[i].etiquetas}</td><td>${productos[i].estado}</td></tr>`);
    }
}
function detalleProducto(e) {
    traerUnProducto($('#tabla-resultados-productos tr').eq(e).data());
    mostrarProducto();
}

function traerUnProducto(id) {
    $.ajax({
        type: 'GET',
        url: urlBase + `productos/${id.id}`,
        contentType: 'application/json',
        beforeSend: cargarTokenEnRequest,
        success: function (response) {
            mostrarUnProducto(response.data);
        },
        error: traerUnProductoErrorCallback
    });
}

function traerUnProductoErrorCallback(error) {
    console.log(error.responseJSON.error);
}

function mostrarUnProducto(detalles) {
    $('#tabla-detalle-producto').html('');
    $('#tabla-detalle-producto').append(`<tr><td>${detalles.nombre}</td><td>${detalles.precio}</td><td>${detalles.urlImagen}</td><td>${detalles.codigo}</td><td>${detalles.etiquetas}</td><td>${detalles.estado}</td><td>${detalles.descripcion}</td><td>${detalles.puntaje}</td></tr>`);
    productoAComprar = detalles;
    if (detalles.estado == 'en stock') {
        $('#mensaje-stock').html('');
        $('#boton-comprar-producto').show();
    }
    else{
        $('#boton-comprar-producto').hide();
        $('#mensaje-stock').html('No hay stock');
    }
}

 /******************************
 * PEDIDOS
 ******************************/
function realizarPedido() {
    console.log(productoAComprar);
}

function cargarDetallesPedido() {
    $('#nombre-producto').html(`${productoAComprar.nombre}`);
    $('#precio-producto').html(`${productoAComprar.precio}`);
}

function cargarPedidos(pedidos) {
    $('#tabla-pedidos').html('');
    $('#tabla-pedidos').append(`<tr><td>${pedidos.nombre}</td><td>${pedidos.precio}</td><td>${pedidos.urlImagen}</td><td>${pedidos.codigo}</td><td>${pedidos.etiquetas}</td><td>${pedidos.estado}</td><td>${pedidos.sucursal}</td></tr>`);
    
}

function traerPedidos() {
    $.ajax({
        type: 'GET',
        url: urlBase + `pedidos`,
        contentType: 'application/json',
        beforeSend: cargarTokenEnRequest,
        success: function (response) {
            cargarPedidos(response.data);
        },
        error: traerPedidosErrorCallback
    });
}

function traerPedidosErrorCallback(error) {
    console.log(error.responseJSON.error);
}

 /******************************
 * FAVORITOS
 ******************************/



/******************************
 * PANTALLAS
 ******************************/

function login() {
    myNavigator.bringPageTop(`login.html`);
}

function mostrarHome() {
    myNavigator.pushPage(`home.html`);
}

function registro() {
myNavigator.pushPage(`registro.html`)
}

function abrirMenu() {
       document.querySelector('#menu').open();
}

function irCatalogo() {
    myNavigator.bringPageTop(`catalogo.html`);
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
       document.querySelector('#menu').close();
}

function mostrarProducto() {
    myNavigator.bringPageTop(`detalle-producto.html`);
}

function volverACatalogo() {
    myNavigator.bringPageTop(`catalogo.html`);
}

function mostrarCompra() {
    myNavigator.bringPageTop(`compra.html`);
}