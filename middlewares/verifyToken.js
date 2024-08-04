const { json } = require("express");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

// Verify Token
function verifyToken(req, res, next) {
  const authToken = req.headers.authorization;
  if (authToken) {
    const token = authToken.split(" ")[1];
    try {
      const decodedPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decodedPayload;
      next();
    } catch (err) {
      return next(new AppError("Invalid token,access denied", 400));

      // res.status(401).json({ message: "Invalid token,access denied" });
    }
  } else {
    return next(new AppError("no token provided, access denied", 401));

    // res.status(401).json({ message: "no token provided, access denied" });
  }
}

// Verify Token & Admin
function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(new AppError("not allowed, only admin", 403));

      // return res.status(403).json({ message: "not allowed, only admin" });
    }
  });
}
function verifyTokenAndSuperAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.superAdmin) {
      next();
    } else {
      return next(new AppError("not allowed, only super admin", 403));

      // return res.status(403).json({ message: "not allowed, only admin" });
    }
  });
}

// Verify Token & Only User Himself
function verifyTokenAndOnlyUser(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "not allowed, only user himself" });
    }
  });
}

// Verify Token & Only User Himself

function verifyTokenAndAdminOrUser(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "not allowed, only user himself or Admin" });
    }
  });
}
function verifyTokenAndAdminOrSuper(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.superAdmin || req.user.isAdmin) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "not allowed, only user Super admin or Admin" });
    }
  });
}
module.exports = {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyTokenAndAdminOrUser,
  verifyTokenAndSuperAdmin,
  verifyTokenAndAdminOrSuper
};
