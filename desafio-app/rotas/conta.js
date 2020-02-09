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
    //1 - salvar transacao da operacao
    transacao.SalvarTransacao(req.body.idconta, valorRealOperacao, req.body.dataExecucao).then(retornoTransacao => {
        
        if (retornoTransacao.rowsAffected[0] != 1) return res.status(500).json(sucesso);
        
        //2 - pegar valor total sacado no dia
        conta.ConsultarSaqueTotalPorDiaDaConta(req.body.idconta, req.body.dataExecucao).then(retornoCSTPDC =>{
            //3 - pegar limite de saque da conta
            conta.ConsultarLimiteSaqueDiarioDaConta(req.body.idconta).then(retornoCLSDC=>{
                //4 - Verifica se todos saques do dia, excedem o limite diario
                var verificador = retornoCLSDC.recordset[0].LimiteSaqueDiario - (retornoCSTPDC.recordset[0].saque_total_dia + (valorRealOperacao * -1));
                if (verificador < 0) return res.status(500).json({mensagem : "Limite de saque diario excedido."});

                //5 - efetua saque
                conta.SacarDaConta(req.body.idconta, valorRealOperacao, req.body.dataExecucao).then(retornoSaque => {
            
                    sucesso.Efetuado = retornoSaque.rowsAffected[0] == 1;
            
                    res.status(200).json(sucesso);
                }).catch(err => {
                    res.status(500).json(err);
                });
            }).catch(err => {
                res.status(500).json(err);
            });
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

roteador.get("/consultar-extrato/:idconta/:datainicial/:datafinal", (req, res)=>{
    
    conta.ExtratoPorPeriodoDaConta(req.params.idconta, req.params.datainicial, req.params.datafinal).then(retorno => {
        var sucesso = {Efetuado:false};
        
        if(retorno.rowsAffected[0] == 0) return res.status(204).json(sucesso);

        res.status(200).json(retorno.recordset);
    }).catch(err => {
        res.status(500).json(err);
    });
    
});

module.exports = roteador;