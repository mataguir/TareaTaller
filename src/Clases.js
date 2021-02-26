class Usuario {
    constructor(
        pNombre,
        pApellido,
        pDireccion,
        pEmail,
        pPassword
    ) {
        this.nombre = pNombre;
        this.apellido = pApellido;
        this.direccion = pDireccion;
        this.email = pEmail;
        this.password = pPassword;
    }
}

class Pedido {
    constructor(
        pIdProducto,
        pCantidad,
        pIdSucursal,
    ) {
        this.idProducto = pIdProducto;
        this.cantidad = pCantidad;
        this.idSucursal = pIdSucursal ;
    }
}

