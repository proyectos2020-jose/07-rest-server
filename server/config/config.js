//Configuración del puerto
process.env.PORT = process.env.PORT || 3000;

// Configuración entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Configuracion mongo
process.env.url_db = (process.env.NODE_ENV !== 'dev') ? process.env.MONGO_URI : 'mongodb://localhost:27017/cafe';

// Secret para el jwt
process.env.JWT_SECRET = process.env.JWT_SECRET || 'este-es-el-seed-desarrollo';

// Expiración de jwt
process.env.JWT_EXPIRE = "30d";

// Client id de google
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '103372196632-vsom25ktrf61qku08kn85isjs7l1b7j2.apps.googleusercontent.com';
