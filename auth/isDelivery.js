function isDelivery(req, res, next) {

    if (req.user.role == 'delivery' ) {    
        next();   
    } else {
      res.status(403).json( {
        message: "No is delivery",
      });
    }
  }
  
  module.exports = isDelivery;
  