const { createShow, getAllShows, getTheatresAndShowsByMovie, getShowDetailsByShowId, getMyTheatreShows, updateShow, deleteShow } = require("../controllers/show.controller");
const { getTheatersByMovie } = require("../controllers/theatre.controller");
const { verifyJWT,verifyAdmin, verifyAdminOrPartner, verifyShowOwnership } = require("../middlewares/auth.middleware");

module.exports = (app)=>{
    app.post('/shows',[verifyJWT,verifyAdminOrPartner],createShow);
    app.get('/shows',[verifyJWT,verifyAdmin],getAllShows);
    app.get('/shows/movies/:movieid',[verifyJWT],getTheatresAndShowsByMovie);
    app.get('/shows/:id',[verifyJWT],getShowDetailsByShowId);
    app.get('/shows/my-theatre-shows', [verifyJWT, verifyAdminOrPartner], getMyTheatreShows);
    app.put('/shows/:id',[verifyJWT,verifyAdminOrPartner,verifyShowOwnership], updateShow);
    app.delete('/shows/:id', [verifyJWT, verifyAdminOrPartner,verifyShowOwnership], deleteShow)

}