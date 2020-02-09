var dotenv = require("dotenv");

dotenv.config();

module.exports = {
    user: process.env.USUARIO_DB,
    password: process.env.SENHA_DB,
    server: process.env.SERVIDOR_DB, 
    database: process.env.DB ,
    options: { //opcoes obrigatorias porque a padrao esta deprecated
        encrypt: true,
        enableArithAbort: true
    }
};