var express = require("express");
var bp = require("body-parser");
var dotenv = require("dotenv");

const conta = require("./rotas/conta");
const documentacao = require("./rotas/desafio-documentacao");

//Configuracoes basicas INI

dotenv.config();
var app = express();

app.use(bp.urlencoded({extended:true}));
app.use(bp.json());

app.use((req, res, next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

//Configuracoes basicas FIM

//Rotas INI
app.use("/conta", conta);
app.use(documentacao);
//Rotas FIM

app.listen(process.env.PORTA, ()=>{
    console.log(`Server listening on ${process.env.PORTA} port`);
});