const express = require('express')
const { auth } = require('express-oauth2-jwt-bearer');
const db = require("./db");
const bodyParser = require('body-parser');
const fs = require('fs');
let cookieParser = require('cookie-parser');
let RateLimit = require('express-rate-limit');
const port = 3001
const app = express()
const checkJwt = auth({
    audience: 'projeto-final',
    issuerBaseURL: 'https://dev-2zdtulpnb8jm1j8a.us.auth0.com/',
    tokenSigningAlg: 'RS256'
});

const ReDoS = (text) => {
    return text.replace(/[^a-zA-Z0-9 ]/g, '');
}

let limiter = new RateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    delayMs: 0,
    message: "Too many accounts created from this IP, please try again after an hour"
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(limiter);
app.use(checkJwt);

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

let https = require('https');
const privateKey = fs.readFileSync('./certificados/selfsigned.key', 'utf8');
const certificate = fs.readFileSync('./certificados/selfsigned.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };
let httpsServer = https.createServer(credentials, app);

httpsServer.listen(port);

app.get('/products', async (req, res, next) => {
    let resp = await db.getAllProducts();
    res.status(200).json(resp);
});

app.post('/products', async (req, res, next) => {

    try {
        const name = ReDoS(req.body.name);
        const description = ReDoS(req.body.description);
        const value = req.body.value;

        await db.insertProduct(name, description, value);
        return res.status(200).json({ message: 'Produto cadastrado com sucesso!' });

    } catch (err) {
        return res.status(err.code).json(err);
    }
});

app.get('/products/:id', async (req, res, next) => {

    try {
        const id = req.params.id;
        const [rows] = await db.getProductById(id);
        if (rows) {
            return res.status(200).send(rows);
        }
        return res.status(404).send(`Produto ${id} não encontrado!`);
    } catch (err) {
        return res.status(err.code).json(err);
    }
});

app.put('/products/:id', async (req, res, next) => {

    try {
        const id = req.params.id;
        const name = ReDoS(req.body.name);
        const description = ReDoS(req.body.description)
        const value = req.body.value;

        const rows = await db.updateProductById(id, name, description, value);
        if (rows) {
            return res.status(200).send({ message: "Produto atualizado com sucesso!" });
        }
        return res.status(404).send(`Produto ${id} atualizado com sucesso!`);
    } catch (err) {
        return res.status(err.code).json(err);
    }
});

app.delete('/products/:id', async (req, res, next) => {

    try {
        const id = req.params.id;
        await db.deleteProductById(id);
        return res.status(200).send({ message: `Produto ${id} deletado com sucesso!` });

    } catch (err) {
        return res.status(err.code).json(err);
    }
});