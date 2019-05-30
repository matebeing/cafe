const router = require("express").Router();
const path = require("path");

router.get('/register', (req,res) => {
    res.sendFile(path.join(__dirname, '../') + '/views/register.html');
})
module.exports = router;