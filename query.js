const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'postgres',
    database: 'api',
    password: '12345',
    port: 5432
})

pool.connect()

const criarTabela = `CREATE TABLE IF NOT EXISTS formulario (
   id SERIAL PRIMARY KEY,
   name VARCHAR (70),
   email VARCHAR (70) UNIQUE,
   cpf VARCHAR (20),
   phone VARCHAR (20),
   created_at TIMESTAMP without time zone DEFAULT (current_timestamp AT time zone 'America/Sao_Paulo')::TIMESTAMP without time zone
)`;

pool.query(criarTabela, (error, res) => {
    if (error) {
        console.error(error)
    } else {
        console.log(`Tabela criada: ${JSON.stringify(res)}`)
    }
})

const Usuarios = (req, res) => {
    pool.query("SELECT id, name, email, phone, to_char(created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at FROM formulario ORDER BY id ASC", (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

const novoUser = (req, res) => {
    const { name, email, cpf, phone } = req.body

    const verificaEmail = /\S+@\S+\.\S+/
    if (!verificaEmail.test(email)) {
        return res.status(400).send('Endereço de e-mail inválido!')
    }
    pool.query('INSERT INTO formulario (name, email, cpf, phone) VALUES ($1, $2, $3, $4) RETURNING *', [name, email, cpf, phone], (error, results) => {
        if (error) {

            if (error.code === '23505') {
                return res.status(409).send('E-mail já cadastrado!')
            } else {
                throw error
            }
        }
        res.status(201).send(`Inscrição realizada.`)
    })
}

module.exports = {
    Usuarios,
    novoUser,
}