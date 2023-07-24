// Servidor Express

// Para probar los ficheros estáticos del fronend, entrar en <http://localhost:4500/>
// Para probar el API, entrar en <http://localhost:4500/api/items>

// Imports

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();
const bcrypt = require('bcrypt');

// Arracar el servidor

const server = express();

// Configuración del servidor

server.use(cors());
server.use(express.json({ limit: '25mb' }));

// Conexion a la base de datos

async function getConnection() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS,
    database: process.env.DB_NAME || 'Clase',
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

// GET all

server.get('/recetas', async (req, res) => {
  try {
    const select = 'select * from recetas';
    const conn = await getConnection();
    const [result] = await conn.query(select);
    conn.end();
    res.json({
      info: result.length,
      results: result,
    });
  } catch (error) {
    res.json({
      success: false,
      message: 'Ha ocurrido un error',
    });
  }
});

// GET by id

server.get('/recetas/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const select = 'select * from recetas where id = ?';
    const conn = await getConnection();
    const [result] = await conn.query(select, [id]);
    conn.end();
    res.json({
      results: result,
    });
  } catch (error) {
    res.json({
      success: false,
      message: 'Ha ocurrido un error',
    });
  }
});

//POST

server.post('/recetas', async (req, res) => {
  const newRecipe = req.body;
  try {
    const insert =
      'INSERT INTO recetas (`nombre`, `ingredientes`, `instrucciones`) VALUES (?,?,?)';
    const conn = await getConnection();
    const [result] = await conn.query(insert, [
      newRecipe.nombre,
      newRecipe.ingredientes,
      newRecipe.instrucciones,
    ]);
    conn.end();
    res.json({
      success: true,
      id: result.id,
    });
  } catch (error) {
    res.json({
      success: false,
      message: 'Ha ocurrido un error',
    });
  }
});

//PUT

server.put('/recetas/:id', async (req, res) => {
  const id = req.params.id;
  const { nombre, ingredientes, instrucciones } = req.body;
  try {
    const update =
      'UPDATE recetas SET nombre= ?, ingredientes= ?, instrucciones= ? WHERE id= ?';
    const conn = await getConnection();
    const [result] = await conn.query(update, [
      nombre,
      ingredientes,
      instrucciones,
      id,
    ]);
    conn.end();
    res.json({
      success: true,
    });
  } catch (error) {
    res.json({
      succes: false,
      message: 'Ha ocurrido un error',
    });
  }
});

//DELETE

server.delete('/recetas/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const deleteSql = 'DELETE FROM recetas WHERE id = ?';
    const conn = await getConnection();
    const [result] = await conn.query(deleteSql, [id]);
    conn.end();
    res.json({
      success: true,
    });
  } catch (error) {
    res.json({
      succes: false,
      message: 'Ha ocurrido un error',
    });
  }
});

//POST record

server.post('/registro', async (req, res) => {
  try {
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const conn = await getConnection();
    conn.query(
      'INSERT INTO usuarios_db (email, nombre, password) VALUES (?, ?, ?)',
      [req.body.email, req.body.nombre, passwordHash]
    );
    conn.end();
    res.json({
      success: true,
    });
  } catch (error) {
    res.json({
      succes: false,
      message: 'Ha ocurrido un error',
    });
  }
});

// POST login
server.post('/login', async (req, res) => {
  const conn = await getConnection();
  const [users] = await conn.query(
    'SELECT * FROM usuarios_db WHERE nombre = ? ',
    [req.body]
  );
  if (users.length !== 1) {
    res.json({
      success: false,
      message: 'Usuario o contraseña no válidos',
    });
    return;
  }
  const [userdata] = users;
  if (!(await bcrypt.compare(req.body.password, userdata.password))) {
    res.json({
      success: false,
      message: 'Usuario o contraseña no válidos',
    });
    return;
  }

  conn.end();
  res.json({
    success: true,
    token: { id: userdata.id, name: userdata.name },
  });
});
