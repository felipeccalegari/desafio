const express = require('express')
const bodyParser = require('body-parser')
const db = require('./query')

const app = express()
const port = 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true,
}))


app.get('/', (req, res) => {
    res.json({ info: 'API desenvolvida com Node.js, Express e PostgreSQL'})
})

app.post('/formulario', db.novoUser)
app.get('/formulario', db.Usuarios)

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})