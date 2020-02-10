var express = require('express');
var roteador = express.Router();
const swaggerInterface = require('swagger-ui-express');
const swaggerArquivo = require("../documentacao/des-dock-arq.json");

roteador.use("/docs", swaggerInterface.serve);
roteador.get("/docs", swaggerInterface.setup(swaggerArquivo));

module.exports = roteador;