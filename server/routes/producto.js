const express = require('express')
const {verificar, checkRol} = require('../middlewares/authentication')
const app = express();
const Producto = require('../models/producto');
const _ = require('underscore');

app.get('/producto', verificar,  (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let hasta = req.query.hasta || 5;
    hasta = Number(hasta);

    Producto.find({})
        .skip(desde)
        .limit(hasta)
        .populate('usuario','email nombre')
        .populate('categoria','nombre')
        .exec((err, productos) => {

            if(err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Producto.count((err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    conteo
                })
            });
        })
});

app.get('/producto/:id', verificar,  (req, res) => {

    let id = req.params.id;

    Producto.findOne({_id: id})
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `No existe ningun producto con el id ${id}`
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    })

});

app.post('/producto', [verificar, checkRol],  (req, res) => {

    let producto = new Producto();
    producto.nombre = req.body.nombre;
    producto.precioUni = req.body.precioUni;
    producto.descripcion = req.body.descripcion;
    producto.categoria = req.body.id_categoria;
    producto.usuario = req.usuario._id;

    producto.save(producto, (err, producto) => {

        if(err) {
            return res.status(500).json({
                ok:false,
                err
            })
        }

        res.json({
            ok: true,
            producto
        })
    })
});


app.put('/producto/:id', [verificar, checkRol],  (req, res) => {

    let id = req.params.id;

    //Usar siempre el underscore para obtener los valores del body
    let body = _.pick(req.body, ['nombre','precioUni','descripcion','categoria','usuario']);

    //Actualizamos la producto y establecemos la opción de new:true para que nos devuelva el objeto modificado
    Producto.findByIdAndUpdate(id, body, {new: true, runValidators: true},(err, productoDB) => {
        if(err) {
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `No existe ningun producto con el id ${id}`
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })
});

app.get('/producto/buscar/:termino', verificar, (req, res)=> {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({nombre: regex})
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if(err) {
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: productoDB
            })
        })
} )

app.delete('/producto/:id', [verificar, checkRol],  (req, res) => {

    let id = req.params.id;

    //Actualizamos la producto y establecemos la opción de new:true para que nos devuelva el objeto modificado
    Producto.findByIdAndUpdate(id, {disponible: false}, {new: true, runValidators: true},(err, productoDB) => {
        if(err) {
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `No existe ningun producto con el id ${id}`
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })
});


module.exports = app;
