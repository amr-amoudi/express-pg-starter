const expres = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const app = expres();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send(`hi`)
})



app.listen(PORT, () => {
  console.log(`listening on https://192.168.1.15:${PORT}`)
})

