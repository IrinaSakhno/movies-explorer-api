const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
    name: {
      type: String,
      required: true,
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
    },
  },
  {
    versionKey: false,
    toJSON: {
      transform(_doc, ret) {
        const user = ret;
        delete user.password;
      },
    },
    toObject: {
      transform(_doc, ret) {
        const user = ret;
        delete user.password;
      },
    },
  },
);

module.exports = mongoose.model('user', userSchema);
