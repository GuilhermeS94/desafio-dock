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

/**
* Funcao que retorna o saldo da conta
* @param {number} idConta ID da conta que deseja ver o saldo
* @return {Promise} Promise com sucesso ou erro da operacao
*/
function ConsultarSaldoDaConta(idConta){
    return sql.connect(config).then(pool => {
        
        return pool.request()
            .input("id_conta", sql.Int, idConta)
            .query("SELECT Saldo FROM Contas WHERE IdConta = @id_conta");
    
    });
};

/**
* Funcao que salva transacao e atualiza saldo da conta
* @param {number} idConta ID da conta que deseja ver o saldo
* @param {number} valorSaque Valor que deseja sacar
* @return {Promise} Promise com sucesso ou erro da operacao
*/
function SacarDaConta(idConta, valorSaque){
    return sql.connect(config).then(pool => {
        
        return pool.request()
            .input("id_conta", sql.Int, idConta)
            .input("valor_saque", sql.Decimal, valorSaque)
            .query("UPDATE Contas SET Saldo = (Saldo - @valor_saque) WHERE IdConta = @id_conta");
    
    });
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