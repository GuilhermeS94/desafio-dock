const sql = require('mssql');
var conexao = require("./conexaodb");
var transacao = require("./transacaomd");

sql.on('error', err => {
    console.log(err);
});

/**
* Funcao que cria nova conta
* @param {number} idPessoa ID da pessoa dona da conta
* @param {number} saldo Saldo que a conta tera quando for criada
* @param {number} limiteSaqueDiario Limite de saque por dia da conta
* @param {boolean} flagAtivo Status se a conta esta ativa ou nao
* @param {number} tipoConta Tipo da conta que esta sendo criada
* @param {Date} dataCriacao Data da criacao da conta
* @return {Promise} Promise com sucesso ou erro da operacao
*/
function NovaConta(idPessoa, saldo, limiteSaqueDiario, flagAtivo, tipoConta, dataCriacao){
    return sql.connect(conexao).then(pool => {
        
        return pool.request()
            .input("id_pessoa", sql.Int, idPessoa)
            .input("saldo", sql.Decimal, saldo)
            .input("limite_saque_diario", sql.Decimal, limiteSaqueDiario)
            .input("conta_ativa", sql.Bit, flagAtivo)
            .input("tipo_conta", sql.Int, tipoConta)
            .input("data_criacao", sql.Date, dataCriacao)
            .query("INSERT INTO Contas(IdPessoa, Saldo, LimiteSaqueDiario, FlagAtivo, TipoConta, DataCriacao) VALUES (@id_pessoa, @saldo, @limite_saque_diario, @conta_ativa, @tipo_conta, @data_criacao)");
    
    });
};

/**
* Funcao que realiza deposito na conta
* @param {number} idConta ID da conta que deseja ver o saldo
* @param {number} valorDeposito Valor que deseja depositar
* @return {Promise} Promise com sucesso ou erro da operacao
*/
function DepositoEmConta(idConta, valorDeposito){
    return sql.connect(conexao).then(pool => {
        return pool.request()
            .input("id_conta", sql.Int, idConta)
            .input("valor_deposito", sql.Decimal, valorDeposito)
            .query("UPDATE Contas SET Saldo = (Saldo + @valor_deposito) WHERE IdConta = @id_conta");

    });
};

/**
* Funcao que retorna o saldo da conta
* @param {number} idConta ID da conta que deseja ver o saldo
* @return {Promise} Promise com sucesso ou erro da operacao
*/
function ConsultarSaldoDaConta(idConta){
    return sql.connect(conexao).then(pool => {
        
        return pool.request()
            .input("id_conta", sql.Int, idConta)
            .query("SELECT Saldo FROM Contas WHERE IdConta = @id_conta");
    
    });
};

/**
* Funcao atualiza saldo da conta
* @param {number} idConta ID da conta que deseja ver o saldo
* @param {number} valorSaque Valor que deseja sacar (numero negativo)
* @return {Promise} Promise com sucesso ou erro da operacao
*/
function SacarDaConta(idConta, valorSaque){
    return sql.connect(conexao).then(pool => {
        return pool.request()
            .input("id_conta", sql.Int, idConta)
            .input("valor_saque", sql.Decimal, valorSaque)
            .query("UPDATE Contas SET Saldo = (Saldo + @valor_saque) WHERE IdConta = @id_conta");

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