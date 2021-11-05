import  {GET_RECIPES,
         GET_RECIPES_DETAIL,
         GET_DIETS,
         FILTER_BY_DIETS,
         FILTER_CREATED,
         ORDER,
         ADD_RECIPE,
         ADD_DIET,
         ADD_DIETS_TO_RECIPE,
         CLEAR } from "../actions"

const initialState = {
    allRecipes: [],
    recipes: [],
    diets: [],
    recipeDetail: {}
}

export default function reducer(state=initialState, action) {
    switch(action.type) {
        case GET_RECIPES:
            return {
                ...state,
                recipes: action.payload,
                allRecipes: action.payload
            }
        case GET_RECIPES_DETAIL:
            let analyzedInstructions
            if(action.payload.id.length > 8) {
                analyzedInstructions = action.payload.analyzedInstructions.map(instruction => {
                    return JSON.parse(instruction)
                })
            } else {
                analyzedInstructions = action.payload.analyzedInstructions
            }
            return {
                ...state,
                recipeDetail: {...action.payload,
                                analyzedInstructions: analyzedInstructions     
                                }
            }
        case GET_DIETS:
            return {
                ...state,
                diets: action.payload
            }
        case FILTER_BY_DIETS:
            const selectedDiets = action.payload
            let filteredRecipes = state.allRecipes.filter((recipe) => {
                let existe = selectedDiets?.every(diet =>recipe.diets?.includes(diet));
                if (existe) return recipe
            })
            return {
                ...state,
                recipes: filteredRecipes
            }
        case FILTER_CREATED:
            const allRecipes = state.recipes
            const createdFilter = action.payload === 'created' ? allRecipes.filter(recipe => recipe.createdInDb) : allRecipes.filter(recipe => !recipe.createdInDb)
            return {
                ...state,
                recipes: action.payload === 'all' ? state.allRecipes : createdFilter
            }
        case ORDER:
            const orderType = action.payload.orderType
            const orderBy = action.payload.orderBy
            const sortedRecipes = orderType === 'asc' ?
                    state.recipes.sort((a, b) => {
                        if(a[orderBy] > b[orderBy]) {
                            return 1
                        }
                        if(a[orderBy] < b[orderBy]) {
                            return -1
                        }
                        return 0
                    }):
                    state.recipes.sort((a, b) => {
                        if(a[orderBy] < b[orderBy]) {
                            return 1
                        }
                        if(a[orderBy] > b[orderBy]) {
                            return -1
                        }
                        return 0
                    });
            return {
                ...state,
                recipes: sortedRecipes
            }
        case ADD_RECIPE:
            return {
                ...state,
                recipes: [...state.recipes, action.payload]
            }
        case ADD_DIET:
            return {
                ...state,
                diets: [...state.diets, action.payload]
            }
        case CLEAR: 
            return {
                ...state,
                recipeDetail: {}
            }
        default:
            return state
    }
}
