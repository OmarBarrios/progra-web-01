const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const User = require("../models/user.schema.js");

verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = user[0].roles;
  if (roles.filter((role) => role.name === "admin").length > 0) {
    next();
    return;
  }

  res.status(403).send({
    message: "Require Admin Role!",
  });
  return;
};

isModerator = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = user[0].roles;
  if (roles.filter((role) => role.name === "moderator").length > 0) {
    next();
    return;
  }

  res.status(403).send({
    message: "Require Moderator Role!",
  });
};

isModeratorOrAdmin = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = user[0].roles;
  if (roles.filter((role) => role.name === "moderator").length > 0) {
    next();
    return;
  }

  if (roles.filter((role) => role.name === "admin").length > 0) {
    next();
    return;
  }

  res.status(403).send({
    message: "Require Moderator or Admin Role!",
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin,
};
module.exports = authJwt;
