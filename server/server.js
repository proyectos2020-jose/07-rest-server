require('./config/config');
const express = require('express')
const mongoose = require('mongoose')
const app = express()
//Paquete usado para obtener en formato json los valores enviados en el body de la request.
const bodyParser = require('body-parser');

// Cuando se hace use, es porque son middlewares. Son funciones que se van a ejecutar para cada petición.
// parse application/x-www-form-urlencoded.
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

//Generamos las rutas en forma de middleware y las importamos a nuestro servidor.
app.use(require('./routes/usuario'));

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
