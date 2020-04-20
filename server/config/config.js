//Configuración del puerto
process.env.PORT = process.env.PORT || 3000;

// Configuración entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Configuracion mongo
process.env.url_db = (process.env.NODE_ENV !== 'dev') ? 'mongodb+srv://jose:l9tbKq8LVTHanSpj@cluster0-27vq3.mongodb.net/cafe' : 'mongodb://localhost:27017/cafe';
