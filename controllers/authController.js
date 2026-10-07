const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const { sequelize } = require('../config/database')
const { QueryTypes } = require('sequelize')

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = '150d'

//helper : on génère des tokens
const generateToken = (id) =>{
    return jwt.sign({id}, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    })
}


//US1 : Création de compte ok
exports.register = async(req, res)=>{ 
    try {
        const {name, email, password} = req.body

        if(!name || !email || !password){
            return res.status(400).json({message : 'empty field'})
        }

        const isPasswordOk = validator.isStrongPassword(password, {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })

        if(!isPasswordOk){
            return res.status(400).json({message: "password not valid : 1 maj 1 min 1 number 1 special chars 6 total required"})
        }

        const isEmailOk = validator.isEmail(email)

        if(!isEmailOk){
            return res.status(400).json({message: "email not valid"})
        }
        const existingUser = await sequelize.query('SELECT COUNT(email_user) FROM "users" WHERE email_user = :email', {
            type: QueryTypes.SELECT,
            replacements: { email}
        }) 

        if(existingUser[0].count == 1)
            return res.status(400).json({message: 'Email is already use'})

        const user = await User.create({
            name_user: name,
            email_user: email,
            password_user: password, 
        })
        const token = generateToken(user.id_user)
        return res.status(201).json({
            message : 'User registered successfully',
            token,
            user: {
                id_user: user.id_user,
                name_user: user.name_user,
                email_user: user.email_user,
            }
        })
    } catch (err) {
        res.status(500).json({error : err.message})
    }
}

//US2 : Connexion ok
exports.login = async (req, res) =>{
    try {
        const {email, password} = req.body
        if(!email || !password){
            return res.status(400).json({message : 'empty field'})
        }
        //find user and select password field
        const user = await User.findOne({ where: { email_user: email } })
        if(!user){
            return res.status(401).json({message : 'invalid credantials'})
        }
 
        //check password match
        const isMatch = await bcrypt.compare(password, user.password_user)
        if(!isMatch){
            return res.status(401).json({message : 'incorrect password'})
        }
        const token = generateToken(user.id_user)

        return res.status(200).json({
            message : 'User login successfully',
            token,
            user: {
                id_user: user.id_user,
                name_user: user.name_user,
                email_user: user.email_user,
            }
        })


    } catch (err) {
        res.status(500).json({message : 'server error during login', error: err.message})
    }

}

exports.me = async (req, res) => {
    // req.user est rempli par authMiddleware
    const { id_user, name_user, email_user, fame_user, actual_chapter_user, actual_act_user } = req.user
    return res.status(200).json({
        user: { id_user, name_user, email_user, fame_user, actual_chapter_user, actual_act_user },
    })
}