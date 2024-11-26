const express = require('express')
const cors = require('cors')
const fs = require('node:fs');
const app = express()
const port = 3000

app.use(cors())

app.get('/emercado-api/cart/buy', (req, res) => {
    fs.readFile('json/cart/buy.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.status(404).send('No se encontro el archivo')
          return;
        }
        res.send(data)
        console.log(data);
      });
})


app.get('/emercado-api/cats/cat', (req, res) => {
    fs.readFile('json/cats/cat.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.status(404).send('No se encontro el archivo')
          return;
        }
        res.send(data)
        console.log(data);
      });
})


app.get('/emercado-api/cats_products/:catId', (req, res) => {
    const catId = req.params.catId
    fs.readFile('json/cats_products/'+catId+".json", 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.status(404).send('No se encontro el archivo')
          return;
        }
        res.send(data)
        console.log(data);
      });
})

app.get('/emercado-api/products/:productId', (req, res) => {
    const productId = req.params.productId
    fs.readFile('json/products/'+productId+".json", 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.status(404).send('No se encontro el archivo')
          return;
        }
        res.send(data)
        console.log(data);
      });
})

app.get('/emercado-api/products_comments/:productId', (req, res) => {
    const productId = req.params.productId
    fs.readFile('json/products_comments/'+productId+".json", 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.status(404).send('No se encontro el archivo')
          return;
        }
        res.send(data)
        console.log(data);
      });
})

app.get('/emercado-api/sell/publish', (req, res) => {
    fs.readFile('json/sell/publish.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.status(404).send('No se encontro el archivo')
          return;
        }
        res.send(data)
        console.log(data);
      });
})

app.get('/emercado-api/user_cart/', (req, res) => {
    fs.readFile('json/user_cart/25801.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.status(404).send('No se encontro el archivo')
          return;
        }
        res.send(data)
        console.log(data);
      });
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})