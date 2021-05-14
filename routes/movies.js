const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

moviesRouter.get('/movies', getMovies);

moviesRouter.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().allow('').required(),
    director: Joi.string().allow('').required(),
    duration: Joi.number().required(),
    year: Joi.string().allow('').required(),
    image: Joi.string().pattern(/^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?#?$/).required(),
    trailer: Joi.string().allow('').required(),
    /* thumbnail: Joi.string().allow(null), */
    movieId: Joi.number().required(),
    nameRU: Joi.string().allow('').required(),
    nameEN: Joi.string().allow('').required(),
  }).unknown(true),
}), createMovie);

moviesRouter.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }).unknown(true),
}), deleteMovie);

module.exports = moviesRouter;
