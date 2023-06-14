const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = await req.headers.authorization.split(" ")[1];
    jwt.verify(token, "Random-Token", async function (err, authData) {
      if (err) {
        return res.status(403).send({ message: "an error occured", err });
      }
      req.user = authData;
    });
    next();
  } catch (error) {
    res.status(401).json({ error: new Error("Invalid Request") });
  }
};
