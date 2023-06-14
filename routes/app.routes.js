const express = require("express");

const appControllers = require("../controllers/app.controller");

const auth = require("../auth");

const router = express.Router();

router.get("/api/v1/home", appControllers.getHomePage);
router.get("/api/v1/premium-content", auth, appControllers.getPremiumContent);

router.post("/api/v1/register-user", appControllers.registerUser);
router.post("/api/v1/login-user", appControllers.loginUser);

module.exports = router;
