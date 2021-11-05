const { Router } = require('express');
const recipesRoute = require('./recipes')
const dietRoute = require('./diets')
const recipeRoute = require('./recipe')


const router = Router();
router.use('/recipe', recipeRoute)
router.use('/recipes', recipesRoute)
router.use('/diets', dietRoute)

module.exports = router;
