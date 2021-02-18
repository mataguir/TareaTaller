class Usuario {
    constructor(
        pId,
        pNombre,
        pApellido,
        pCalle,
        pNumeroP,
        pEmail,
        pPassword
    ) {
        this._id = pId;
        this.nombre = pNombre;
        this.apellido = pApellido;
        this.calle = pCalle;
        this.numeroP = pNumeroP;
        this.email = pEmail;
        this.password = pPassword;
    }
}

class NuevoPedido {
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

