import { React, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clear, getRecipesDetail, deleteRecipe } from '../store/actions'
import  NavBar  from './navBar'
import LoadingKiwi from '../icons/loadingKiwi'
import './recipeDetail.css'
import { useHistory } from 'react-router'
import * as icons from '../icons/diet-icons/DietIcons'
import Trophy from '../icons/trophy.jsx'
import TrashIcon from '../icons/trashIcon'


export default function RecipeDetail(props) {
    const id = props.match.params.id
    let recipeDetail = useSelector(state => state.recipeDetail)
    let dispatch = useDispatch()
    const history = useHistory()
    const components = {
        glutenfree: icons.Glutenfree,
        dairyfree: icons.Dairyfree,
        ketogenic: icons.Keto,
        lactoovovegetarian: icons.Lactovoveg,
        vegan: icons.Vegan,
        pescatarian: icons.Pesca,
        paleolithic: icons.Paleo,
        primal: icons.Primal,
        fodmapfriendly: icons.Fodmap,
        whole30: icons.Whole
    }

    useEffect(() => {
        dispatch(getRecipesDetail(id))
        return function cleanup() {
            dispatch(clear())
        }
    }, [])

    function removeRecipe(e) {
        dispatch(deleteRecipe(recipeDetail.id))
        history.push('/home')
    }

    return (
        <div id="all-detail">
            <NavBar search={false}/>
            {!Object.keys(recipeDetail).length ? <LoadingKiwi id='loading' /> :
            <div className="detail-container">
                <img id='img'src={recipeDetail.image} alt='No img found.'/>
                <h1 id='title'>{recipeDetail.name}</h1>
                <div className='scores-ul-container'>
                    <div className='scores-container'>
                        <div className='score-cont'>
                            <Trophy width={45} height={45}/>
                            <p className='text-score'>{recipeDetail.spoonacularScore}</p>
                        </div>
                        <div className='score-cont'>
                            <p id='corazon'>♥</p>
                            <p className='text-score'>{recipeDetail.healthScore}</p>
                        </div>
                    </div>
                    <div className='dish-diets-container'>
                        <div className='diets-icons-cont'>
                            {recipeDetail.diets?.map((diet, index) => {
                                const SpecificImg = components[diet.replace(/\s+/g, '')]
                                return (
                                    <div className='box-diet'>
                                        {SpecificImg ? 
                                        <SpecificImg width={64} height={64} fill={"#dd5d26"}/>
                                        : null}
                                    </div>
                                )
                            })}
                        </div>
                        <ul id='dishes'><b>Dish/es:</b>{recipeDetail.dishTypes?.map(dish => {
                            return <li>{dish.toUpperCase()}</li>
                        })}</ul>
                    </div>
                </div>

                <p id='summary'>{recipeDetail.summary?.replace(/<[^>]+>/g, '')}</p>
                <hr />
                <h3 id='steps'>Steps:</h3>
                <div id='instructions'>
                    {
                    Array.isArray(recipeDetail.analyzedInstructions)?
                    recipeDetail.analyzedInstructions.map((instruction) => {
                        return <div className='instruction-container'>
                            <p className='instruction-number'>{instruction.number})</p>
                            <p className='instruction-info'>{instruction.step}</p>
                        </div>
                    }): <p>"There are no instructions for this recipe."</p>
                    }
                </div>
                {recipeDetail.id.length > 16 ? <button className='remove-recipe-btn' onClick={e => removeRecipe(e)}>🗑</button> : null}
                
            </div>}

        </div>
    )
}