import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { addRecipe } from '../store/actions'
import './recipeCreate.css'
import NavBar from './navBar'


export default function RecipeCreate() {
    let diets = useSelector(state => state.diets)
    const dispatch = useDispatch()
    const [input, setInput] = useState({
      name: '',
      summary: '',
      healthScore: '',
      spoonacularScore: '',
      analyzedInstructions: '',
      diets: '',
      image: ''
    })
    const [error, setError] = useState({nuevo: true})
    const recipeCheckboxes = document.querySelectorAll('input[type="checkbox"]')
    let count = 0;

    function addInput() {
        let form = document.getElementById('form')
        count++
        let snippet = document.getElementById('anInst0')
        let clone = snippet.cloneNode(true)
        clone.id = 'anInst' + count 
        let tag = clone.children[0]
        tag.textContent = 'Step ' + (count + 1)
        let remove = clone.children[3]
        remove.style.display = 'inline-block'
        remove.onclick=((e) => removeInput(e))
        let add = clone.children[2]
        add.onclick=(() => addInput())
        clone.children[1].value = ''
        form.appendChild(clone)
        
    }

    function removeInput(elem) {
        let form = document.getElementById('form')
        let parent = elem.path[1]
        let removed = parent.remove()
    }
    
    function takeInstructions() {
        let analyzedInstructions = []
        for (let i = 0; i < document.querySelectorAll(".anInstructions").length; i++) {
            const element = document.querySelectorAll(".anInstructions")[i];
            analyzedInstructions.push({number: i, step: element.value})
        }
        return analyzedInstructions
    }

    function handleChange(e){
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })

        setError(validateFields({...input, 
            [e.target.name]: e.target.value}))


    }

    function handleImageChange(e){
        if(e.target.files && e.target.files[0])
        setInput({
            ...input,
            image: URL.createObjectURL(e.target.files[0])
        })
    }
    
    function handleSubmit(e){
        e.preventDefault();
        let checkboxValue = takeCheckboxValues()
        input.diets = checkboxValue
        let analyzedInstructions = takeInstructions()
        input.analyzedInstructions = analyzedInstructions
        dispatch(addRecipe(input))
        setInput({
            name: '',
            summary: '',
            healthScore: '',
            spoonacularScore: '',
            analyzedInstructions: '',
            diets: '',
            image: ''
        })
    }


    function takeCheckboxValues(){
      let checkboxValues = []
      recipeCheckboxes.forEach(checkbox => {
          if(checkbox.checked) {
              checkboxValues.push(checkbox.id)
          }
      })
      return checkboxValues
    }

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


    return (
        <div id='all-form'>
            <NavBar search={false}/>
            <div className='form-container'>
                <form className='create-form' onSubmit={handleSubmit}>
                    <h1>My new recipe</h1>
                    <div className='form-input'>
                        <label className='input-label' for="name">Name</label>
                        <input className='input-create' name="name" type="text" value={input.name} onChange={handleChange} required placeholder='Name of the recipe...'/>
                        {!error.errorName ? null : <span>{error.errorName}</span>}
                    </div>
                    <div className='form-input'>
                        <label className='input-label'for="summary">Summary</label>
                        <textarea name="summary" value={input.summary} onChange={handleChange} required rows='5' cols='40' placeholder='Brief summary of the recipe...'/>
                        {!error.errorSummary ? null : <span>{error.errorSummary}</span>}
                    </div>
                    <div className='form-input'>
                        <label className='input-label' for="healthScore">Health score</label>
                        <input className='input-create' name="healthScore" type="number" min='0' max='100' value={input.healthScore} onChange={handleChange}/>
                        {!error.errorHealthScore ? null : <span>{error.errorHealthScore}</span>}
                    </div>
                    <div className='form-input'>
                        <label className='input-label' for="spoonacularScore">Overall score</label>
                        <input className='input-create' name="spoonacularScore" type="number" min='0' max='100'value={input.spoonacularScore} onChange={handleChange}/>
                    </div>
                    <div id='form'> 
                        <span>Analyzed Instructions: </span>
                        <div className='form-input' id='anInst0' >
                            <label className='input-label' for="analyzedInstructions">Step 1</label>
                            <input className='input-create' name="analyzedInstructions" type="text" value={input.analyzedInstructions} onChange={handleChange} className="anInstructions"/>
                            <input type="button" value="+" onClick={() => addInput()}/>
                            <input type="button" value="-" onClick={e => removeInput(this)} style={{display:"none"}}/>
                        </div>
                    </div>
                    <div className='form-input'>
                        <label className='input-label' for="image">Image</label>
                        <input name="image" type="file" onChange={handleImageChange}/>
                        <img src={input.image}/>
                    </div>
                    <div className='form-input'>
                        <div>Select one or more diets to assing to your recipe:</div>
                        
                        <div className='checkboxs-diets'>
                            {diets.map((diet, index) => {
                                return (
                                    <div>
                                        <input 
                                        className='cb'
                                        type="checkbox" 
                                        id={diet.id} 
                                        value={diet.name}
                                        /> 
                                        <label for={diet.id}>{diet.name.toUpperCase()}</label>
                                    </div>
                                )
                            })}
                        </div>

                    </div>
                        {!Object.keys(error).length ? <button className='submit-btn' type="submit">Create my recipe</button>: <button className='submit-btn' type="submit" disabled="true">Create my recipe</button>}
                </form>
            </div>
        </div>
    )
}