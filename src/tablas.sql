
\c test;

-- Crear la tabla "users"
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Crear la tabla "emails"
CREATE TABLE emails (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  email VARCHAR(255) NOT NULL
);


-- Insertar usuarios y correos electrónicos
INSERT INTO users (id,name) VALUES (1,'Usuario 1');
INSERT INTO emails (user_id, email) VALUES (1, 'correo1_usuario1@example.com');
INSERT INTO emails (user_id, email) VALUES (1, 'correo2_usuario1@example.com');

INSERT INTO users (id,name) VALUES (2,'Usuario 2');
INSERT INTO emails (user_id, email) VALUES (2, 'correo1_usuario2@example.com');
INSERT INTO emails (user_id, email) VALUES (2, 'correo2_usuario2@example.com');