function isAdmin(req, res, next) {

  if (req.user.role == 'admin' ) {    
      next();   
  } else {
    res.status(403).json( {
      message: "No is admin",
    });
  }
}

module.exports = isAdmin;
