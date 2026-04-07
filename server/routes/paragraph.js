const express = require('express')
const { getRandomParagraph } = require('../controllers/paragraphController')

const router = express.Router()

router.get('/', getRandomParagraph)

module.exports = router
