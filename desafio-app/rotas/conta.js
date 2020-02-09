var express = require('express');
var roteador = express.Router();

var conta = require("../modelos/contamd");
var transacao = require("../modelos/transacaomd");

roteador.post("/nova-conta", (req, res)=>{
    var sucesso = {Efetuado:false};
    conta.NovaConta(req.body.idpessoa, req.body.saldo, req.body.limitesaquediario, req.body.flagativo, req.body.tipoconta, req.body.datacriacao).then(retorno =>{
        
        if (retorno.rowsAffected[0] != 1) return res.status(500).json(sucesso);
        
        sucesso.Efetuado = true;
    
        res.status(200).json(sucesso);
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

roteador.put("/depositar", (req, res)=>{
    var sucesso = {Efetuado:false};
    
    transacao.SalvarTransacao(req.body.idconta, req.body.deposito, req.body.dataExecucao).then(retornoTransacao => {
        if (retornoTransacao.rowsAffected[0] != 1) return res.status(500).json(sucesso);
        
        conta.DepositoEmConta(req.body.idconta, req.body.deposito).then(retornoDeposito => {
            
            sucesso.Efetuado = retornoDeposito.rowsAffected[0] == 1;
    
            res.status(200).json(sucesso);
        }).catch(err => {
            res.status(500).json(err);
        });
    }).catch(err => {
        res.status(500).json(err);
    });
});

roteador.get("/consultar-saldo/:idconta", (req, res)=>{
    
    conta.ConsultarSaldoDaConta(req.params.idconta).then(retorno => {
        var saldo = {Saldo:0};
        console.log(retorno);
        
        if(retorno.recordset.length > 0) saldo = retorno.recordset[0];
        else res.status(204).json(saldo);

        res.status(200).json(saldo);
    }).catch(err => {
        res.status(500).json(err);
    });
    
});

roteador.put("/sacar", (req, res)=>{
    var sucesso = {Efetuado:false};
    var valorRealOperacao = (req.body.saque > 0) ? (req.body.saque * -1) : req.body.saque;
    transacao.SalvarTransacao(req.body.idconta, valorRealOperacao, req.body.dataExecucao).then(retornoTransacao => {
        if (retornoTransacao.rowsAffected[0] != 1) return res.status(500).json(sucesso);
        
        conta.SacarDaConta(req.body.idconta, valorRealOperacao).then(retornoSaque => {
            
            sucesso.Efetuado = retornoSaque.rowsAffected[0] == 1;
    
            res.status(200).json(sucesso);
        }).catch(err => {
            res.status(500).json(err);
        });
    }).catch(err => {
        res.status(500).json(err);
    });
});

roteador.put("/bloquear", (req, res)=>{
    var sucesso = {Efetuado:false};
    
    conta.BloquearConta(req.body.idconta).then(retornoBloqueio => {
        
        sucesso.Efetuado = retornoBloqueio.rowsAffected[0] == 1;

        res.status(200).json(sucesso);
    }).catch(err => {
        res.status(500).json(err);
    });
});

// function ExtratoDeTransacoesDaConta(){
    
// };

// function ExtratoPorPeriodoDaConta(){
    
// };

module.exports = roteador;