const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUserMe,
  updateUserInfo,
} = require('../controllers/users');

usersRouter.get('/users/me', getUserMe);

usersRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), updateUserInfo);

module.exports = usersRouter;
