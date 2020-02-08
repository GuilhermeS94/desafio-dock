var express = require('express');
var roteador = express.Router();

var conta = require("../modelos/contamd");

roteador.post("/nova-conta", (req, res)=>{
    conta.NovaConta();
});

// function DepositoEmConta(){
    
// };

roteador.get("/consultar-saldo/:idconta", (req, res)=>{
    
    conta.ConsultarSaldoDaConta(req.params.idconta).then(retorno => {
        var saldo = {Saldo:0};
        console.log(retorno);
        
        if(retorno.recordset.length > 0) saldo = retorno.recordset[0];
        else res.status(204).json(saldo);

        res.status(200).json(saldo);
    }).catch(err => {
        res.status(500).json(err);
    });;
    
});

roteador.put("/sacar", (req, res)=>{
    
    conta.SacarDaConta(req.body.idconta, req.body.saque).then(retorno => {
        var sucesso = {Efetuado:false};
        console.log(retorno);
        
        sucesso.Efetuado = retorno.rowsAffected[0] == 1;

        res.status(200).json(sucesso);
    }).catch(err => {
        res.status(500).json(err);
    });;
    
});

// function SacarDaConta(){
    
// };

// function ExtratoDeTransacoesDaConta(){
    
// };

// function ExtratoPorPeriodoDaConta(){
    
// };

module.exports = roteador;