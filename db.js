const Pool = require("pg").Pool
require('dotenv').config()


const pool = new Pool({
  user: process.env.PGUSERNAME,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT
})

const getUsers = (request, response, next) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      next(error)
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response, next) => {
  const id = parseInt(request.params.id)

  pool.query(`SELECT * FROM users WHERE id = $1 `, [id] , (error, results) => {
    if (error) {
      next(error)
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response, next) => {
  const {name, email} = request.body

  pool.query(`INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *`, [name, email], (error, results) => {
    if (error) {
      next(error)
    }
    let {id, name} = results.rows[0]
    response.status(201).send(`user '${name}' was created on id ${id}`)
  })
}

const deleteUser = (request, response, next) => {
  const {id} = request.params

  pool.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [id] , (error, results) => {
    if (error) {
      next(error)
    }

    let {name} = results.rows[0]

    response.status(204).send(`user '${name}' was deleted`)
  })
}

const updateUser = (request, response, next) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  let query = 'UPDATE users SET'
  const values = []
  let count = 1

  if (name) {
    query += ` name = $${count++}`
    values.push(name)
  }

  if (email) {
    if (values.length > 0) query += ','
    query += ` email = $${count++}`
    values.push(email)
  }

  if (values.length === 0) {
    return response.status(400).send("Nothing to update")
  }

  query += ` WHERE id = $${count}`
  values.push(id)

  pool.query(query, values, (error, results) => {
    if (error) {
      next(error)
    }
    response.status(200).send(`User modified with ID: ${id}`)
  })
}



module.exports = {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
}