const { availableDate, getTheaters } = require("../controllers/booking.controller")

module.exports = (app)=>{
    app.get('/:movieid/available-dates', availableDate);
    app.get('/:movieid/theaters', getTheaters);
}