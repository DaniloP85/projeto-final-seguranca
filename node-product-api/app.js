var http = require('http'); 

const express = require('express') 
const app = express()
const port = 3000

const db = require("./db");

var cookieParser = require('cookie-parser'); 
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cookieParser()); 

const { auth } = require('express-oauth2-jwt-bearer');

const checkJwt = auth({
    audience: 'projeto-final',
    issuerBaseURL: 'https://dev-2zdtulpnb8jm1j8a.us.auth0.com/',
    tokenSigningAlg: 'RS256'
});


app.use(checkJwt);

app.use(function(req, res, next) {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, authorization');
   res.setHeader('Access-Control-Allow-Credentials', true);
   next();
});

const fs = require('fs');

var RateLimit = require('express-rate-limit');

var limiter = new RateLimit({
    windowMs: 15*60*1000,
    max: 50,
    delayMs: 0,
    message: "Too many accounts created from this IP, please try again after an hour"
});

app.use(limiter);

var https = require('https');
var privateKey  = fs.readFileSync('./node-product-api/certificadoDigital/selfsigned.key', 'utf8');
var certificate = fs.readFileSync('./node-product-api/certificadoDigital/selfsigned.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

var httpsServer = https.createServer(credentials, app);

app.get('/products', async (req, res, next) => { 
    var resp = await db.getAllProducts();
    res.status(200).json(resp);
});

app.post('/products', async (req, res, next) => { 

    try{
        var name = req.body.name;
        var description = req.body.description
        var value = req.body.value
        
        await db.insertProduct(name, description, value);
        return res.status(200).json({message: 'Produto cadastrado com sucesso!'});

    }catch(err){
        return res.status(err.code).json(err);
    }
});


app.get('/products/:id', async (req, res, next) => { 

    try{
        var id = req.params.id;
        const [rows] = await db.getProductById(id);
        if(rows){
            return res.status(200).send(rows);
        }
        return res.status(404).send(`Produto ${id} não encontrado!`);
    }catch(err){
        return res.status(err.code).json(err);
    }
});

app.put('/products/:id', async (req, res, next) => { 

    try{
        var id = req.params.id;

        var name = req.body.name;
        var description = req.body.description
        var value = req.body.value
        
        const rows = await db.updateProductById(id, name, description, value);
        if(rows){
            return res.status(200).send({message: "Produto atualizado com sucesso!"});
        }
        return res.status(404).send(`Produto ${id} atualizado com sucesso!`);
    }catch(err){
        return res.status(err.code).json(err);
    }
});

app.delete('/products/:id', async (req, res, next) => {

    try{
        var id = req.params.id;
        await db.deleteProductById(id);
        return res.status(200).send({message: `Produto ${id} deletado com sucesso!`}); 

    }catch(err){
        return res.status(err.code).json(err);
    }
});

httpsServer.listen(port, () => {
    console.log(`Listening at https://localhost:${port}`)
});
