import { React } from 'react'
import { Link } from 'react-router-dom'
import './recipe.css'

export default function Recipe(params) {
    let { name, image, diets, id } = params.recipe
    if (name.length > 20) {
        name = name.slice(0, 20) + "..."
    }
    return (
        
            <div className="card-container">
                <div className="card">
                <Link to={`/recipe/${id}`} className="link">
                    <div className="img-container">
                        <img src={image} className="img"/>
                    </div>
                    <div className="data-container">
                        <h1 className="title">{name}</h1>
                        <p className="diets">{
                            diets?.map((diet, index) => {
                                if(index + 1 === diets.length) return diet.charAt(0).toUpperCase() + diet.slice(1);
                                return diet.charAt(0).toUpperCase() + diet.slice(1) + " - ";
                            })
                        }</p>
                    </div>
                    </Link>
                </div>
                
            </div>
        

    )
}