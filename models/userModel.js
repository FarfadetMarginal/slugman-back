const {DataTypes} = require('sequelize')
const {sequelize} = require('../config/database')
const bcrypt = require('bcryptjs')

const User = sequelize.define('users' ,{
    id_user:{
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name_user:{
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    email_user:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate:{
            isEmail: true,
        }
    },
    password_user:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    fame_user:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,
        defaultValue: 0,
    },
    actual_chapter_user:{
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
    },
    actual_act_user:{
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
    },
},{
    hooks:{
        beforeSave: async (user) =>{
        if(!user.changed('password_user')) return;
        const salt = await bcrypt.genSalt(10)
        user.password_user = await bcrypt.hash(user.password_user, salt)
        }
    }
})

//comparer le mdp input avec le mdp hashé
User.prototype.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}
module.exports = User