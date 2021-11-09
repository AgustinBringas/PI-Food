export const GET_RECIPES = 'GET_RECIPES'
export const GET_RECIPES_DETAIL = 'GET_RECIPES_DETAIL'
export const GET_DIETS = 'GET_DIETS'
export const FILTER_BY_DIETS = 'FILTER_BY_DIETS'
export const FILTER_CREATED = 'FILTER_CREATED'
export const ORDER_BY_SCORE = 'ORDER_BY_SCORE'
export const ORDER = 'ORDER'
export const ADD_RECIPE = 'ADD_RECIPE'
export const ADD_DIET = 'ADD_DIET'
export const ADD_DIETS_TO_RECIPE = 'ADD_DIETS_TO_RECIPE'
export const CLEAR = 'CLEAR'
export const DELETE_RECIPE = 'DELETE_RECIPE'

export function getRecipes(name) {
    if(name) {
        return function(dispatch) {
            fetch('http://localhost:3001/api/recipes?name='+ name)
            .then(response => response.json())
            .then(json => {
                dispatch({ type: GET_RECIPES, payload: json })
            })
        }
    } else {
        return function(dispatch) {
            fetch('http://localhost:3001/api/recipes')
            .then(response => response.json())
            .then(json => {
                dispatch({ type: GET_RECIPES, payload: json })
            })
            .catch(error => {
                console.log(error)
            })
        }
    }
}

export function getRecipesDetail(id) {
    return function(dispatch) {
        fetch('http://localhost:3001/api/recipes/' + id)
        .then(response => response.json())
        .then(json => {
            dispatch({ type: GET_RECIPES_DETAIL, payload: json })
        })
        .catch(error => {
            console.log(error)
        })
    }
}

export function getDiets() {
    return function(dispatch) {
        fetch('http://localhost:3001/api/diets/types')
        .then(response => response.json())
        .then(json => {
            dispatch({ type: GET_DIETS, payload: json })
        })
        .catch(error => {
            console.log(error)
        })
    }
}

export function filterRecipesByDiets(payload) {
    return {
        type: FILTER_BY_DIETS, 
        payload
    }
}

export function filterCreated(payload){
    return {
        type: FILTER_CREATED, 
        payload
    }
}

export function order(payload){
    return {
        type: ORDER,
        payload
    }
}

export function addRecipe(payload, history) {
    return function(dispatch) {
        fetch('http://localhost:3001/api/recipe', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(payload)

        })
        .then(response => response.json())
        .then(json => {
            let idRecipe = json.id
            let promises = payload.diets.map(diet => {
                return fetch(`http://localhost:3001/api/recipe/${idRecipe}/diet/${diet}`, {
                    method: 'POST'
                })
            });
            Promise.all(promises).then(dispatch({type: ADD_RECIPE, payload: json}))
            history.push("/recipe/" + idRecipe)
        })
    }
}
    
    
export function addDietsToRecipe(payload) {
    return function(dispatch) {
        fetch(`http://localhost:3001/api/recipe/${payload.recipeId}/diet/${payload.dietId}`, {
            method: 'POST',
        })
        .then(response => response.json())
        .then(json => dispatch({type: ADD_DIETS_TO_RECIPE, payload: json}))

    }
}


export function clear() {
    return {
        type: CLEAR
    }
}

export function deleteRecipe(payload) {
    return async function(dispatch) {
        console.log('Llego al action')
        await fetch(`http://localhost:3001/api/recipe/${payload}`, {
            method: 'DELETE'
        })
        dispatch({type: DELETE_RECIPE, payload})
    }
}