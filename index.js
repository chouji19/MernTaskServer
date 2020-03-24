const express = require('express')
const conectarDB = require('./config/db');
const cors = require('cors')

//crearServidor 
const app = express();

conectarDB();

//habilitar cors
app.use(cors());

// habilotar express.json

app.use(express.json({ extended: true }))

//puerto de la app
const port = process.env.port || 4000;

//importar rutas 

app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/proyectos', require('./routes/proyectos'))
app.use('/api/tareas', require('./routes/tareas'))

app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta corriendo en el puerto ${port}`);
    
})