const { Router } = require('express');
const {Diet} = require('../db')

const router = Router();


router.get('/types', async (req, res, next) => {

    try {
        let diets = await Diet.findAll()
        if (diets.length === 0) {
            let defaultDiets = [{name:"gluten free", img:"GlutenFree"}, 
                                {name:"dairy free", img:"DairyFree"}, 
                                {name:"ketogenic", img:"Keto"}, 
                                {name:"lacto ovo vegetarian", img:"LactovoVeg"}, 
                                {name:"vegan", img:"Vegan"}, 
                                {name:"pescatarian", img:"Pesca"}, 
                                {name:"paleolithic", img:"Paleo"}, 
                                {name:"primal", img:"Primal"}, 
                                {name:"fodmap friendly", img:"Fodmap"}, 
                                {name:"whole 30", img:"Whole"}];

            let promisesDiets = []
            defaultDiets.forEach((diet) => {
                promisesDiets.push(Diet.create({
                    name: diet.name,
                    image: diet.img
                }))
            });
            Promise.all(promisesDiets).then((value) => {
                Diet.findAll().then(diets => {
                    let arrayReturn = diets.map(diet => {
                        return {name: diet.dataValues.name, img: diet.dataValues.image}
                    })
                    console.log("Llegue aca: ", arrayReturn)
                    return res.send(arrayReturn)
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
