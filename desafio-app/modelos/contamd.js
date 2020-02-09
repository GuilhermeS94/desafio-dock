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
            .query(
                `INSERT INTO Contas
                (IdPessoa, Saldo, LimiteSaqueDiario, FlagAtivo, TipoConta, DataCriacao) VALUES
                (@id_pessoa, @saldo, @limite_saque_diario, @conta_ativa, @tipo_conta, @data_criacao)`
            );
    
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
            .query(`UPDATE Contas SET Saldo = (Saldo + @valor_deposito) WHERE IdConta = @id_conta`);

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
            .query(`SELECT Saldo FROM Contas WHERE IdConta = @id_conta`);
    
    });
};

/**
* Funcao que retorna o limite de saque diario da conta
* @param {number} idConta ID da conta que deseja ver o limite de saque diario
* @return {Promise} Promise com sucesso ou erro da operacao
*/
function ConsultarLimiteSaqueDiarioDaConta(idConta){
    return sql.connect(conexao).then(pool => {
        
        return pool.request()
            .input("id_conta", sql.Int, idConta)
            .query(`SELECT LimiteSaqueDiario FROM Contas WHERE IdConta = @id_conta`);
    });
};

/**
* Funcao que consulta o valor total de saque do dia
* @param {number} idConta ID da conta que deseja ver o saldo
* @return {Promise} Promise com sucesso ou erro da operacao
*/
function ConsultarSaqueTotalPorDiaDaConta(idConta, dataExecucao){
    return sql.connect(conexao).then(pool => {
        
        return pool.request()
            .input("id_conta", sql.Int, idConta)
            .input("data_execucao", sql.Date, dataExecucao)
            .query(`SELECT (SUM(Valor)* -1) as saque_total_dia FROM Transacoes 
                    WHERE IdConta = @id_conta AND
                        Valor < 0 AND
                        DataExecucao = @data_execucao`
            );
    
    });
};

/**
* Funcao atualiza saldo da conta
* @param {number} idConta ID da conta que deseja ver o saldo
* @param {number} valorSaque Valor que deseja sacar (numero negativo)
* @return {Promise} Promise com sucesso ou erro da operacao
*/
function SacarDaConta(idConta, valorSaque, dataExecucao){
    return sql.connect(conexao).then(pool => {
        return pool.request()
            .input("id_conta", sql.Int, idConta)
            .input("valor_saque", sql.Decimal, valorSaque)
            .query(`UPDATE Contas SET Saldo = (Saldo + @valor_saque) WHERE IdConta = @id_conta`);
    });
};

/**
* Funcao bloqueia uma conta
* @param {number} idConta ID da conta que deseja bloquear
* @return {Promise} Promise com sucesso ou erro da operacao
*/
function BloquearConta(idConta){
    return sql.connect(conexao).then(pool => {
        return pool.request()
            .input("id_conta", sql.Int, idConta)
            .input("conta_ativa", sql.Bit, false)
            .query(`UPDATE Contas SET FlagAtivo = @conta_ativa WHERE IdConta = @id_conta`);
    });
};

/**
* Funcao que retorna o extrato da conta
* @param {number} idConta ID da conta que deseja ver o extrato
* @return {Promise} Promise com sucesso ou erro da operacao
*/
function ConsultarExtratoDaConta(idConta){
    return sql.connect(conexao).then(pool => {
        
        return pool.request()
            .input("id_conta", sql.Int, idConta)
            .query(`SELECT Valor, DataExecucao FROM Transacoes WHERE IdConta = @id_conta`);
    
    });
};

/**
* Funcao que retorna o extrato da conta
* @param {number} idConta ID da conta que deseja ver o extrato
* @param {Date} dataInicial Data do inicio do intervalo que deseja ver o extrato
* @param {Date} dataFinal Data do fim do intervalo que deseja ver o extrato
* @return {Promise} Promise com sucesso ou erro da operacao
*/
function ExtratoPorPeriodoDaConta(idConta, dataInicial, dataFinal){
    return sql.connect(conexao).then(pool => {
        
        return pool.request()
            .input("id_conta", sql.Int, idConta)
            .input("data_inicial", sql.Date, dataInicial)
            .input("data_final", sql.Date, dataFinal)
            .query(
                `SELECT Valor, DataExecucao FROM Transacoes
                WHERE IdConta = @id_conta AND
                    DataExecucao BETWEEN @data_inicial AND @data_final
                ORDER BY DataExecucao DESC`
            );
    });
};

module.exports = {
    NovaConta,
    DepositoEmConta,
    ConsultarSaldoDaConta,
    SacarDaConta,
    BloquearConta,
    ConsultarExtratoDaConta,
    ExtratoPorPeriodoDaConta,
    ConsultarSaqueTotalPorDiaDaConta,
    ConsultarLimiteSaqueDiarioDaConta
};