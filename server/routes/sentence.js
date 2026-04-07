const express = require('express')
const { getRandomSentence } = require('../controllers/sentenceController')

const router = express.Router()

router.get('/', getRandomSentence)

module.exports = router
