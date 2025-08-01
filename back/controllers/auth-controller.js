const { User } = require('../models/users-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Tokens = require('csrf');
const tokens = new Tokens();
require('dotenv').config({ path: '../.env' });

module.exports.Register = async(req,res) =>{

    const {email, password} = req.body;
    console.log(email,password);
    try{

        const existingUser = await User.findOne({ where: { email } });
        if(existingUser) return res.status(400).json({message : "L'utilisateur existe déjà"});

        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT));
        const newUser = await User.create({
            email : email,
            password : hashedPassword,
        });

        res.status(201).json({ message: 'User created successfully', user: { email: newUser.email } });
    }
    catch(ex){
        console.error("Server error:", ex);
        res.status(500).json({ message: "Server error", error: ex.message });
    }
}

module.exports.Login = async(req,res) =>{
    const {email, password} = req.body;
    console.log(email,password);
    try{
        const existingUser = await User.findOne({ where: { email } });
        if(!existingUser) return res.status(400).json({message : "Invalid credentials"});

        const isValidPassword = await bcrypt.compare(password,existingUser.password);
        if(!isValidPassword) return res.status(400).json({message : "Invalid credentials"});
        const token = jwt.sign({ email: existingUser.email, id: existingUser.id, csrfSecret : tokens.secretSync()}, process.env.JWT_SECRET, { expiresIn: '1h'});

        res.cookie('token', token, { httpOnly: true, sameSite : 'Strict' }); // secure : true en production 
        res.status(200).json({ message: 'Login successful', token: token });
    }
    catch(ex){
        console.error("Server error:", ex);
        res.status(500).json({ message: "Server error", error: ex.message });
    }
}


module.exports.Logout = async(req,res) =>{
    try{
        res.clearCookie('token');
        res.status(200).json({ message: 'Logout successful' });
    }
    catch(ex){
        console.error("Server error:", ex);
        res.status(500).json({ message: "Server error", error: ex.message });
    }
}

