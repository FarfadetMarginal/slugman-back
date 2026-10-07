const {DataTypes} = require('sequelize')
const {sequelize} = require('../config/database')


const Place = sequelize.define('places' ,{
    id_place:{
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
    name_place:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    release_condition_place:{
        type: DataTypes.STRING,
        allowNull: false,
    }
})

module.exports = Place