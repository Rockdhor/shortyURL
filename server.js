const express = require('express')
const app = express()
const port = 3000
const path = require('path');
const dns = require('dns');
const bodyParser = require('body-parser')
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Database = require("@replit/database")
const db = new Database()

const dnsOptions = {family: 6, hints: dns.ADDRCONFIG | dns.V4MAPPED}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

// Render Html File
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/api/shorturl/:id', (req, res) => {
  db.get(req.params.id).then(value => {
    if (value) {
      res.writeHead(301, {
        Location: value
      }).end();
    } else {
      res.status(404).send({ error: 'invalid url' })
    }  
  })  
})
//{ original_url : 'https://freeCodeCamp.org', short_url : 1}
app.post('/api/shorturl', (req,res) => {
  let shorturl = req.body["short_url"];
  let originalurl = req.body["original_url"];
  db.get(shorturl).then(value => {
    if (value) {
      res.status(400).send({error: 'short_url already used'})
    } else {
    if (!isValidUrl(originalurl)) {
      res.status(404).send({ error: 'invalid url' })
    } else {
      db.set(shorturl, originalurl).then(() => {
        res.status(200).send({ original_url : originalurl, short_url : shorturl})
      })
    }
  }
  })
  
})

app.listen(port, () => {
  db.list().then(keys => {console.log(keys)})
  console.log("Running.")
})






