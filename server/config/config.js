// ========= ========= ========= =========
// PUERTO
// ========= ========= ========= =========
process.env.PORT = process.env.PORT || 3000;

// ========= ========= ========= =========
//  ENTORNO
// ========= ========= ========= =========
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ========= ========= ========= =========
//  VENCIMIENTO DEL TOKEN
// ========= ========= ========= =========
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ========= ========= ========= =========
//  SEED de Autenticación
// ========= ========= ========= =========
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ========= ========= ========= =========
// BASE DE DATOS
// ========= ========= ========= =========
let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URL;
}
process.env.URLDB = urlDB;
// ========= ========= ========= =========
// GOOGLE CLIENT ID
// ========= ========= ========= =========

process.env.CLIENT_ID = process.env.CLIENT_ID || '1028211955176-i0938pj7avll6hb4e38l58beuer9l5ol.apps.googleusercontent.com';