const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
//Paquete para incriptar contraseñas.
const bcrypt = require('bcrypt');
const _ = require('underscore');

//Middleware para comprobar la autenticación
const {verificar, checkRol} = require('../middlewares/authentication');

app.get('/usuario', verificar, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    //En el find usamos {} porque no estamos aplicando ningún filtrado, así nos devuelve todos los usuarios.
    Usuario.find({estado: true}, 'nombre email password google img rol')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        Usuario.count({estado: true}, (err, conteo) => {
            res.json({
                ok: true,
                cuantos: conteo,
                usuarios
            })
        })
    })
})

app.post('/usuario',  [verificar, checkRol], (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10) ,
        rol: body.rol
    })

    usuario.save(usuario, (err, usuarioDB) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        return res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
})

app.put('/usuario/:id', [verificar, checkRol], (req, res) => {
    let id = req.params.id;
    // Con el pick del underscore seleccionamos solo los campos que realmente se van a extraer del body de la req.
    let body = _.pick(req.body, ['nombre','password','img','rol','estado'])

    //En las options enviamos new a true para que devuelva el objeto actualizado
    //En las options enviamos runValidators para que cuando se actualice un objeto se lancen todos los validadores del schema
    Usuario.findByIdAndUpdate(id, body,{new: true, runValidators: true}, (err, usuarioDB) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        return res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})


app.delete('/usuario/:id', [verificar, checkRol], (req, res) => {

    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, {estado:false}, {new: true}, (err, usuarioDB) => {

        if(!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            })
        }

        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})


module.exports = app;
