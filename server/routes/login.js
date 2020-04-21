const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

//Paquete para incriptar contraseñas.
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');

// Google sign-in
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

            let token = jwt.sign({usuario:usuarioDB}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});

            // Como la autenticación ha sido exitosa, entonces procedemos a generar un token.
            res.json({
                ok: true,
                usuario: usuarioDB,
                token: token
            })
        })
    }
)

//Configuraciones de google sing-in
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async (req, res) => {
    let token = req.body.idtoken;
    let usuarioGoogle = await verify(token)
                    .catch(err => {
                        return res.status(403).json({
                            ok: false,
                            err
                        })
                    })

    Usuario.findOne({email: usuarioGoogle.email}, (err, usuarioDB) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(usuarioDB) {
            // Si no es un usuario de google pero existe, es que se dió de alta de forma normal
            if(!usuarioDB.google) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El usuario ya se dió de alta de forma normal'
                    }
                })
            } else {

                let token = jwt.sign({usuario:usuarioDB}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        } else {

            // Si no existe el usuario lo damos de alta
            let usuario = new Usuario();
            usuario.email = usuarioGoogle.email;
            usuario.nombre = usuarioGoogle.nombre;
            usuario.img = usuarioGoogle.img;
            usuario.google = true;
            usuario.password = ';)';

            usuario.save(usuario, (err, usuarioDB) => {
                if(err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                let token = jwt.sign({usuario:usuarioDB}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            })
        }
    })
})

module.exports = app;
