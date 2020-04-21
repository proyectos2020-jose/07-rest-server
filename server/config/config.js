//Configuración del puerto
process.env.PORT = process.env.PORT || 3000;

// Configuración entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Configuracion mongo
process.env.url_db = (process.env.NODE_ENV !== 'dev') ? process.env.MONGO_URI : 'mongodb://localhost:27017/cafe';

// Secret para el jwt
process.env.JWT_SECRET = process.env.JWT_SECRET || 'este-es-el-seed-desarrollo';

// Expiración de jwt
process.env.JWT_EXPIRE = 60 * 60 * 24 * 30;
