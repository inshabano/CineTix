require('dotenv').config();
const express = require("express");
const connectDB = require('./config/db');
const userRoutes = require("./routes/user.routes");
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');
const movieRoutes = require("./routes/movie.routes");
const theatreRoutes = require("./routes/theatre.routes");
const showRoutes = require("./routes/show.routes");
const bookingRoutes = require("./routes/booking.routes");
const paymentRoutes = require('./routes/payment.routes');
const deleteOldShows = require('./utils/deletePastShows');


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
bookingRoutes(app);
paymentRoutes(app);

cron.schedule('0 15 * * *', () => {
    console.log('Running scheduled job: Deleting past shows...');
    deleteOldShows();
}, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(` Server is running successfully on port: ${port}`);
});
