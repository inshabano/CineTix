const { createShow, getAllShows, getTheatresAndShowsByMovie, getShowDetailsByShowId } = require("../controllers/show.controller");
const { getTheatersByMovie } = require("../controllers/theatre.controller");
const { verifyJWT,verifyAdmin, verifyAdminOrPartner } = require("../middlewares/auth.middleware")


module.exports = (app)=>{
    app.post('/shows',[verifyJWT,verifyAdminOrPartner],createShow);
    app.get('/shows',[verifyJWT,verifyAdmin],getAllShows);
    app.get('/shows/movies/:movieid',[verifyJWT],getTheatresAndShowsByMovie);
    app.get('/shows/:id',[verifyJWT],getShowDetailsByShowId);
}