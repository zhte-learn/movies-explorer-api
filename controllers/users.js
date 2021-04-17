const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const ValidationError = require('../errors/validation-error');
const ConflictError = require('../errors/conflict-error');
const AuthError = require('../errors/auth-error');

const SALT_ROUNDS = 10;
const MONGO_DUPLICATE_ERROR_CODE = 11000;

const addUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  if (!email || !password) {
    throw new ValidationError('Не передан email или пароль');
  }

  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then(() => res.status(201).send({
      name,
      email,
    }))
    .catch((err) => {
      if (err._message === 'user validation failed') {
        next(new ValidationError('Введены некорректные данные'));
      } else if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError('Не передан email или пароль');
  }

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильные почта или пароль');
      }
      return {
        user,
        matched: bcrypt.compare(password, user.password),
      };
    })
    .then(({ user, matched }) => {
      if (!matched) {
        throw new AuthError('Неправильные почта или пароль');
      }

      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      return res.status(200).send({ token });
    })
    .catch((err) => next(err));
};

const getUserMe = (req, res, next) => {
  console.log('click')
  console.log(req.user);
  User.findById(req.user._id)
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

const updateUserInfo = (req, res, next) => {
  console.log(req.user._id)
  console.log(req.body)
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, email: req.body.email },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => next(err));
};

module.exports = {
  addUser,
  login,
  getUserMe,
  updateUserInfo,
};