const { getAllMovies, getMovieById, addMovie, createBooking } = require("../controllers/movies.controller");
const {verifyJWT, verifyAdmin} = require("../middlewares/auth.middleware")


module.exports = (app) =>{
    app.get('/movies',getAllMovies);   //all users
    app.get('/movies/:id',getMovieById);  //all users
    app.post('/movies',[verifyJWT,verifyAdmin],addMovie);         // authenticated + authorized admin
    app.post('/booking',[verifyJWT],createBooking);   //authenticated user
}