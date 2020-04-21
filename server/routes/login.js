const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

//Paquete para incriptar contraseñas.
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');

app.post('/login', (req, res) => {
        let body = req.body;

        Usuario.findOne({email: body.email},(err, usuarioDB) => {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if(!usuarioDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Credenciales incorrectas'
                    }
                })
            }

            if(!bcrypt.compareSync(body.password, usuarioDB.password)) {
                return res.status(401).json({
                    ok: false,
                    err: {
                        message: 'Credenciales incorrectas'
                    }
                })
            }

            let token = jwt.sign(
                {usuario:usuarioDB},
                process.env.JWT_SECRET,
                {expiresIn: process.env.JWT_EXPIRE});

            // Como la autenticación ha sido exitosa, entonces procedemos a generar un token.
            res.json({
                ok: true,
                usuario: usuarioDB,
                token: token
            })
        })
    }
)

module.exports = app;
