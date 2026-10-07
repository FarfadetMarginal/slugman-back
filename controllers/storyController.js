const User = require('../models/userModel')
const Object = require('../models/objectsModel')
const Place = require('../models/placesModel')
const { sequelize } = require('../config/database')
const { QueryTypes } = require('sequelize')

exports.save = async(req, res)=>{ 
    try {
        const {chapter, act} = req.body

        if(!req.user.id_user){
            return res.status(401).json({message : 'not connected'})
        }

        if(!chapter || !act){
            return res.status(400).json({message : 'empty field'})
        }

        const changedUser = await User.findByPk(req.user.id_user)

        if (req.body.chapter!=null){
            changedUser.actual_chapter_user = req.body.chapter
        }
        if (req.body.act!=null){
            changedUser.actual_act_user = req.body.act
        }

        return res.status(201).json({
            message : 'saved ☺',
            user: {
                id_user: changedUser.id_user,
                chapter: changedUser.actual_chapter_user,
                act: changedUser.actual_act_user,
            }
        })
    } catch (err) {
        res.status(500).json({error : err.message})
    }
}


exports.object = async(req, res)=>{ 
    try {
        const {object} = req.body
        const iduser = req.user.id_user

        if(!object){
            return res.status(400).json({message : 'empty field'})
        }

        const existingObject = await Object.findOne({where: {name_object: object}})

        const idobject = existingObject.id_object

        const existingtest = await sequelize.query('SELECT * FROM users_has_objects WHERE fk_id_user = :iduser AND fk_id_object = :idobject', {
            type: QueryTypes.SELECT,
            replacements: { iduser, idobject }
        }) 

        if(existingtest.length >= 1){
            return res.status(400).json({message : 'already have the object'})
        }


        await sequelize.query('INSERT INTO users_has_objects(fk_id_user, fk_id_object) VALUES(:iduser, :idobject)', {
            type: QueryTypes.INSERT,
            replacements: { iduser, idobject }
        }) 
        
        return res.status(201).json({
            message : 'Object obtained successfully',
        })
    } catch (err) {
        res.status(500).json({error : err.message})
    }
}

exports.enterPlace = async(req, res)=>{ 
    try {
        const {place} = req.body
        const iduser = req.user.id_user

        if(!place){
            return res.status(400).json({message : 'empty field'})
        }

        const existingPlace = await Place.findOne({where: {name_place: place}})

        const idplace = existingPlace.id_place

        const existingtest = await sequelize.query('SELECT * FROM users_has_places WHERE fk_id_user = :iduser AND fk_id_place = :idplace', {
            type: QueryTypes.SELECT,
            replacements: { iduser, idplace }
        }) 

        if(existingtest.length >= 1){
            return res.status(400).json({message : 'already in the place'})
        }


        await sequelize.query('INSERT INTO users_has_places(fk_id_user, fk_id_place) VALUES(:iduser, :idplace)', {
            type: QueryTypes.INSERT,
            replacements: { iduser, idplace }
        }) 
        
        return res.status(201).json({
            message : 'Place joined successfully',
        })
    } catch (err) {
        res.status(500).json({error : err.message})
    }
}


exports.leavePlace = async(req, res)=>{ 
    try {
        const {place} = req.body
        const iduser = req.user.id_user

        if(!place){
            return res.status(400).json({message : 'empty field'})
        }

        const existingPlace = await sequelize.query('SELECT name_place, id_place FROM "places" WHERE name_place = :place', {
            type: QueryTypes.SELECT,
            replacements: { place }
        }) 

        const idplace = existingPlace[0].id_place
        console.log(idplace)
        console.log(existingPlace)

        await sequelize.query('DELETE FROM users_has_places WHERE fk_id_user = :iduser AND fk_id_place = :idplace', {
            type: QueryTypes.DELETE,
            replacements: { iduser, idplace }
        }) 
        
        return res.status(201).json({
            message : 'Place left successfully',
        })
    } catch (err) {
        res.status(500).json({error : err.message})
    }
}