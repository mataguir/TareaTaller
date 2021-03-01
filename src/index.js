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

// Callbacks para el device ready de Cordova y en el de Onsen.
document.addEventListener("deviceready", onDeviceReady, false);

ons.ready(todoCargado);

// Le decimos qué hacer cuando el dispositivo se queda sin internet.
document.addEventListener(
    "offline",
    function () {
        myNavigator.pushPage("offline.html");
    },
    false
);

// Le decimos qué hacer cuando el dispositivo vuelve a tener acceso a internet.
document.addEventListener(
    "online",
    function () {
        myNavigator.popPage();
    },
    false
);

function todoCargado() {
    myNavigator = document.querySelector('#navigator');
    cargarPosicionDelUsuario();
    $("#btnDibujarPosicionDelUsuario").click(btnDibujarPosicionDelUsuarioHandler);
    $("#btnBuscarDireccion").click(btnBuscarDireccionHandler);
    inicializar();
}

//mapa
let posicionDelUsuario;
let miMapa;

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
            $('#respuesta-login').html('Formato de email invÃ¡lido');
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
            $('#respuesta-registro').html('Formato de email invÃ¡lido');
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

//Esta tabla muestra todos los productos
// Tiene el boton de agregar a favoritos
function cargarProductos(productos) {
    $('#tabla-resultados-productos').html('');
    for (let i = 0; i < productos.length; i++) {
        $('#tabla-resultados-productos').append(`<tr onclick="detalleProducto(${i})" data-id="${productos[i]._id}"><td>${productos[i].nombre}</td><td>${productos[i].precio}</td><td>${productos[i].urlImagen}</td><td>${productos[i].codigo}</td><td>${productos[i].etiquetas}</td><td>${productos[i].estado}</td>
                                     <td><input type="button" value="AGREGAR"></td> /tr>`);
        /*    <td><input class="btnProductoFavorito" id="${productos[i]._id} type="button" value="${obtenerNombreBotonFavorito(unProductoObjeto)}"></td>*/

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
    $('#tabla-detalle-producto').append(`<tr><td>${detalles.nombre}</td><td>${detalles.precio}</td><td>${detalles.urlImagen}</td><td>${detalles.codigo}</td><td>${detalles.etiquetas}</td><td>${detalles.estado}</td><td>${detalles.descripcion}</td><td>${detalles.puntaje}<td>
</tr>`);
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

function buscar(entrada) {
    let nombres = $('.nombre-producto');
    let etiquetas = $('.etiquetas-producto');

    nombres.parent().hide();

    for (let i = 0; i < nombres.length; i++) {
        let nombre = nombres.eq(i).html().toLowerCase();
        if (nombre.indexOf(entrada.toLowerCase()) != -1) {
            nombres.eq(i).parent().show();
        }

        elemAMostrar = buscarEtiquetas(etiquetas.eq(i), entrada);
        if (elemAMostrar) {
            elemAMostrar.show();
        }
    }
}

function buscarEtiquetas(etiqueta, param) {

    let arrayEtiquetas = etiqueta.html().split(",")

    for (let j = 0; j < arrayEtiquetas.length; j++) {
        if (arrayEtiquetas[j].indexOf(param.toLowerCase()) != -1) {//si lo encuentra
            return etiqueta.parent();
        }
    }
    return false;
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
/* function crearPedido(){
 let unProductoObjeto = new Pedido()

               <tr> 
                     <td><input class="btnProductoFavorito" Id="${unPedidoObjeto.idProducto}" type="button" value="${obtenerNombreBotonFavorito(unProductoObjeto)}">
                     </td>
                </tr>
           }
           
            $(".btnProductoFavorito").click(btnProductoFavoritoHandler) ;
          
}
*/

// Funciï¿½n que revisa si el producto estï¿½ o no en favoritos para ver quï¿½ texto ponerle al botï¿½n.
function obtenerNombreBotonFavorito(producto) {
    let nombreBoton = "Agregar";
    let favoritosLocalStorage = window.localStorage.getItem("APPProductosFavoritos");
    let favoritosJSON = null;
    if (favoritosLocalStorage) {
        favoritosJSON = JSON.parse(favoritosLocalStorage);
        let i = 0;
        let encontrada = false;
        while (!encontrada && i < favoritosJSON.length) {
            let unFavorito = favoritosJSON[i];
            if (unFavorito.idProducto === producto.idProducto) {
                encontrada = true;
                nombreBoton = "Sacar";
            }
            i++;
        }
    }
    return nombreBoton;
}


// Revisa si el producto estï¿½ o no en favoritos y la elimina o agrega segï¿½n corresponda y en el caso que no estuviera como favorita le cambia la imagen al boton llamando a la funcion obtenerImagenDelBotonFavorito()
function btnProductoFavoritoHandler() {
    let productoId = $(this).attr("productoId");
    let favoritosLocalStorage = window.localStorage.getItem("APPProductosFavoritos");
    let favoritosJSON = null;
    let producto = obtenerProductoPorID(productoId);
    if (favoritosLocalStorage) {
        favoritosJSON = JSON.parse(favoritosLocalStorage);
        let i = 0;
        let encontrada = false;
        while (!encontrada && i < favoritosJSON.length) {
            let unFavorito = favoritosJSON[i];
            if (unFavorito.idProducto === productoId) {
                encontrada = true;
                // Elimino la receta del array de favoritos
                favoritosJSON.splice(i, 1);
            }
            i++;
        }
        // Si no encontrï¿½ la receta entre los favoritos, la agrego.
        if (!encontrada) {
            if (producto) {
                favoritosJSON.push(producto);
            }
        }
    } else {
        // Si no tenï¿½a ningï¿½n favorito en localStorage, agrego la receta en cuestiï¿½n.
        if (producto) {
            favoritosJSON = [producto];

        }
    }
    // Actualizo mis favoritos en el localStorage.
    window.localStorage.setItem("APPProductosFavoritos", JSON.stringify(favoritosJSON));
    mostrarHome();
}

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

/******************************
 * MAPAS Y UBICACION
 ******************************/
function cargarPosicionDelUsuario() {

    window.navigator.geolocation.getCurrentPosition(
        // Callback de ï¿½xito.
        function (pos) {
            posicionDelUsuario = {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
            }
            inicializarMapa();
        },
        // Calback de error.
        function () {
            posicionDelUsuario = {
                latitude: -34.903816878014354,
                longitude: -56.19059048108193
            }
            inicializarMapa();
        }
    )
}



function inicializarMapa() {
    // Guardo referencia global a mi mapa.
    miMapa = L.map("contenedor-mapa").setView([posicionDelUsuario.latitude, posicionDelUsuario.longitude], 13);

    // Vacï¿½o el mapa.
    miMapa.eachLayer(m => m.remove());

    // Dibujo la cartografï¿½a base.
    L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWNhaWFmYSIsImEiOiJjanh4cThybXgwMjl6M2RvemNjNjI1MDJ5In0.BKUxkp2V210uiAM4Pd2YWw",
        {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery ï¿½ <a href="https://www.mapbox.com/">Mapbox</a>',
            id: "mapbox/streets-v11",
            accessToken: "your.mapbox.access.token"
        }
    ).addTo(miMapa);
}

function btnDibujarPosicionDelUsuarioHandler() {
    L.marker([posicionDelUsuario.latitude, posicionDelUsuario.longitude]).addTo(miMapa).bindPopup('Ubicaciï¿½n del usuario').openPopup();
    miMapa.panTo(new L.LatLng(posicionDelUsuario.latitude, posicionDelUsuario.longitude));
}

function btnBuscarDireccionHandler() {
    const direccionBuscada = $("#inputDireccionBuscada").val();
    buscarDireccion(direccionBuscada);
}

// Funciï¿½n que usa la API de OpenStreetMap para buscar las coordenadas de una direcciï¿½n.
function buscarDireccion(direccionBuscada) {
    $.ajax({
        type: 'GET',
        url: `https://nominatim.openstreetmap.org/search?format=json&q=${direccionBuscada}, Uruguay`,
        contentType: "application/json",
        success: function (data) {
            if (data.length > 0) {
                // L.marker([data[0].lat, data[0].lon]).addTo(miMapa).bindPopup(direccionBuscada);
                // miMapa.panTo(new L.LatLng(data[0].lat, data[0].lon));
                dibujarDistancia(data[0].lat, data[0].lon);
            } else {
                alert("No se han encontrado datos");
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

// Funciï¿½n que se encarga de dibujar un punto en el mapa y agregar una una lï¿½nea desde la posiciï¿½n del usuario hasta el punto dibujado.
function dibujarDistancia(lat, lon) {
    // Dibujo el punto en el mapa.
    L.marker([lat, lon]).addTo(miMapa);
    // Array con los puntos del mapa que voy a usar para la lï¿½nea.
    const puntosLinea = [
        [posicionDelUsuario.latitude, posicionDelUsuario.longitude],
        [lat, lon]
    ];
    // Calculo la distancia usando la librerï¿½a. Divido entre 1000 para obtener los km y me quedo con 2 decimales.
    const distancia = Number(miMapa.distance([posicionDelUsuario.latitude, posicionDelUsuario.longitude], [lat, lon]) / 1000).toFixed(2);
    // Dibujo una lï¿½nea amarilla con un pop up mostrando la distancia.
    const polyline = L.polyline(puntosLinea, { color: 'yellow' }).addTo(miMapa).bindPopup(`Distancia ${distancia} km.`).openPopup();;
    // Centro el mapa en la lï¿½nea.
    miMapa.fitBounds(polyline.getBounds());
}

/******************************
 * QR
 ******************************/

function onDeviceReady() {
    // Pido permisos para usar la camara.
    QRScanner.prepare(prepareCallback);
}

//let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDMxNzc5ODY3YzZlMzE1M2I2YzlkMzciLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNjEzODU0NjE2fQ.w55R4V-N93O3v1IHgzHKtmw-oBwy9gtaOSVkx8mPmj0';

function prepareCallback(err, status) {
    if (err) {
        // En caso de cualquier tipo de error.
        ons.notification.alert(JSON.stringify(err));
    }
    if (status.authorized) {
        // Tenemos acceso y el escaner está inicializado.
    } else if (status.denied) {
        // El usuario rechazó el pedido, la pantalla queda en negro.
        ons.notification.alert('status.denied');
        // Podemos volver a preguntar mandando al usuario a la configuración de permisos con QRScanner.openSettings().
    } else {
        // Nos rechazaron solo por esta vez. Podríamos volver a hacer el pedido.
        ons.notification.toast("Nos cancelaron una sola vez", { timeout: 2000 });
    }
}

// Función que me lleva a la pantalla de escaneo.
function irAlScan() {
    myNavigator.pushPage("qrPage.html");
}

// Función que se dispara al ingresar a la página de escaneo.
function escanear() {
    // Si hay scanner
    if (window.QRScanner) {
        // Esto lo uso para mostrar la cam en la app.
        // Por defecto la vista previa queda por encima del body y el html.
        // Pero por un tema de compatibilidad con Onsen, queda por debajo de la page.
        // Mirar el css y ver cómo hay que hacer que esta page sea transparente para que se vea la cámara.
        window.QRScanner.show(
            function (status) {
                // Función de scan y su callback
                window.QRScanner.scan(scanCallback);
            }
        );
    }
}

function scanCallback(err, text) {
    if (err) {
        // Ocurrió un error o el escaneo fue cancelado(error code '6').
        ons.notification.alert(JSON.stringify(err));
    } else {
        // Si no hay error escondo el callback y vuelvo a la pantalla anterior pasando el string que se escaneó con la url del producto.
        QRScanner.hide();
        myNavigator.popPage({ data: { scanText: text } });
    }
}

// Si hay algo escaneado trae el producto y lo muestra
function cargarBusquedaQr() {
    // Si me pasaron datos por parámetro en la navegación.
    // Hacer this.data es lo mismo que hacer myNavigator.topPage.data
    if (this.data && this.data.scanText) {
        ons.notification.alert(this.data.scanText);
        $.ajax({
            type: "GET",
            url: this.data.scanText,
            contentType: "application/json",
            beforeSend: function(req) {
                req.setRequestHeader('x-auth', tokenGuardado)
            },
            success: function (responseBody) {
                ons.notification.toast("success", { timeout: 1500 });
                let r = responseBody.data[0];
                ons.notification.toast(JSON.stringify(r), { timeout: 5000 });
                let stringHtml =
                `
                <ons-list-item>
                    <div class="left">
                        <img class="list-item__thumbnail" src="http://ec2-54-210-28-85.compute-1.amazonaws.com:3000/assets/imgs/${r.urlImagen}.jpg">
                    </div>
                    <div class="center">
                        <span class="list-item__title">${r.nombre}</span>
                        <span class="list-item__subtitle">${r.etiquetas.join(',')}</span>
                    </div>
                    <div class="right">
                        <span class="list-item__title">$${r.precio}</span>
                    </div>
                </ons-list-item>
                `;
                
                $('#productos-list').html(stringHtml);
            },
            error: errorCallBack
        });
    }
}  

// Función de callback de error ajax.
function errorCallBack(resp) {
    console.log(resp);
    // Si el status es 401 quiere decir que no estoy autorizado.
    if (resp.status === 401) {
        ons.notification.alert("Usuario no autorizado");
    } else {
        ons.notification.alert(resp.responseJSON.error);
    }
}
