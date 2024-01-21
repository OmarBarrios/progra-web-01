const config = require("../config/auth.config");
const UserSchema = require("../models/user.schema.js");
const RoleSchema = require("../models/role.schema.js");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  // validar rol

  try {
    const roles = RoleSchema.find();

    if (!roles.includes(req.body.roles)) {
      throw new Error("El rol no es valido.");
    } else {
      UserSchema.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        roles: req.body.roles,
      });

      res.send({ message: "User registered successfully!" });
    }
  } catch (error) {
    res.status(500).send({ message: err.message });
  }
};

exports.signin = (req, res) => {
  const userName = req.body.username == req.body.email;
  User.findOne({
    where: {
      username: userName,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: err.message });
    });
};
