const mongoose = require('mongoose');

//Creamos el schema con mongoose
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

module.exports = mongoose.model('Categoria', categoriaSchema);
