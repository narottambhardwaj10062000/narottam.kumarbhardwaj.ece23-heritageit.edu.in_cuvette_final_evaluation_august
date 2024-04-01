// imports
const jwt = require("jsonwebtoken");

const verifyjwt = (req, res, next) => {
  try {
    //looking for my jwt token in request header
    const authorizationHeader = req.headers.authorization;
    const secret = process.env.JWT_SECRET;
    const [, token] = authorizationHeader.split(" ");

    // console.log(authorizationHeader);

    //case: token not found
    if (token === "null") {
      return res.status(401).json({
        errorMessage: "Token Not Found",
      });
    }

    const decoded = jwt.verify(token, secret);

    //case: token couldn't be decoded successfully
    if (!decoded) {
      return res.status(401).json({
        errorMessage: "Unauthorized User",
      });
    }

    //storing userId in request body
    req.body.userId = decoded.userId;

    //case: token decoded successfully
    next();
  } catch (error) {
    res.status(401).json({
      errorMessage: "Unauthorized user",
    });
    
    console.log(error);
  }
};

module.exports = verifyjwt;
