const {DataTypes} = require('sequelize')
const {sequelize} = require('../config/database')


const Object = sequelize.define('objects' ,{
    id_object:{
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name_object:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
})

module.exports = Object
