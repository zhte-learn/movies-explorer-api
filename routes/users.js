const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUserMe,
  updateUserInfo,
} = require('../controllers/users');

usersRouter.get('/users/me', getUserMe);

usersRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().error(new Error('Необходимо заполнить поле почта!')),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo);

module.exports = usersRouter;
