// Servidor Express

// Para probar los ficheros estáticos del fronend, entrar en <http://localhost:4500/>
// Para probar el API, entrar en <http://localhost:4500/api/items>

// Imports

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require('dotenv').config()

// Arracar el servidor

const server = express();

// Configuración del servidor

server.use(cors());
server.use(express.json({limit: "25mb"}));

// Conexion a la base de datos

async function getConnection() {
  const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS,
      database: process.env.DB_NAME || "Clase",
    });

  connection.connect();

  return connection;
}

// Poner a escuchar el servidor

const port = 4500;
server.listen(port, () => {
  console.log(`Ya se ha arrancado nuestro servidor: http://localhost:${port}/`);
});

// Endpoints

// GET todas las recetas

server.get("/api/recetas", async (req, res) => {
const select = "select * from recetas";
const conn = await getConnection();
const[result] = await conn.query(select);
conn.end();
res.json({
  "info": result.length, 
"results": result
});
});

// GET por id

server.get("/api/recetas/:id", async (req, res) => {
  const id = req.params.id;
  const select= "select * from recetas where id = ?";
  const conn = await getConnection();
  const [result] = await conn.query(select, [id]);
  conn.end();
  console.log(result);
  res.json({
    results: result,
    });
  });

  //POST 

  server.post("/api/recetas", async (req, res) => {
    const newRecipe = req.body;
    const insert = "INSERT INTO recetas (`nombre`, `ingredientes`, `instrucciones`) VALUES (?,?,?)";
    const conn = await getConnection();
    const [result] = await conn.query(insert, [
      newRecipe.nombre, 
      newRecipe.ingredientes, 
      newRecipe.instrucciones
    ]);
    conn.end();
    res.json({
      success: true,
      id: result.id,
    });
  });
