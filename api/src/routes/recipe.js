const { Router } = require('express');
const {Recipe} = require('../db')

const router = Router();

router.post('/', async (req, res, next) => {
    try {
        // Agarro todos los valores del body y creo la nueva receta
        console.log(req.body)
        const { name, summary, spoonacularScore, healthScore, analyzedInstructions, image } = req.body
        let newRecipe = await Recipe.create({
            name,
            summary,
            spoonacularScore,
            healthScore,
            analyzedInstructions,
            image
        })
        return res.send(newRecipe.dataValues)
        
    } catch(error) {
        next(error)  //Va al proximo middleware que es el de manejo de errores
    }
})

router.post('/:idRecipe/diet/:idDiet', async (req, res, next) => {

    try {
        const { idRecipe, idDiet } = req.params
        const recipe = await Recipe.findByPk(idRecipe)
        await recipe.addDiet(idDiet)
        res.send('ok')

    } catch(error) {
        next(error)  // Va al proximo middleware que es el de manejo de errores
    }
})

module.exports = router;