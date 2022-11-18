const { body, validationResult } = require('express-validator');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { User } = require('../model/UserModel');

const TOKEN_SECRET = process.env.TOKEN_SECRET;

/* POST : user register */
exports.register = async function (req, res) {

  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).json({ error: "Confirm Password different de password" });
  }

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

  await user.save();

  return res.status(201).json({ email: user.email, nom: user.lastname, prenom: user.firstname, phone: user.phone });
}

/* POST : user login */
exports.login = async function (req, res) {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await argon2.verify(user.password, password))) {

      const token = jwt.sign({ email: email }, TOKEN_SECRET, { expiresIn: "2h" });

      /* Cette partie est juste pour stocker le token dans un cookie pour démontrer le logout après dans le route de /api/auth/logout */

      res.cookie('access_token', token, { maxAge: 2 * 60 * 1000, httpOnly: true });
      
      // user
      return res.status(200).json({ email: user.email, nom: user.lastname, prenom: user.firstname, phone: user.phone, token: token });
    }
    return res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
}

/* GET : user profile */
exports.profile = async function (req, res) {

  const jwtToken = req.headers.access_token;

  jwt.verify(jwtToken, TOKEN_SECRET, async function (err, decoded) {
    if (err) {
      return res.status(400).send("Invalid Credentials");
    }
    const user = await User.findOne({ email: decoded.email });

    if (user) {
      return res.status(200).json({ email: user.email, nom: user.lastname, prenom: user.firstname, phone: user.phone });
    }

    return res.status(404).send("User not found");

  });

}

/* PUT : Edit user firstname and lastname */
exports.edit = async function (req, res) {

  const jwtToken = req.headers.access_token;

  jwt.verify(jwtToken, TOKEN_SECRET, async function (err, decoded) {
    if (err) {
      return res.status(400).send("Invalid Credentials");
    }
    let user = await User.findOne({ email: decoded.email });

    if (user) {
      let updatedUser = await User.updateOne({ email: user.email }, { firstname: req.body.firstname, lastname: req.body.lastname })

      if (updatedUser.modifiedCount == 1) {
        user = await User.findOne({ email: decoded.email });
        return res.status(201).json({ email: user.email, nom: user.lastname, prenom: user.firstname, phone: user.phone, message: "Modification du compte réussie !" });
      }
      return res.status(400).send("Erreur de modification");
    }

    return res.status(404).send("User not found");

  });

}

/* PUT : Edit user password */
exports.editPassword = async function (req, res) {


  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).json({ error: "Confirm Password different de password" });
  }

  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const jwtToken = req.headers.access_token;

  jwt.verify(jwtToken, TOKEN_SECRET, async function (err, decoded) {
    if (err) {
      return res.status(400).send("Invalid Credentials");
    }
    let user = await User.findOne({ email: decoded.email });

    if (user) {

      const hash = await argon2.hash(req.body.password);

      let updatedUser = await User.updateOne({ email: user.email }, { password: hash })

      if (updatedUser.modifiedCount == 1) {
        user = await User.findOne({ email: decoded.email });
        return res.status(201).json({ message: "Mot de passe modifié !" });
      }
      return res.status(400).send("Erreur de modification");
    }

    return res.status(404).send("User not found");

  });

}

/* PUT : Edit user phone */
exports.editPhone = async function (req, res) {

  const jwtToken = req.headers.access_token;

  jwt.verify(jwtToken, TOKEN_SECRET, async function (err, decoded) {
    if (err) {
      return res.status(400).send("Invalid Credentials");
    }
    let user = await User.findOne({ email: decoded.email });

    if (user) {
      let updatedUser = await User.updateOne({ email: user.email }, { phone: req.body.phone })

      if (updatedUser.modifiedCount == 1) {
        user = await User.findOne({ email: decoded.email });
        return res.status(201).json({ message: "Numéro de téléphone modifié !" });
      }
      return res.status(400).send("Erreur de modification");
    }

    return res.status(404).send("User not found");

  });

}


/* PUT : Edit user email */
exports.editEmail = async function (req, res) {

  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const jwtToken = req.headers.access_token;

  jwt.verify(jwtToken, TOKEN_SECRET, async function (err, decoded) {
    if (err) {
      return res.status(400).send("Invalid Credentials");
    }
    let user = await User.findOne({ email: decoded.email });

    if (user) {
      let updatedUser = await User.updateOne({ email: decoded.email }, { email: req.body.email })

      if (updatedUser.modifiedCount == 1) {
        user = await User.findOne({ email: decoded.email });
        return res.status(201).json({ message: "Email modifié !" });
      }
      return res.status(400).send("Erreur de modification");
    }

    return res.status(404).send("User not found");

  });

}

/* DELETE : Edit user email */
exports.deleteUser = async function (req, res) {

  const jwtToken = req.headers.access_token;

  jwt.verify(jwtToken, TOKEN_SECRET, async function (err, decoded) {
    if (err) {
      return res.status(400).send("Invalid Credentials");
    }
    let user = await User.findOne({ email: decoded.email });

    if (user) {
      let deletedUser = await User.deleteOne({ email: decoded.email })

      console.log(deletedUser);

      if (deletedUser.deletedCount == 1) {
        return res.status(201).json({ message: "Votre profil a été supprimé ! Un email de confirmation de suppression vous a été envoyé" });
      }
      return res.status(400).send("Erreur de suppression");
    }

    return res.status(404).send("User not found");

  });

}

/* DELETE : logout user */
/* Logout c'est juste la suppression du cookie qui contient l'access token */
exports.logout = async function (req, res) {

  res.clearCookie('access_token');

  return res.status(200).send("Logged out");
}

