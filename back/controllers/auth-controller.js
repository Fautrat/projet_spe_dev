const { User } = require('../models/users-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

module.exports.Register = async(req,res) =>{

    const {email, password} = req.body;
    console.log(email,password);
    try{

        if (!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({
                message:
                'Mot de passe faible : minimum 8 caractères, avec majuscule, minuscule, chiffre et symbole.'
            });
        }

        const existingUser = await User.findOne({ where: { email } });
        if(existingUser) return res.status(400).json({message : "User already in the database"});

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
        const token = jwt.sign({ email: existingUser.email }, process.env.JWT_SECRET, { expiresIn: '1h'});

        res.cookie('token', token, { httpOnly: true });
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

