//Mongoose se usa para definir modelos de datos en mongodb
const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

//Creamos un schema con mongoose
let Schema = mongoose.Schema;

// Definimos un enumerado con los roles que son validos, y un mensaje de error en caso de que no lo sea.
const rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

//Definimos como va a ser ese schema
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    rol: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//Usamos mongoose-unique-validator para hacer mas user friendly el error devuelvo por el servicio
mongoose.plugin(uniqueValidator, {message: '{PATH} debe de ser único'})

usuarioSchema.methods.toJSON = function () {
    let usuario = this;
    userObject = usuario.toObject();
    delete userObject.password;
    return userObject;
}

//Exportamos el schema, y le damos un nombre con el que se reconocera donde se vaya a importar.
//El nombre que le damos tb es el que se usará en la colección pero en plural para guardar en mongodo.
module.exports = mongoose.model('Usuario', usuarioSchema);
