require('./config/config');
const express = require('express')
const mongoose = require('mongoose')
const app = express()
//Paquete usado para obtener en formato json los valores enviados en el body de la request.
const bodyParser = require('body-parser');

//Usamos una utilidad de nodde llamada path para generar rutas por trozos
const path = require('path')

// Cuando se hace use, es porque son middlewares. Son funciones que se van a ejecutar para cada petición.
// parse application/x-www-form-urlencoded.
app.use(bodyParser.urlencoded({ extended: false }))

app.use(require('./routes/index'));

// parse application/json
app.use(bodyParser.json());

// Hacemos pública la carpeta /public
app.use(express.static(path.resolve(__dirname , '../public')));

// Se han metido todos estos uses para que los use mongoose y no de deprecados.
mongoose.connect(process.env.url_db, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true},(err, res) => {
    if(err) {
        throw err;
    }
    console.log('base de datos online');
})

app.listen(process.env.PORT, ()=> {
    console.log(`Escuchando en el puerto ${process.env.PORT}`)
})
