var express = require('express');
var roteador = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../documentacao/des-dock-arq.json');

roteador.use('/api-docs', swaggerUi.serve);
roteador.get('/api-docs', swaggerUi.setup(swaggerDocument));

module.exports = roteador;