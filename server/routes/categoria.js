const express = require('express')
const {verificar, checkRol} = require('../middlewares/authentication')
const app = express();
const Categoria = require('../models/categoria');

app.get('/categoria', verificar,  (req, res) => {

    Categoria.find({})
        .populate('usuario')
        .exec((err, categorias) => {

            if(err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Categoria.count((err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    conteo
                })
            });
        })
});

app.get('/categoria/:id', verificar,  (req, res) => {

    let id = req.params.id;
    console.log(id);
    Categoria.findOne({_id: id}, (err, categoriaDB) => {
        console.log(categoriaDB);
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `No existe ninguna categoría con el id ${id}`
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })

});

app.post('/categoria', [verificar, checkRol],  (req, res) => {

    let categoria = new Categoria();
    categoria.nombre = req.body.nombre;
    categoria.usuario = req.usuario._id;

    categoria.save(categoria, (err, categoria) => {

        if(err) {
            return res.status(500).json({
                ok:false,
                err
            })
        }

        res.json({
            ok: true,
            categoria
        })
    })
});

app.put('/categoria/:id', [verificar, checkRol],  (req, res) => {

    let id = req.params.id;
    let nombre = req.body.nombre;

    //Actualizamos la categoria y establecemos la opción de new:true para que nos devuelva el objeto modificado
    Categoria.findByIdAndUpdate(id, {nombre: nombre}, {new: true, runValidators: true},(err, categoriaDB) => {
        if(err) {
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `No existe ninguna categoría con el id ${id}`
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
});

app.delete('/categoria/:id', [verificar, checkRol],  (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `No existe ninguna categoria con el id ${id}`
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
});

module.exports = app;
