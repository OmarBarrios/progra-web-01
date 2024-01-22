const config = require("../config/auth.config");
const UserSchema = require("../models/user.schema.js");
const RoleSchema = require("../models/role.schema.js");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  // Save User to Database
  // validar rol

  try {
    console.log('[signup] Starting...');
    const roles = req.body.roles

    const rolesWithIds = await Promise.all(roles.map(async (role) => {
      return await RoleSchema.findOne({ name: role }).then(role => role._id)
    }))

    await UserSchema.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      roles: rolesWithIds,
    });

    console.log('[signup] Finished.');
    res.send({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.signin = async (req, res) => {
  console.log('[signin] Starting...');

  const userName = req.body.username ?? req.body.email;

  const user = await UserSchema.find({
    username: userName
  }).populate('roles')

  if (!user) {
    console.log('[signin] User not found');
    return res.status(404).send({ message: "User Not found." });
  }

  const passwordIsValid =  await bcrypt.compare(req.body.password, user[0].password)

  if (!passwordIsValid) {
    console.log('[signin] Invalid Password');
    return res.status(401).send({
      accessToken: null,
      message: "Invalid Password!",
    });
  }

  const token = jwt.sign({ id: user[0].id }, config.secret, {
    algorithm: "HS256",
    allowInsecureKeySizes: true,
    expiresIn: 86400, // 24 hours
  });

  const userData = {
    id: user[0].id,
    username: user[0].username,
    email: user[0].email,
    roles: user[0].roles,
    accessToken: token,
  }

  res.status(200).send(userData);

  console.log(userData);

  console.log('[signin] Finished.');
};
