const express = require('express');
const router = express.Router();
const { addMovieToWatchlist, removeMovieFromWatchlist, getWatchlist } = require('../controllers/watchlist.controller');
const { verifyJWT } = require('../middlewares/auth.middleware');


module.exports = (app) =>{
    app.get('/watchlist', verifyJWT, getWatchlist);
    app.post('/watchlist/add', verifyJWT, addMovieToWatchlist);
    app.delete('/watchlist/remove/:movieId', verifyJWT, removeMovieFromWatchlist);
}
