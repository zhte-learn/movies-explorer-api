const usersRouter = require('express').Router();

const {
  getUserMe,
  updateUserInfo,
} = require('../controllers/users');

usersRouter.get('/users/me', getUserMe);
usersRouter.patch('/users/me', updateUserInfo);

module.exports = usersRouter;
