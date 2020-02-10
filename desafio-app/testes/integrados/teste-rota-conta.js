const supertest = require("supertest");
const app = require("../../index");

//testes de sucesso
describe("deve criar uma nova conta bancaria", function () {
    let data = {
        "idpessoa": "1",
        "saldo": "198765.56",
        "limitesaquediario": "876.99",
        "flagativo": "true",
        "tipoconta": "3",
        "datacriacao": "2020-02-09"
    };
    it("nova conta bancaria criada", function (done) {
        supertest(app)
            .post("/conta/nova-conta")
            .send(data)
            .expect(200);
            done();
    });
});

describe("deve efetuar um deposito em conta bancaria", function () {
    let data = {
        'idconta': '3',
        'deposito': '987675.34',
        'dataExecucao': '2020-02-09'
    };
    it("deposito efetuado", function (done) {
        supertest(app)
            .post("/conta/depositar")
            .send(data)
            .expect(200);
            done();
    });
});

describe("deve consultar o saldo da conta bancaria", function () {
    let data = {
        'idconta': '3',
        'deposito': '987675.34',
        'dataExecucao': '2020-02-09'
    };
    it("saldo consultado", function (done) {
        supertest(app)
            .get("/consultar-saldo/2")
            .expect(200);
            done();
    });
});

describe("deve efetuar um saque da conta bancaria", function () {
    let data = {
        'idconta': '3',
        'saque': '100000',
        'dataExecucao': '2020-02-09'
    };
    it("saque efetuado", function (done) {
        supertest(app)
            .put("/conta/sacar")
            .send(data)
            .expect(200);
            done();
    });
});

describe("deve bloquear a conta bancaria", function () {
    let data = {
        'idconta': '2'
    };
    it("conta bloqueada", function (done) {
        supertest(app)
            .put("/conta/bloquear")
            .send(data)
            .expect(200);
            done();
    });
});

describe("deve consultar o extrato da conta bancaria", function () {

    it("extrato consultado", function (done) {
        supertest(app)
            .get("/conta/consultar-extrato/2")
            .expect(200);
            done();
    });
});

describe("deve consultar o extrato por periodo da conta bancaria", function () {

    it("extrato de um periodo consultado", function (done) {
        supertest(app)
            .get("/conta/consultar-extrato/1/2020-01-01/2020-02-10")
            .expect(200);
            done();
    });
});

// testes de falha
describe("nao deve criar uma nova conta bancaria", function () {
    let data = {
        "idpessoa": "99",
        "saldo": "198765.56",
        "limitesaquediario": "876.99",
        "flagativo": "true",
        "tipoconta": "3",
        "datacriacao": "2020-02-09"
    };
    it("conta bancaria nao criada", function (done) {
        supertest(app)
            .post("/conta/nova-conta")
            .send(data)
            .expect(500);
            done();
    });
});

describe("nao deve efetuar um deposito em conta bancaria", function () {
    let data = {
        'idconta': '20',
        'deposito': '987675.34',
        'dataExecucao': '2020-02-09'
    };
    it("deposito nao efetuado", function (done) {
        supertest(app)
            .post("/conta/depositar")
            .send(data)
            .expect(500);
            done();
    });
});

describe("nao deve consultar o saldo da conta bancaria", function () {
    
    it("saldo nao consultado", function (done) {
        supertest(app)
            .get("/consultar-saldo/0")
            .expect(500);
            done();
    });
});

describe("nao deve efetuar um saque da conta bancaria", function () {
    let data = {
        'idconta': '0',
        'saque': '100000',
        'dataExecucao': '2020-02-09'
    };
    it("saque nao efetuado", function (done) {
        supertest(app)
            .put("/conta/sacar")
            .send(data)
            .expect(500);
            done();
    });
});

describe("nao deve bloquear a conta bancaria", function () {
    let data = {
        'idconta': '9'
    };
    it("conta nao bloqueada", function (done) {
        supertest(app)
            .put("/conta/bloquear")
            .send(data)
            .expect(500);
            done();
    });
});

describe("nao deve consultar o extrato da conta bancaria", function () {

    it("extrato nao consultado", function (done) {
        supertest(app)
            .get("/conta/consultar-extrato/20")
            .expect(500);
            done();
    });
});

describe("nao deve consultar o extrato por periodo da conta bancaria", function () {

    it("extrato de um periodo nao consultado", function (done) {
        supertest(app)
            .get("/conta/consultar-extrato/1/2020-01-01/2020-02")
            .expect(500);
            done();
    });
});