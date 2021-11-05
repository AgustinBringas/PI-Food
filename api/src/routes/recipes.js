const { Router } = require('express');
const {Recipe, Diet} = require('../db')
const {Op} = require('sequelize');
const axios = require('axios')


const router = Router();
// agustin.bringas
const apiKey = '6f8483e9e0d147498227b6f04df7a4b8'
// harry210798
// const apiKey = '3e53167df35647c19dfd101a5233dbc5'
// 1
// const apiKey = 'be5300dbbf044534a95cd8b9e861ed56'
// 2
// const apiKey = '35a39f22390440e9a4557b2ef96f28cf'
// 3
// const apiKey = '6578d9b882e7494b9ace55114866764c'



const number = 100

router.get('/', async (req, res, next) => {
    try {
        const {name} = req.query
        let recipesDb
        let recipesApi
        // Si la ruta es del tipo /recipes?name=algo
        if (name) {
            // Busco todas las recetas que incluyan el name usando el op.like
            recipesDb = await Recipe.findAll({
                where: {
                    name: {
                        [Op.iLike]: '%' + name + '%'
                    }
                },
                raw: true,
                nest: false
            })
        } else {  // Si no hay query, busco todos
            // Tanto en mi DB
            recipesDb = await Recipe.findAll({
                include: [
                    { 
                        model: Diet, 
                        as: 'diets', 
                        attributes: ['id', 'name'], 
                        through: { attributes: [] }
                    }
                ],
                // raw: true,
                nest: true
            })
            recipesDb = recipesDb.map(recipe => {
                return {
                    id: recipe.dataValues.id,
                    name: recipe.dataValues.name,
                    summary: recipe.dataValues.summary,
                    spoonacularScore: recipe.dataValues.spoonacularScore,
                    healthScore: recipe.dataValues.healthScore,
                    image: recipe.dataValues.image,
                    createdInDb: recipe.dataValues.createdInDb,
                    diets: recipe.dataValues.diets.map(diet => {
                        return diet.dataValues.name
                    }),
                    analyzedInstructions: recipesDb[0]?.dataValues.analyzedInstructions
                }
            })
            // Como en la API

        }
        // Mapeo el resultado de la API para sacar solo los datos que necesito
        recipesApi = await axios(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&addRecipeInformation=true&number=${number}`)
        let filteredRecipesApi = [];
        recipesApi.data.results.map(recipe => {
            if (name) {
                if(recipe.title.toLowerCase().includes(name.toLowerCase())) {
                    filteredRecipesApi.push({
                        id: recipe.id,
                        name: recipe.title,
                        summary: recipe.summary,
                        spoonacularScore: recipe.spoonacularScore,
                        healthScore: recipe.healthScore,
                        diets: recipe.diets,
                        image: recipe.image
                    })
                } 
            } else {
                filteredRecipesApi.push({
                    id: recipe.id,
                    name: recipe.title,
                    summary: recipe.summary,
                    spoonacularScore: recipe.spoonacularScore,
                    healthScore: recipe.healthScore,
                    diets: recipe.diets,
                    image: recipe.image
                })
            }
        })
        // Concateno las cosas que tengo en mi DB con las de la API
        let allRecipes = [...filteredRecipesApi, ...recipesDb]
        // Ordeno por nombre
        allRecipes.sort((a, b) => {
            if(a.name.toLowerCase() < b.name.toLowerCase()) {
                return -1
            }
            if(a.name.toLowerCase() > b.name.toLowerCase()) {
                return 1
            }
            return 0
        })
        // Se hace esta comprobacion por si hay query pero no se encontro resultado
        if (allRecipes.length > 0) {
            return res.send(allRecipes)
        } else {
            return res.send('No recipes found.')
        }

    } catch(error) {
        next(error)  // Va al proximo middleware que es el de manejo de errores
    }
})

router.get('/:idRecipe', async (req, res, next) => {
    try {
        let recipe
        const { idRecipe } = req.params
        // Si es de tipo string el ID es mio
        if (typeof idRecipe === 'string' && idRecipe.length > 8) {
            recipe = await Recipe.findByPk(idRecipe)
            let diets = await recipe.getDiets()
            diets = diets.map(diet => {
                return diet.dataValues.name
                
            })
            return res.send({...recipe.dataValues, diets})
        } else {        // Si es de la API
            recipe = await axios(`https://api.spoonacular.com/recipes/${idRecipe}/information?apiKey=${apiKey}`)
            let filteredRecipe = {
                id: recipe.data.id,
                name: recipe.data.title,
                summary: recipe.data.summary,
                spoonacularScore: recipe.data.spoonacularScore,
                healthScore: recipe.data.healthScore,
                analyzedInstructions: recipe.data.analyzedInstructions.length ? recipe.data.analyzedInstructions[0].steps : "There are no instructions.",
                diets: recipe.data.diets,
                image: recipe.data.image,
                dishTypes: recipe.data.dishTypes
            }
            res.send(filteredRecipe)
        }

            
    } catch(error) {
        next(error) // Va al proximo middleware que es el de manejo de errores
    }
})


router.delete('/', (req, res, next) => {
    res.send('Soy el delete de recipes')
})

module.exports = router;
