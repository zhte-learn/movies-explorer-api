const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const helmet = require('helmet');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const usersRouter = require('./routes/users.js');
const moviesRouter = require('./routes/movies.js');
const { addUser, login } = require('./controllers/users');
const NotFoundError = require('./errors/not-found-error');
const errorHandler = require('./errors/error-handler');
const limiter = require('./rate-limiter');
const devDatabaseUrl = require('./db-url');

const { PORT = 3000, NODE_ENV, DB_URL } = process.env;
const app = express();

mongoose.connect(NODE_ENV === 'production' ? DB_URL : devDatabaseUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(limiter);
app.use(helmet());

app.use(bodyParser.json());

app.use(requestLogger);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), addUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);

app.use('/', usersRouter);
app.use('/', moviesRouter);

app.use(errorLogger);

app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
