const Role = require("../models/role.schema");
const User = require("../models/user.schema.js");

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  // Username
  await User.findOne({
    where: {
      username: req.body.username,
    },
  }).then(async (user) => {
    if (user) {
      res.status(400).send({
        message: "Failed! Username is already in use!",
      });
      return;
    }

    // Email
    await User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((user) => {
      if (user) {
        res.status(400).send({
          message: "Failed! Email is already in use!",
        });
        return;
      }

      next();
    });
  });
};

checkRolesExisted = async (req, res, next) => {
  console.log("[checkRolesExisted] Starting ...");
  const allRoles = await Role.find({});

  const ROLES = allRoles.map((rol) => rol.name);

  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.roles[i],
        });
        return;
      }
    }
  }

  console.log("[checkRolesExisted] Finished.");

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted,
};

module.exports = verifySignUp;
