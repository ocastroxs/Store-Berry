const express = require("express");
const router = express.Router();
const assetRegex = /\.(css|js|png|jpg|jpeg|svg|ico|map|woff2?|ttf)$/i;
const logger = (req, res, next) => {
    if (assetRegex.test(req.path)) return next();
    
    const data = new Date();
    console.log(`[${data.toISOString()}] ${req.method} ${req.url}`);
    next();
};

router.use(logger);

module.exports = router;