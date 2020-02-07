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
        res.status(200).send(retorno.recordset);
    }).catch(err => {
        res.status(500).send(err);
    });;
    
});

// function SacarDaConta(){
    
// };

// function ExtratoDeTransacoesDaConta(){
    
// };

// function ExtratoPorPeriodoDaConta(){
    
// };

module.exports = roteador;