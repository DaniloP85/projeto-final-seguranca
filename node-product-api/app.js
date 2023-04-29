const express = require('express') 
const { auth } = require('express-oauth2-jwt-bearer');
const db = require("./db");
const bodyParser = require('body-parser');
let cookieParser = require('cookie-parser'); 
let RateLimit = require('express-rate-limit');
const port = 3001
const app = express()

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cookieParser()); 

const checkJwt = auth({
    audience: 'projeto-final',
    issuerBaseURL: 'https://dev-2zdtulpnb8jm1j8a.us.auth0.com/',
    tokenSigningAlg: 'RS256'
});

const ReDoS = (text) =>{
    return text.replace(/[^a-zA-Z0-9 ]/g, '');
}

var limiter = new RateLimit({
    windowMs: 15*60*1000,
    max: 10,
    delayMs: 0,
    message: "Too many accounts created from this IP, please try again after an hour"
});

app.use(limiter);

app.use(checkJwt);

app.use(function(req, res, next) {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, authorization');
   res.setHeader('Access-Control-Allow-Credentials', true);
   next();
});

app.get('/products', async (req, res, next) => { 
    var resp = await db.getAllProducts();
    res.status(200).json(resp);
});

app.post('/products', async (req, res, next) => { 

    try{
        var name = ReDoS(req.body.name);
        var description = ReDoS(req.body.description);
        var value = ReDoS(req.body.value);
        
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
        var name = ReDoS(req.body.name);
        var description = ReDoS(req.body.description)
        var value = ReDoS(req.body.value);
        
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

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
});