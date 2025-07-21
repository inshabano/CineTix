const express = require("express");
const connectDB = require('./config/db');
const userRoutes = require("./routes/user.routes");
const bodyParser = require('body-parser');
const cors = require('cors');
const movieRoutes = require("./routes/movie.routes");
const theatreRoutes = require("./routes/theatre.routes");
const showRoutes = require("./routes/show.routes")
require('dotenv').config();

const app = express();

connectDB();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(bodyParser.json());

userRoutes(app);
movieRoutes(app);
theatreRoutes(app);
showRoutes(app);
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(` Server is running successfully on port: ${port}`);
});
