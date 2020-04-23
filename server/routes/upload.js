const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

const fileUpload = require('express-fileupload');

// Declaro este middleware para que me meta en la req el file y así poder trabajar con él
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'no hay ficheros para subir'
            }
        });
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let file = req.files.nombre;
    const extensiones = ['jpg', 'gif', 'jpeg', 'png'];
    let extension = file.name.split('.');

    if(extensiones.indexOf(extension[extension.length - 1]) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `las extensiones validas son ${extensiones}`,
                ext: extension
            }
        })
    }

    const tipoPermitidos = ['usuarios','productos'];
    let tipo = req.params.tipo;
    let id = req.params.id;

    if(tipoPermitidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `El tipo no es válido, los tipos permitidos son: ${tipoPermitidos}`
            }
        })
    }

    let fileName = `${id}-${new Date().getMilliseconds()}.${extension[extension.length - 1]}`;

    // Use the mv() method to place the file somewhere on your server
    file.mv(`upload/${tipo}/${fileName}`, (err) =>{
        if (err) return res.status(500).json({
            ok: false,
            err
        });
        if(tipo === 'usuarios') imagenUsuario(id, res, fileName);
        if(tipo === 'productos') imagenProducto(id, res, fileName);
    });
})

function imagenProducto(id, res, fileName) {
    Producto.findById(id,(err, productoDB) => {

        if (err) {
            borraImagen(fileName, 'productos')
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            borraImagen(fileName, 'productos')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            })
        }

        let imagenBorra = productoDB.img;
        productoDB.img = fileName;
        productoDB.save(productoDB, (err, productoDB) => {

            if(err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            borraImagen(imagenBorra, 'productos')

            res.json({
                ok: true,
                message: 'Archivo subido correctamente',
                usuario: productoDB
            });
        })
    })
}

function imagenUsuario(id, res, fileName) {
    Usuario.findById(id,(err, usuarioDB) => {

            if (err) {
                borraImagen(fileName, 'usuarios')
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!usuarioDB) {
                borraImagen(fileName, 'usuarios')
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El usuario no existe'
                    }
                })
            }

            let imagenBorra = usuarioDB.img;
            usuarioDB.img = fileName;
            usuarioDB.save(usuarioDB, (err, usuarioDB) => {

                if(err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                borraImagen(imagenBorra, 'usuarios')

                res.json({
                    ok: true,
                    message: 'Archivo subido correctamente',
                    usuario: usuarioDB
                });
            })
        })
}

function borraImagen(img, tipo) {
    //Contruimos el path hasta la imagen y si existe la borramos.
    let pathUrl = path.resolve(__dirname, `../../upload/${tipo}/${img}`);
    if(fs.existsSync(pathUrl)) {
        fs.unlinkSync(pathUrl);
    }
    console.log(pathUrl);
}

module.exports = app;
