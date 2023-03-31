import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import crypto from "crypto";

const schema = buildSchema(`
  type Producto {
    id: ID!
    title: String,
    description: String,
    code: String,
    price: Int,
    stock: Int,
    thumbnail: String,
    timestamp: String
  }
  input ProductoInput {
    title: String,
    description: String,
    code: String,
    price: Int,
    stock: Int,
    thumbnail: String,
    timestamp: String
  }
  type Query {
    getProducto(id: ID!): Producto,
    getProductos(campo: String, valor: String): [Producto],
  }
  type Mutation {
    createProducto(datos: ProductoInput): Producto
    updateProducto(id: ID!, datos: ProductoInput): Producto,
    deleteProducto(id: ID!): Producto,
  }
`);

const app = express();

// app.use(express.static("public"));

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: {
      getProductos,
      getProducto,
      createProducto,
      updateProducto,
      deleteProducto,
    },
    graphiql: true,
  })
);

const PORT = 8080;
app.listen(PORT, () => {
  const msg = `Servidor corriendo en puerto: http://localhost:${PORT}`;
  console.log(msg);
});

class Producto {
  constructor(id, { title, description, code, price, stock, thumbnail }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.code = code;
    this.price = price;
    this.stock = stock;
    this.thumbnail = thumbnail;
    this.timestamp = new Date().toLocaleString();
  }
}
const productosMap = {};

function getProductos({ campo, valor }) {
  const productos = Object.values(productosMap);
  if (campo && valor) {
    return productos.filter((p) => p[campo] == valor);
  } else {
    return productos;
  }
}

function getProducto({ id }) {
  if (!productosMap[id]) {
    throw new Error("Producto not found.");
  }
  return productosMap[id];
}

function createProducto({ datos }) {
  const id = crypto.randomBytes(10).toString("hex");
  const nuevoProducto = new Producto(id, datos);
  productosMap[id] = nuevoProducto;
  return nuevoProducto;
}

function updateProducto({ id, datos }) {
  if (!productosMap[id]) {
    throw new Error("Producto not found");
  }
  const productoActualizado = new Producto(id, datos);
  productosMap[id] = productoActualizado;
  return productoActualizado;
}

function deleteProducto({ id }) {
  if (!productosMap[id]) {
    throw new Error("Producto not found");
  }
  const productoBorrado = productosMap[id];
  delete productosMap[id];
  return productoBorrado;
}