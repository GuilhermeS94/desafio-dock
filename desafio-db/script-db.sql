create database desafiodockdb;
use desafiodockdb;

/*
Primeiro a tabela que nao depende de nenhum
relacionamento
*/
create table Pessoas(
    IdPessoa INT PRIMARY KEY IDENTITY(1,1),
    Nome VARCHAR(100) NOT NULL,
    Cpf VARCHAR(11) NOT NULL,
    DataNascimento DATE NOT NULL
);

/*
Conta vinculada a uma pessoa
*/
create table Contas(
    IdConta INT PRIMARY KEY IDENTITY(1,1),
    IdPessoa INT NOT NULL FOREIGN KEY REFERENCES Pessoas,
    Saldo DECIMAL(10, 2) NOT NULL DEFAULT 0,
    LimiteSaqueDiario DECIMAL(10, 2) NOT NULL,
    FlagAtivo BIT NOT NULL,
    TipoConta INT NOT NULL,
    DataCriacao DATE NOT NULL DEFAULT GETDATE()
);

/*
Transacao vinculada a uma conta
*/
create table Transacoes(
    IdTransacao INT PRIMARY KEY IDENTITY(1,1),
    IdConta INT NOT NULL FOREIGN KEY REFERENCES Contas,
    Valor DECIMAL(10, 2) NOT NULL,
    DataExecucao DATE NOT NULL
);

/*
Alimentando a tabela de Pessoas
*/
INSERT INTO Pessoas(Nome, Cpf, DataNascimento)VALUES
('Pessoa 1', '12345678910', '1994-07-14'),
('Pessoa 2', '09876543201', '1985-07-22'),
('Pessoa 3', '12309846529', '1962-11-13'),
('Pessoa 4', '98712364592', '1920-02-28');

/*
Alimentando a tabela de Contas
*/
INSERT INTO Contas(IdPessoa, Saldo, LimiteSaqueDiario, FlagAtivo, TipoConta, DataCriacao) VALUES 
(1, 3000, 400, 1, 1, GETDATE()),
(2, 1000000, 2000, 1, 1, GETDATE()),
(3, 700, 1500, 0, 1, GETDATE()),
(4, 5789.23, 600, 1, 2, GETDATE());