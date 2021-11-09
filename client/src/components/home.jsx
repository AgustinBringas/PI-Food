import { useSelector, useDispatch } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { getDiets, getRecipes, filterRecipesByDiets, filterCreated, order } from '../store/actions'
import Recipe from './recipe'
import NavBar from './navBar'
import Paginado from './paginado'
import './home.css'
import LoadingKiwi from '../icons/loadingKiwi'
import AvocadoNotFound from '../icons/notMatch'
import * as icons from '../icons/diet-icons/DietIcons'


export default function Home (props) {
    // Me traigo las cosas del store (allRecipes por el tema del loading)
    let allRecipes = useSelector(state => state.allRecipes)
    let recipes = useSelector(state => state.recipes)
    let diets = useSelector(state => state.diets)
    let dispatch = useDispatch()
    // Para el paginado
    const [currentPage, setCurrentPage] = useState(1)
    const [recipesPerPage, setRecipesPerPage] = useState(9)
    const indexOfLastRecipe = currentPage * recipesPerPage
    const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage
    const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe)
    // Para los checkboxs
    const recipeCheckboxes = document.querySelectorAll('input[type="checkbox"]')
    // Un estado solo para renderizar
    const [render, setRender] = useState('')
    // Objeto para renderizar iconos
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
    
    // Apenas carga la pagina me traigo las recetas y las dietas
    useEffect(() => {
        dispatch(getRecipes())
        dispatch(getDiets())
    }, [])

    // Para setear la pagina
    const paginado = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    // Para la search box
    const onSearch = (name) => {
        // Si escribe algo busca eso
        if (name) {
            dispatch(getRecipes(name))
        } else { // Si no escribe nada trae todas
            dispatch(getRecipes())
        }
    }

    // Crea un array con los valores de los cehckboxs
    const takeCheckboxValues = () => {
        let checkboxValues = []
        recipeCheckboxes.forEach(checkbox => {
            if(checkbox.checked) {
                checkboxValues.push(checkbox.value.toLowerCase())
            }
        })
        return checkboxValues
    }

    // Toma el valor de los checkbox con la funcion de arriba y filtra con ese array
    const dietFilter = (e) => {
        let checkboxValues = takeCheckboxValues()
        dispatch(filterRecipesByDiets(checkboxValues))
        handleOrder(e)
    }

    // Filtra por los creado en mi bdd
    const handleFilterCreated = (e) => {
        dietFilter()
        dispatch(filterCreated(e.target.value))
    }

    // Toma los valores de orderBy y orderType, dispatchea, setea la pagina a la 1 y renderiza
    const handleOrder = (e) => {
        let orderBy = document.getElementById('order-by').value
        let orderType = document.getElementById('order-type').value
        dispatch(order({orderType: orderType, orderBy: orderBy}))
        setCurrentPage(1)
        setRender(render + 'a')
    }
    
    return (
        
        <div className='all'>
            <NavBar onSearch={onSearch}/>
            <div className='filters-container'>
                <div className='checkbox-diets'>
                    {diets.map((diet, index) => {
                        const SpecificImg = components[diet.name.replace(/\s+/g, '')]
                        return (
                            <div className='box-diet'>
                                <input 
                                className='checkbox'
                                type="checkbox" 
                                id={`diet-cb-${index}`} 
                                value={diet.name}
                                onChange={() => dietFilter()}
                                /> 
                                <label for={`diet-cb-${index}`}>
                                    {diet.name.toUpperCase()}
                                    {SpecificImg ? 
                                    <SpecificImg width={32} height={32}/>
                                    : null}
                                </label>
                            </div>
                        )
                    })}
                </div>

            </div>
            
            <div className='options'>
                <div className='order-container'>
                    <select id='order-type' onChange={(e) => handleOrder(e)} defaultValue="Order type">
                        <option hidden value='asc'>Order type</option>
                        <option value='asc'>Ascendant</option>
                        <option value='desc'>Descendant</option>
                    </select>
                </div>
                <div className='order-container'>
                    <select id='order-by' onChange={(e) => handleOrder(e)} defaultValue="Order by">
                        <option hidden value='name'>Order by</option>
                        <option value='name'>Name</option>
                        <option value='healthScore'>Score</option>
                    </select>
                </div>
                <div className='order-container'>
                    <select id='show' onChange={(e) => handleFilterCreated(e)} defaultValue="Show">
                        <option hidden value='all'>Show</option>
                        <option value="all">All</option>
                        <option value="created">My Recipes only</option>
                        <option value="api">Page only</option>
                    </select>
                </div>
            </div>
            {!allRecipes.length
            ? 
            <div className='loading-container'>
                <LoadingKiwi id='loading'/>
                <h1>Loading...</h1>
            </div> 
            :
            recipes.length ?
            <div id='recipes' className='recipes-container'>
                {currentRecipes.map(recipe => {
                    let dietIcons = recipe.diets.map(diet => components[diet.replace(/\s+/g, '')])
                    return <Recipe recipe={recipe} icons={dietIcons}/>
                })}
            </div>
            :
            <div id='not-found'>
                <AvocadoNotFound className="not-found-svg"/>
            </div>
            
            }
            
            <Paginado 
            className='paginado'
            recipesPerPage={recipesPerPage}
            allRecipes={recipes.length}
            paginado={paginado}
            />
        </div>
    )
}