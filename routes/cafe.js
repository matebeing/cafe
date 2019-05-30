const router = require("express").Router();
const path = require('path')
const jwt = require('jsonwebtoken');

router.get('/cafe', async (req,res) => {
    res.sendFile(path.join(__dirname, '../') + '/views/cafe.html');
})

module.exports = router;