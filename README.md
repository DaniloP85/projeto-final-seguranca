# Projeto Final

O objetivo é tornarmos esta API segura utilizando das técnicas executadas na disciplina de Segurança em Aplicações do curso MBA em Mobile Development (25MOB).

## Descrição

O projeto contém uma API de Produtos que efetua as 4 operações do CRUD (*Create*, *Read*, *Update* e *Delete*).

A API foi construída utilizando node.js e mysql para armazenar os dados.

## 📋 Pré-requisitos

Para execução desse projeto é necessario instalar os seguintes software:

- [Node.js](https://nodejs.org/en)
- [Docker](https://www.docker.com/get-started)
- [Nodemon](https://www.npmjs.com/package/nodemon)

Para instalar o nodemon de forma global, utilize o seguinte comando: `sudo npm i -g nodemon`
## ⚙️ Executando os testes

- `docker-compose up`: executa a API e o banco de dados em um container no Docker;
    <details>
    <summary>Clique aqui</summary>

    ![.](readme/docker-compose-up.gif) 
    
    </details>

- `docker-compose up db`: disponibiliza  o banco de dados em um container do Docker;
    <details>
    <summary>Clique aqui</summary>

    ![.](readme/docker-compose-up-db.gif)
    
    </details>

### Consumindo a API ([Insomnia](https://insomnia.rest/))

Foi disponibilizado um [repositório](https://github.com/DaniloP85/projeto-final-collection), para testes da aplicação, conforme demostrando nas ilustrações acima.

Ao executar, os mesmos serão expostos nos endereços:

1. API Produto de produtos (products): http://localhost:3001;
2. Banco de dados: localhost:3306;

<details>
<summary>Utilizando o Insomnia</summary>
    
1. Na tela incial do Insomnia, procure o botão `+Create`, depois clique em `Git Clone`;
2. No campo: `GitHub URI`, insira o seguinte endereço:
```
https://github.com/DaniloP85/projeto-final-collection.git
```
3. Por fim clique em `Clone`

![.](readme/clone.png)


</details>
<details>
<summary>Debugando a API (Caso necessário)</summary>


Execute o somente o banco de dados via docker-compose (comando: `docker-compose up db`) e execute a API com `npm install` e o VSCode. Por exemplo:
1. Na raiz do projeto execute: `docker-compose up db`
2. Na subpasta da API, execute `npm install` e em seguida execute a config `Run node-product-api with nodemon`* no player do VSCode.

\* Ao executar essa configuração, caso ocorra erro de binário não encontrado para o nodemon, execute o comando: `npm i -g nodemon` e tente novamente.
</details>

## 📌 Vulnerabilidades

1. Mitigar Broken Authentication e Broken Access Control através da implementação de OAuth; 
2. Mitigar Man In The Middle/Sniffing através da implementação de comunicação via HTTPS;
3. Mitigar Code Injection através da implementação de validação de campos de entrada e a utilização de Prepared Statements nas comunicações com o Banco de Dados;
4. Mitigar Brute Force/Dictionary Attack através da implementação de RateLimit na API;
## ✒️ Autores

||
| --- |
| [André](https://github.com/AndCordeiro) |
| [Danilo](https://www.linkedin.com/in/danilopsnts) |
| [Flávio](https://github.com/flavio-fgjj) |
| [Samuel](https://github.com/SamuelDevMobile)

## 🖇️ Colaborando

Por favor, leia o [colaboração](CONTRIBUTING.md) para obter detalhes sobre o nosso código de conduta e o processo para nos enviar pedidos de solicitação.
## 📄 Licença
Este projeto está licenciado sob a licença MT - veja o arquivo [license](LICENSE.md) para detalhes

## 🎁 Agradeciemntos
* [Gabriel Pereira da Silva](https://github.com/Gabrielgps25)