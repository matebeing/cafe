const router = require("express").Router();
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const bcrypt = require ('bcryptjs');
const isImageUrl = require('is-image-url')
const randomColor = require('randomcolor');
const Joi = require('@hapi/joi');

const schema = {
    username: Joi.string().min(3).max(20).required(),
    password: Joi.string().min(6).max(1024).required(),
    avatar: Joi.string()
};


/* Server - Nickname filter */
function filterNickname(str)
{
    return str.replace(/</g, '').replace(/>/g, '')
    .replace(/'/g, '')
    .replace(/\//g, '').replace(/\\/g, '')
    .replace(/\((.+?)\)/g, '')
    .replace(/;/g, '').replace(/\./g, '')
    .replace(/\*/g, "")
    .replace(/(^|\n)> ?(.*)/g, "")
    .replace(/!\[(.+?)\]\((.+?)\)/g, "")
    .replace(/ +/g, '')
    .replace(/\n +/g, '')
    .replace(/^ +| +$/g, '')
    .replace(/\n/g, "");
}



router.post('/register', async (req,res) => {
    console.log(req.body)
    // Validate user data
    const {error} = Joi.validate({username: filterNickname(req.body.username), password: req.body.password, avatar: req.body.avatar}, schema)
    if (error) return res.status(400).send(error.details[0].message)

    // Check if the user exists
    const userExist = await User.findOne({username: filterNickname(req.body.username)});
    if (userExist) return res.status(400).send("Username is already in use")

    // Check if image is valid
    const validImage = await isImageUrl(req.body.avatar);
    if (!validImage) return res.status(400).send("Invalid image")

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    // Create user
    const user = new User({
        username: filterNickname(req.body.username),
        password: hashedPassword,
        avatar: req.body.avatar,
        colorName: randomColor(),
    });

    try {
        const savedUser = await user.save();
        
        // Create token
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
        res.send({user: user._id, token})

    } catch(err) {
        res.status(400).send(err);
    }
})

router.post('/login', async (req, res) => {
    // Validate user data
    const {error} = Joi.validate({username: filterNickname(req.body.username), password: req.body.password}, schema)
    if (error) return res.status(400).send(error.details[0].message)

    // Check if the user exists
    const user = await User.findOne({username: filterNickname(req.body.username)});
    if (!user) return res.status(400).send("User doesn't exist")

    // Check if the password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send("Password is incorrect")

    // Create token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)

    // Login
    res.send({user: user._id, token: token})
})

module.exports = router;
