const { Router } = require('express');
const {Diet} = require('../db')

const router = Router();

// router.get('/', (req, res, next) => {
//     return Diet.findAll()
//     .then(diet => {
//         res.send(diet)
//     })
//     .catch(error => {
//         next(error) //Va al proximo middleware que es el de manejo de errores
//     })
// })

router.get('/types', async (req, res, next) => {

    try {
        let diets = await Diet.findAll()
        if (diets.length === 0) {
            let defaultDiets = ["gluten free","dairy free", "ketogenic", "vegetarian", "lacto ovo vegetarian", "vegan", "pescatarian", "paleolithic", "primal", "fodmap friendly", "whole 30"]
            let promisesDiets = []
            defaultDiets.forEach((diet) => {
                promisesDiets.push(Diet.create({
                    name: diet
                }))
            });
            Promise.all(promisesDiets).then((value) => {
                Diet.findAll().then(diets => {
                    return res.send(diets)
                })
            })
        } else {
            res.send(diets)
        }
    } catch(error) {
        next(error)
    }
})

router.post('/', (req, res, next) => {
    const { name } = req.body
    return Diet.create({
        name
    }).then(newDiet => {
        res.send(newDiet)
    })
    .catch(error => {
        next(error)  //Va al proximo middleware que es el de manejo de errores
    })
})


module.exports = router;
