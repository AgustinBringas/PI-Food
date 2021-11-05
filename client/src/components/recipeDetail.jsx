import { React, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clear, getRecipesDetail } from '../store/actions'
import  NavBar  from './navBar'
import LoadingKiwi from '../icons/loadingKiwi'
import './recipeDetail.css'

export default function RecipeDetail(props) {
    const id = props.match.params.id
    let recipeDetail = useSelector(state => state.recipeDetail)
    let dispatch = useDispatch()

    useEffect(() => {
        dispatch(getRecipesDetail(id))
        return function cleanup() {
            dispatch(clear())
        }
    }, [])
    return (
        <div id="all-detail">
            <NavBar search={false}/>
            {!Object.keys(recipeDetail).length ? <LoadingKiwi id='loading' /> :
            <div className="detail-container">
                <img id='img'src={recipeDetail.image}/>
                <h1 id='title'>{recipeDetail.name}</h1>
                <ul id='diets'><b>Diet/s:</b>{recipeDetail.diets?.map(diet => {
                    return <li>{diet.toUpperCase()}</li>
                })}</ul>
                <ul id='dishes'><b>Diet/s:</b>{recipeDetail.dishTypes?.map(dish => {
                    return <li>{dish.toUpperCase()}</li>
                })}</ul>
                <p id='summary'>{recipeDetail.summary?.replace(/<[^>]+>/g, '')}</p>
                <p id='spoon-score'>Overall score: {recipeDetail.spoonacularScore}</p>
                <p id='health-score'>Health score: {recipeDetail.healthScore}</p>
                <h3 id='steps'>Steps:</h3>
                <div id='instructions'>
                    {
                    Array.isArray(recipeDetail.analyzedInstructions)?
                    recipeDetail.analyzedInstructions.map((instruction) => {
                        return <div className='instruction-container'>
                            <p className='instruction-number'>{instruction.number}</p>
                            <p className='instruction-info'>{instruction.step}</p>
                        </div>
                    }): <p>"There are no instructions for this recipe."</p>
                    }
                </div>
            </div>}

        </div>
    )
}