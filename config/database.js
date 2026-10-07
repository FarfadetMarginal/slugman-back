const { Sequelize } = require('sequelize')
const pg = require('pg')
const sequelize = new Sequelize(process.env.DATABASE_URI, {
    dialect: 'postgres',
    dialectModule: pg
})

const connectDB = async () => {
    try {
        await sequelize.authenticate()
        console.log('Connection has been established successfully')
    } catch (err) {
        console.error('Unable to connect to database: ', err)
        throw err;
    }
}
module.exports = { sequelize, connectDB }