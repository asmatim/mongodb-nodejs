const { body, validationResult } = require('express-validator');
const argon2 = require('argon2');
const { User } = require('../model/UserModel');



/* POST : user register */
exports.register = async function (req, res) {

  // request validation
  body('email').isEmail()
  body('firstname').isLength({ min: 1 })
  body('lastname').isLength({ min: 1 })
  body('password').isLength({ min: 10 })
  body('confirmPassword').equals(body.password)

  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const hash = await argon2.hash(req.body.password);

  const user = new User({
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    phone: req.body.phone,
    password: hash
  })

  user.save();

  return res.status(200).json({
    error: false,
    body,
    hash
  })
}
