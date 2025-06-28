const { getAllMovies, getMovieById, addMovie, createBooking, deleteMovieByID, updateMovieByID, getMovieSuggestion, getSearchedMovie } = require("../controllers/movies.controller");
const {verifyJWT, verifyAdmin} = require("../middlewares/auth.middleware");
const { verifyCreateMovieRequest } = require("../middlewares/movie.middleware");


module.exports = (app) =>{
    app.get('/movies',getAllMovies);   //all users
    app.get('/movies/:id',getMovieById);  //all users
    app.post('/movies',[verifyJWT,verifyAdmin,verifyCreateMovieRequest],addMovie);         // authenticated + authorized admin
    // app.pos(t('/booking',[verifyJWT],createBooking);   //authenticated user
    app.delete('/movies/:id',[verifyJWT, verifyAdmin], deleteMovieByID);
    app.put('/movies/:id',[verifyJWT, verifyAdmin], updateMovieByID);
    app.get('/suggestions', getMovieSuggestion);
    app.get('/search', getSearchedMovie)

}