const { Router } = require('express');
const {Diet} = require('../db')

const router = Router();


router.get('/types', async (req, res, next) => {

    try {
        let diets = await Diet.findAll()
        if (diets.length === 0) {
            let defaultDiets = ["gluten free",
                                "dairy free",          
                                "ketogenic",           
                                "lacto ovo vegetarian",
                                "vegan",               
                                "pescatarian",         
                                "paleolithic",         
                                "primal",              
                                "fodmap friendly",     
                                "whole 30"];

            let promisesDiets = []
            defaultDiets.forEach((diet) => {
                promisesDiets.push(Diet.create({
                    name: diet
                }))
            });
            Promise.all(promisesDiets).then((value) => {
                Diet.findAll().then(diets => {
                    return res.send(value)
                })
            })
        } else {
            res.send(diets)
        }
    } catch(error) {
        next(error)
    }
})

module.exports = router;
