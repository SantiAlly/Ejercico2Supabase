const express = require('express');
const connection = require('./db')

const app = express();
const PORT = 3000;

app.use(express.json()); //

app.use(express.urlencoded({extended:true}));

app.get('/api/prueba', (req, res) => {
    res.send('API funcionando de manera correcta');
});

app.get('/api/prueba1', (req, res) => {

    res.status(200).json({
        message: 'LA API RESPONDE CORRECTAMENTE',
        port: PORT,
        status: 'success'
    });
});

app.post('/api/guardar', async (req, res) => {
    const { cedula, nombre, edad, profesion } = req.body;

    try {
        const query = 'INSERT INTO persona (cedula, nombre, edad, profesion) VALUES ($1, $2, $3, $4)';
        await connection.query(query, [cedula, nombre, edad, profesion]);

        res.status(200).json({ cedula, nombre, edad, profesion });
    } catch (error) {
        res.status(500).json({
            message: 'ERROR CREANDO EL USUARIO',
            error: error.message
        });
    }
});

app.get('/api/obtener', async (req, res) => {
    try {
        const result = await connection.query('SELECT * FROM persona');
        res.status(200).json({
            success: true,
            message: 'Datos de la tabla',
            data: result.rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al recuperar los datos',
            detalle: error.message
        });
    }
});

app.delete('/api/eliminar/:cedula', async (req, res) => {
    const { cedula } = req.params;

    try {
        const result = await connection.query('DELETE FROM persona WHERE cedula = $1', [cedula]);

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: `No existe el registro ${cedula}`
            });
        } else {
            res.status(200).json({
                success: true,
                message: 'Dato eliminado de la tabla',
                data: result
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al Eliminar el registro',
            details: error.message
        });
    }
});

app.put('/api/actualizar/:cedula', async (req, res) => {
    const { cedula } = req.params;
    const { nombre, edad, profesion } = req.body;

    try {
        const result = await connection.query(
            'UPDATE persona SET nombre = $1, edad = $2, profesion = $3 WHERE cedula = $4',
            [nombre, edad, profesion, cedula]
        );

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: `No se encontró ningún registro con la cédula ${cedula}`
            });
        } else {
            res.status(200).json({
                success: true,
                message: 'Registro actualizado exitosamente',
                data: { cedula, nombre, edad, profesion }
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el registro',
            details: error.message
        });
    }
});

app.listen(PORT, ()=>{

    console.log('Servidor Corriendo');
  
});


