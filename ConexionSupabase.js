const mysql = require('mysql2/promise');
const { Client } = require('pg');

async function exponartarDatos() {
  const conexionMysql = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    port: 3309,
    database: 'ProyectoExpress'
  });

  const conexionPostgres = new Client({
    connectionString: 'postgresql://postgres.ydqlxpqxzflhbqeryton:Juanjo2411.@aws-0-us-east-1.pooler.supabase.com:5432/postgres',
    ssl: {
      rejectUnauthorized: false
    }
  });

  await conexionPostgres.connect();

  const [filas] = await conexionMysql.execute('SELECT * FROM persona');

  for (const fila of filas) {
    await conexionPostgres.query(
      'INSERT INTO persona (cedula, nombre, edad, profesion) VALUES ($1, $2, $3, $4)',
      [fila.cedula, fila.nombre, fila.edad, fila.profesion]
    );
    console.log(`Exportado: ${fila.nombre}`);
  }

  await conexionPostgres.end();
  await conexionMysql.end();
  console.log('Exportación completa.');
}

exponartarDatos(); 
