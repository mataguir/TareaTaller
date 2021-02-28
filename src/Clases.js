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

class Producto {
    constructor(
        pID,
        pCodigo,
        pNombre,
        pPrecio,
        pUrlImagen,
        pEstado,
        pEtiquetas
    ) {
        this.id = pID;
        this.codigo = pCodigo;
        this.nombre = pNombre;
        this.precio = pPrecio
        this.urlImagen = pUrlImagen
        this.estado = pEstado
        this.etiquetas = pEtiquetas
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

