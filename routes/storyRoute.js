const express = require('express')
const { save, object, leavePlace, enterPlace } = require('../controllers/storyController')
const authMiddleware = require('../middlewares/authMiddleware')
const router = express.Router()

router.patch('/save', authMiddleware, save)
router.post('/object', authMiddleware, object)
router.post('/enter', authMiddleware, enterPlace)
router.delete('/leave', authMiddleware, leavePlace)



module.exports = router 