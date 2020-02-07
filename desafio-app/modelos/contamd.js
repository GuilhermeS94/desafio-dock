const sql = require('mssql');
var dotenv = require("dotenv");

dotenv.config();

const config = {
    user: process.env.USUARIO_DB,
    password: process.env.SENHA_DB,
    server: process.env.SERVIDOR_DB, 
    database: process.env.DB ,
    options: { //opcoes obrigatorias porque a padrao esta deprecated
        encrypt: true,
        enableArithAbort: true
    }
};


sql.on('error', err => {
    console.log(err);
});

function NovaConta(){
    
};

function DepositoEmConta(){
    
};

function ConsultarSaldoDaConta(idConta, retorno){
    return sql.connect(config).then(pool => {
        
        return pool.request()
            .input("id_conta", sql.Int, idConta)
            .query("select * from Contas where IdConta = @id_conta");
    
    });
};

function SacarDaConta(){
    
};

function ExtratoDeTransacoesDaConta(){
    
};

function ExtratoPorPeriodoDaConta(){
    
};

module.exports = {
    NovaConta,
    DepositoEmConta,
    ConsultarSaldoDaConta,
    SacarDaConta,
    ExtratoDeTransacoesDaConta,
    ExtratoPorPeriodoDaConta
};