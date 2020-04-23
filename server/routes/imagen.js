const express = require('express');
const app = express();

const path = require('path');
const fs = require('fs');
const { verificarImg } = require('../middlewares/authentication');

app.get('/imagen/:tipo/:img', verificarImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathImg = path.resolve(__dirname, `../../upload/${tipo}/${img}`);

    if( !fs.existsSync(pathImg)) {
        res.sendFile(path.resolve(__dirname, '../assets/img/img_not_found.png'));
    } else {
        res.sendFile(pathImg);
    }
})

module.exports = app;
