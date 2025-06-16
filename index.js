const expres = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const app = expres();
const PORT = 3000;

const db = require('./db')

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send(`hi`)
})

app.get('/users', db.getUsers);
app.get('/users/:id', db.getUserById);
app.post('/users', db.createUser)
app.delete('/users/:id', db.deleteUser)
app.put('/users/:id', db.updateUser)

app.use((err, req, res, next) => {
  const status = err.status || 500;

  res.status(status).message(`something went wrong: ${err.message}`);
});


app.listen(PORT, () => {
  console.log(`listening on localhost:${PORT}`)
})

