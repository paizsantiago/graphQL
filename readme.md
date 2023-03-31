query getTodosFiltro {
  getProductos(campo: "title", valor: "3080 ti") {
    title
    id
  }
}

query getUno {
  getProducto(id: "0275f3c2379acc6c1451") {
    id
    title
  }
}

mutation crear {
  createProducto(datos: {title: "3080 ti"}) {
    id
    title
  }
}

mutation updateUno {
  updateProducto(id: "f2a96fd9dc02a722686a", datos: {title: "Procesador I5", price: 40000}) {
    id
    title
    price
  }
}

mutation deleteUno {
  deleteProducto(id: "7cd941f3d31937487651") {
    id
  }
}