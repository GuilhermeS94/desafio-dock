const sql = require('mssql');
var conexao = require("./conexaodb");

sql.on('error', err => {
    console.log(err);
});

/**
* Funcao que salva transacao
* @param {number} idConta ID da conta que executou a transacao
* @param {number} valor Valor da transacao
* @param {number} dataExecucao Data de execucao da transacao
* @return {Promise} Promise com sucesso ou erro da operacao
*/
function SalvarTransacao(idConta, valor, dataExecucao){
    return sql.connect(conexao).then(pool => {
        return pool.request()
            .input("id_conta", sql.Int, idConta)
            .input("valor", sql.Decimal, valor)
            .input("data_operacao", sql.Date, dataExecucao)
            .query("INSERT INTO Transacoes (IdConta, Valor, [Data]) VALUES (@id_conta, @valor, @data_operacao)");
    });
};

module.exports = {
    SalvarTransacao
};