const express = require("express");
const bodyparser = require("body-parser");
const appRoutes = require("./routes/app.routes");
const cors = require("cors");

const models = require("./models");

const app = express();

const port = process.env.port || 8080;

var corsOptions = {
  origin: "http://localhost:3000",
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(appRoutes);

models.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`app running on port: ${port}`);
  });
});
