const moviesRouter = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

moviesRouter.get('/movies', getMovies);

moviesRouter.post('/movies', createMovie);

moviesRouter.delete('/movies/:movieId', deleteMovie);

module.exports = moviesRouter;
