import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { addRecipe } from '../store/actions'
import './recipeCreate.css'
import NavBar from './navBar'
import CookingGuy from '../icons/cookingGuy'
import Recipe from './recipe'
import * as icons from '../icons/diet-icons/DietIcons'
import { useHistory } from 'react-router'


export default function RecipeCreate() {
    // Me traigo los tipos de dieta
    let diets = useSelector(state => state.diets)
    let recipes = useSelector(state => state.recipes)
    const dispatch = useDispatch()
    // Creo un estado local con las cosas del form
    const [input, setInput] = useState({
      name: '',
      summary: '',
      healthScore: '',
      spoonacularScore: '',
      analyzedInstructions: '',
      diets: '',
      image: ''
    })
    // Estado local para errores
    const [error, setError] = useState({nuevo: true})
    // Tomo los valores de los checkbox
    const recipeCheckboxes = document.querySelectorAll('input[type="checkbox"]')
    // Variable para contar los pasos
    let count = 0;
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
    let dietIcons

    let history = useHistory()


    // Funcion para agregar pasos visualmente
    function addInput() {
        // Me traigo el form
        let form = document.getElementById('form')
        // Aumento el numero de pasos
        count++
        // Creo un snippet
        let snippet = document.getElementById('anInst0')
        // Lo clono
        let clone = snippet.cloneNode(true)
        // Le asigno el id correspondiente
        clone.id = 'anInst' + count 
        // Busco el tag y le cambio el contenido
        let tag = clone.children[0]
        tag.textContent = 'Step ' + (count + 1)
        // Busco el boton de remove, lo hago visible y le agrego el onclick
        let remove = clone.children[1]
        remove.style.display = 'inline-block'
        remove.className = 'remove-btn'
        remove.onclick=((e) => removeInput(e))
        // Busco el boton de add y le agrego el onclick
        let add = clone.children[3]
        add.className = 'add-btn'
        add.onclick=(() => addInput())
        // Le seteo el valor a vacio
        clone.children[2].value = ''
        // Lo agrego al form
        form.appendChild(clone)
    }

    // Funcion para eliminar isntrucciones
    function removeInput(elem) {
        let form = document.getElementById('form')
        let parent = elem.path[1]
        let removed = parent.remove()
    }
    
    // Funcion para tomar instrucciones
    function takeInstructions() {
        let analyzedInstructions = []
        for (let i = 0; i < document.querySelectorAll(".anInstructions").length; i++) {
            const element = document.querySelectorAll(".anInstructions")[i];
            analyzedInstructions.push({number: i, step: element.value})
        }
        return analyzedInstructions
    }

    // Handle change de los input
    function handleChange(e){
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })

        setError(validateFields({...input, 
            [e.target.name]: e.target.value}))


    }

    // Handle change de la img
    function handleImageChange(e){
        if(e.target.files && e.target.files[0]) {
            console.log(e.target.files[0])
            setInput({
                ...input,
                image: URL.createObjectURL(e.target.files[0])
            })
        }
    }
    
    // Handle del submit
    async function handleSubmit(e){
        e.preventDefault();
        let checkboxValue = takeCheckboxValues()
        input.diets = checkboxValue
        let analyzedInstructions = takeInstructions()
        input.analyzedInstructions = analyzedInstructions
        dispatch(addRecipe(input, history))
        setInput({
            name: '',
            summary: '',
            healthScore: '',
            spoonacularScore: '',
            analyzedInstructions: '',
            diets: [],
            image: ''
        })
    }

    // Funcion para tomar los values de los checkbox
    function takeCheckboxValues(){
      let checkboxValues = []
      recipeCheckboxes.forEach(checkbox => {
          if(checkbox.checked) {
              checkboxValues.push(checkbox.id)
          }
      })
      return checkboxValues
    }

    function onCheckboxChange(e){
    let checkboxValues = []
    recipeCheckboxes.forEach(checkbox => {
        if(checkbox.checked) {
            checkboxValues.push(checkbox.value)
        }
      })
    setInput({
        ...input,
        diets: checkboxValues
    })
    }

    // Funcion para validar errores
    function validateFields(input) {
        let errores = {}
        if (!input.name) {
            errores.errorName = 'Name is required'
        }
        if (!input.summary) {
            errores.errorSummary = 'Summary is required'

        } 
        if (!input.healthScore) {
            errores.errorHealthScore = 'HealthScore is required'
        } else if(!parseInt(input.healthScore)) {
            errores.errorHealthScore = 'HealthScore must be a number'
        } else if(parseInt(input.healthScore) < 0 || parseInt(input.healthScore) > 100) {
            errores.errorHealthScore = 'HealthScore must be a number between 0-100'
        }
        return errores
      }

    function decrementSpoon(e) {
        e.preventDefault()
        setInput({
            ...input,
            spoonacularScore: --input.spoonacularScore
        })
    }

    function incrementSpoon(e) {
        e.preventDefault()
        setInput({
            ...input,
            spoonacularScore: ++input.spoonacularScore
        })
    }

    function decrementHealth(e) {
        e.preventDefault()
        setInput({
            ...input,
            healthScore: --input.healthScore
        })
    }

    function incrementHealth(e) {
        e.preventDefault()
        setInput({
            ...input,
            healthScore: ++input.healthScore
        })
    }


    return (
        <div id='all-form'>
            <NavBar search={false}/>
            <div className='all-container'>
                <div className='form-container'>
                    <form className='create-form' onSubmit={handleSubmit}>
                        <div className='title-create'>
                            <h1 className='title-create-text'>My new recipe</h1>
                            {<CookingGuy width={48} height={48} className='cooking-guy'/>}
                        </div>
                        <div id='sub-text'></div>
                        <div className='form-input'>
                            <label className='input-label-create' htmlFor="name">Name</label>
                            <input className='input-create' name="name" type="text" value={input.name} onChange={handleChange} required placeholder='Name of the recipe...'/>
                        </div>
                        {!error.errorName ? null : <span className='error'>{error.errorName}</span>}
                        <div className='form-input-summary'>
                            <label className='input-label-create'htmlFor="summary">Summary</label>
                            <textarea name="summary" value={input.summary} onChange={handleChange} required rows='5' cols='40' placeholder='Brief summary of the recipe...'/>
                        </div>
                        {!error.errorSummary ? null : <span className='error'>{error.errorSummary}</span>}
                        <div className='form-input'>
                            <label className='input-label-create' htmlFor="healthScore">Health score</label>
                            <button onClick={(e) => decrementHealth(e)} className='btn-decrement'>-</button>
                            <input className='input-create-number' name="healthScore" type="number" min='0' max='100' value={input.healthScore} onChange={handleChange}/>
                            <button onClick={(e) => incrementHealth(e)} className='btn-increment'>+</button>
                        </div>
                        {!error.errorHealthScore ? null : <span className='error'>{error.errorHealthScore}</span>}
                        <div className='form-input'>
                            <label className='input-label-create' htmlFor="spoonacularScore">Overall score</label>
                            <button onClick={(e) => decrementSpoon(e)} className='btn-decrement'>-</button>
                            <input className='input-create-number' name="spoonacularScore" type="number" min='0' max='100'value={input.spoonacularScore} onChange={handleChange}/>
                            <button onClick={(e) => incrementSpoon(e)} className='btn-increment'>+</button>
                        </div>
                        <div id='form'> 
                            <span>Analyzed Instructions: </span>
                            <div className='form-input' id='anInst0' >
                                <label className='input-label-create' htmlFor="analyzedInstructions">Step 1</label>
                                <input type="button" value="-" onClick={e => removeInput(this)} style={{display:"none"}} className='remove-btn'/>
                                <input className='input-create-instructions' name="analyzedInstructions" type="text" value={input.analyzedInstructions} onChange={handleChange} className="anInstructions"/>
                                <input type="button" value="+" onClick={() => addInput()} className='add-btn'/>
                            </div>
                        </div>
                        
                        <div className='form-input'>
                            <p>Select one or more diets to assing to your recipe:</p>
                            <div className='checkboxs-diets'>
                                {diets.map((diet, index) => {
                                    return (
                                        <div className='cb-container'>
                                            <input 
                                            className='cb'
                                            type="checkbox" 
                                            id={diet.id} 
                                            value={diet.name}
                                            onChange={(e) => onCheckboxChange(e)}
                                            /> 
                                            <label htmlFor={diet.id} className='cb-label'>{diet.name.toUpperCase()}</label>
                                        </div>
                                    )
                                })}
                            </div>

                        </div>
                        <div className='form-input'>
                            <label className='input-label-create' htmlFor="image">Image</label>
                            <input name="image" type="file" onChange={handleImageChange}/>
                        </div>
                            {!Object.keys(error).length ? <button className='submit-btn' type="submit">Create my recipe</button>: <button className='submit-btn' type="submit" disabled={true}>Create my recipe</button>}
                    </form>
                </div>
                {input.image.length > 16 ?
                <div className='card-created'>
                    {input.diets ? dietIcons = input.diets?.map(diet => components[diet.replace(/\s+/g, '')]) : dietIcons = null}
                    {dietIcons ? <Recipe recipe={{name:input.name, image: input.image, diets, healthScore: input.healthScore}} icons={dietIcons}/> : <Recipe recipe={{name:input.name, image: input.image, diets, healthScore: input.healthScore}}/> }
                    
                </div>
                : null}

            </div>
            
        </div>
                )
            }