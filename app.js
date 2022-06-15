const express = require('express');
const app = express();
const path = require('path');
const sqlite = require('sqlite3');
const db = new sqlite.Database('./Database/estoque.db');


app.use(express.json());
app.use(express.urlencoded());
app.use(express.static('public'));

//GET
app.get('/cadastro', (req,res)=>{

    res.sendFile(path.join(__dirname + '/public/cadastro.html'));
});

app.get('/', (req,res)=>{

    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/index', (req,res)=>{

    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/busca', (req,res)=>{

    res.sendFile(path.join(__dirname + '/public/busca.html'));
});

app.get('/delete', (req,res)=>{

    res.sendFile(path.join(__dirname + '/public/delete.html'));
});

app.get('/atualizar', (req,res)=>{

    res.sendFile(path.join(__dirname + '/public/atualizar.html'));
});

//POST
const adiciona = 'INSERT INTO produtos (nome, nlote, funcao, quantidade, alocacao) VALUES (?, ?, ?, ?, ?)'

app.post('/add', (req,res)=>{
        db.serialize(()=>{
            db.run(adiciona, [req.body.nome, req.body.nlote, req.body.funcao, req.body.quantidade, req.body.alocacao], function(err){
                if(err){
                    res.send ("Ocorreu um erro. Produto não cadastrado.");
                    return console.log(err.message);
                }
                res.send('<p>Produto adicionado com sucesso</p><p><a href="/cadastro">Cadastrar outro produto</a></p><p><a href="/busca">Buscar produto</a></p><p><a href="/index">Voltar para Home</a></p>');
                console.log(req.body.nome);
            });
        });
        
});

const buscaLote = 'SELECT * FROM produtos WHERE nlote = ?';

app.post('/search-nlote', (req,res)=>{
    db.serialize(()=>{
        db.each(buscaLote, [req.body.nlote], function(err, row){
            if(err){
                res.send ("erro ao encontrar o produto");
                return console.error(err.message);
            }
            res.send ('<p>Nome: ' + row.nome + '</p><p>Lote: ' + row.nlote + '</p><p>Função: ' + row.funcao + '</p><p>Quantidade: ' + row.quantidade + '</p><p>Alocado para paciente? ' + row.alocacao + '</p></br><p><a href="/cadastro">Cadastrar outro produto</a></p><p><a href="/busca">Buscar produto</a></p><p><a href="/index">Voltar para Home</a></p>'); 
            console.log("Produto encontrado");
        });
    });
});

const del = 'DELETE FROM produtos WHERE nlote = ? ';

app.post('/del', (req,res)=>{
    db.serialize(()=>{
        db.run(del, [req.body.nlote], function(err, row){
            if(err){
                res.send ("erro ao encontrar o produto");
                return console.error(err.message);
            }
            res.send ("Produto deletado!");
            console.log("Produto deletado");
        });
    });
});

const update = 'UPDATE produtos SET nome = ?, funcao = ?, quantidade = ?, alocacao = ? WHERE nlote = ?'

app.post('/update', (req,res) => {
    db.serialize(()=>{
        db.run(update, [req.body.nome, req.body.funcao, req.body.quantidade, req.body.alocacao, req.body.nlote], function(err, row){
            if(err){
                res.send("Erro ao atualizar o produto!");
                return console.error(err.message);
            }
            res.send ('<p>Nome: ' + row.nome + '</p><p>Lote: ' + row.nlote + '</p><p>Função: ' + row.funcao + '</p><p>Quantidade: ' + row.quantidade + '</p><p>Alocado para paciente? ' + row.alocacao + '</p></br><p><a href="/cadastro">Cadastrar outro produto</a></p><p><a href="/busca">Buscar produto</a></p><p><a href="/index">Voltar para Home</a></p>');
            console.log("Produto atualizado");
        });
    });
});


app.listen(8080, function(){console.log("Servidor conectado.");});