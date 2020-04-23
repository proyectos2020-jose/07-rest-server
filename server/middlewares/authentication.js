const jwt = require('jsonwebtoken');

//Verificar token
let verificar = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) {
            return res.status(401).json({
                ok:false,
                err
            })
        }

        req.usuario = decoded.usuario;
        //Se hace el next para que continue ejecutando el resto de la llamada, sino se quedaría aquí.
        next();
    })

}

let checkRol = (req, res, next) => {
    let usuario = req.usuario;

    if(usuario.rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'No tienes permisos para la operación solicitada'
            }
        })
    }
    next();
}

module.exports = {verificar, checkRol};
