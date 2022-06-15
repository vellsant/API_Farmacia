const sqlite = require('sqlite3');
const db = new sqlite.Database('./Database/estoque.db');

const sql = 'CREATE TABLE produtos(nome VARCHAR(20), nlote VARCHAR(10) PRIMARY KEY, funcao VARCHAR(20), quantidade INT, alocacao VARCHAR(3))';

db.run(sql);