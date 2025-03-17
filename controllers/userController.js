const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

// @desc: register the user
// @route: POST /api/users/register
// @access: public
const registerUser = asyncHandler(async (req,res)=>{
    const {username, email, password} = req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields mandatory");
    }
    const userAvailable = await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("User already registered!")
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password,10);
    const user = await User.create({
        username,
        email,
        password: hashedPassword
    });
    if(user){
        res.status(201).json({
            _id: user.id,
            email: user.email,
        });
    }
    else {
        res.status(400);
        throw new Error('User data is invalid')
    }
    res.json({message: "Register the user"});
});

// @desc: log in the user
// @route: POST /api/users/login
// @access: public
const loginUser = asyncHandler(async (req,res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields mandatory");
    }
    const user = await User.findOne({email})
    if(user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign(
            {
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "10m"}
        );
        res.status(200).json({ accessToken });
    }
    else {
        res.status(401);
        throw new Error("email or password not valid")
    }
});

// @desc: log in the user
// @route: GET /api/users/current
// @access: private
const currentUser = asyncHandler(async (req,res)=>{
    res.json(req.user);
});

module.exports = {registerUser, loginUser, currentUser}