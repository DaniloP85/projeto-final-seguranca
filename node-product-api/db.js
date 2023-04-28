const { randomUUID } = require('crypto');

const exceuteDB = async (query, field) => {
    console.log(`Executando query: ${query}`);
    const [rows, fields] = await connection.execute(query, field, (err, rows) => {
        console.log("Retorno SQL: " + JSON.stringify(rows));
        return rows;
      });

      return rows;
}

async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;
 
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: 3306,
        user: 'test',
        password: 'test',
        database: 'finalProjectSubst',
        multipleStatements: true
      } );
    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
}

async function getAllProducts(){
    const conn = await connect();
    
    const query = `SELECT * FROM products LIMIT 1000;`;
    return exceuteDB(query, []);;
}

async function getProductById(id){    
    const query = `SELECT * FROM products WHERE id = ?;`;    
    return exceuteDB(query, [id]);
}


async function updateProductById(id, name, description, value){
    try{    
        const query = `UPDATE products SET name = ?, description = ?, value = ? WHERE id = ?;`;
        return exceuteDB(query, [name, description, value, id]);
        
    }catch(err){
        throw {code: 500, message: 'Erro inesperado ao tentar cadastrar usuário'};
    }
}

async function deleteProductById(id){    
    const query = `DELETE FROM products WHERE id = ?;`;
    exceuteDB(query, [id]);
}

async function insertProduct(name, description, value){
    const conn = await connect();
    const query = `INSERT INTO products(id, name, description, value) VALUES (?, ?, ?, ?);`;

    try{
        exceuteDB(query, [randomUUID(), name, description, value])
    }catch(err){
        if(err.errno === 1062){
            throw {code: 400, message: 'Já existe um producte cadastrado com este usuário!'};
        }else{
            throw {code: 500, message: 'Erro inesperado ao tentar cadastrar usuário'};
        }
    }
}

module.exports = {getProductById, getAllProducts, insertProduct, updateProductById, deleteProductById}
