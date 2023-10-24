const express = require('express');
const { Pool } = require('pg');

// Configuración de la base de datos
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'test',
  password: 'h',
  port: 5432,
});

const app = express();
app.use(express.json());

// Ruta basica
app.get('/status', async (req, res) => {
    try {
      res.json('pong');
    } catch (error) {
      res.status(500).json({ error: 'Error' });
    }
  });



// ruta de listado de todos los usuarios
app.get('/directories', async (req, res) => {
  try {
    const client = await pool.connect();
    const count = await client.query("SELECT count(*) FROM users;");
    const result = await client.query("SELECT u.id, u.name, array_agg(e.email) AS emails FROM users u JOIN emails e ON u.id = e.user_id GROUP BY u.id, u.name ORDER BY u.id ASC;");
    const users = result.rows;
    client.release();
    res.json({count:count.rows[0].count,
              next:"pagina siguiente",
              previous:"pagina previa",
              results:users
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// Ruta para crear un nuevo usuario
app.post('/directories', async (req, res) => {
  const {id,name, emails } = req.body;
    console.log(id,name,emails);
  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO users (id, name) VALUES ($1, $2) ',
    [id, name]
    );
    await Promise.all(emails.map(async (element) => {
        await client.query('INSERT INTO emails (user_id, email) VALUES ($1, $2)', [id, element]);
    }));
    client.release();
    res.status(201).json('usuario creado');
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el objeto' });
  }
});


// Ruta para obtener un usuario
app.get('/directories/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const client = await pool.connect();
      const result = await client.query("SELECT u.name, array_agg(e.email) AS emails FROM users u JOIN emails e ON u.id = e.user_id WHERE u.id = $1 GROUP BY u.name " ,[id]);
      client.release();
      res.json(result.rows[0]);
    } catch (error) {
        console.log(error);
      res.status(500).json({ error: 'Error' });
    }
  });


// Ruta para actualizar un usuario
app.put('/directories/:id', async (req, res) => {
  const id = req.params.id;
  const {name, emails } = req.body;
  try {
    const client = await pool.connect();

    const id_emails = await client.query(
      'SELECT id from emails where user_id = $1',
      [id]
    );

    const result = await client.query(
      'UPDATE users SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    
  
    console.log(emails[0],emails[1]);
    await Promise.all(id_emails.rows.map(async (element,i) => {
      console.log(emails[i],element.id);
      await client.query('UPDATE emails SET email = $1 WHERE id = $2 RETURNING *', [emails[i], element.id]);
  }));



    const updatedUser = result.rows[0];
    client.release();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

app.patch('/users/:id', async (req, res) => {
  //
});

// Ruta para eliminar un usuario
app.delete('/directories/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const client = await pool.connect();
    await client.query('DELETE FROM emails WHERE user_id = $1', [id]);
    await client.query('DELETE FROM users WHERE id = $1', [id]);
    client.release();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});