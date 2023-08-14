const express = require("express");
const dotenv = require("dotenv").config();
const seenAndDeleteController =require('./constrollers/seenAndDeleteController')
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
var bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.get('/', (req,res)=>{
    res.status(201).send('API is working properly')
  }
);
app.post("/seenemail", seenAndDeleteController.readEmail);
app.post("/deletemail", seenAndDeleteController.deleteEmail);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(
  process.env.PORT,
  "0.0.0.0",
  console.log(`server running on port ${process.env.PORT}`)
);