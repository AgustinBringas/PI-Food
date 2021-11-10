import { React } from 'react'
import { Link } from 'react-router-dom'
import './recipe.css'
import Trophy from '../icons/trophy.jsx'

export default function Recipe(params) {
    let { name, image, id, healthScore } = params.recipe
    let dietIcons = params.icons
    if (name.length > 16) {
        name = name.slice(0, 16) + "..."
    }
    return (
        
            <div className="card-container">
                <div className="card">
                <Link to={`/recipe/${id}`} className="link">
                    <div className="img-container">
                        <img src={image} className="img" alt="Not found"/>
                    </div>
                    <div className="data-container">
                        <h1 className="title">{name.toUpperCase()}</h1>
                        {dietIcons ? 
                        <div className="diets-score-container">
                        <p className="diets">{
                            dietIcons.length > 4 ? 
                            dietIcons.map(Icon => {
                                return <Icon width={38} height={38} fill={"#dd5d26"} className='diet-icon'/>
                            })
                            : 
                            dietIcons.map(Icon => {
                                return <Icon width={54} height={54} fill={"#dd5d26"} className='diet-icon'/>
                            })
                        }
                        </p>
                        <div className='spoon-score'>
                        <Trophy width={35} height={35} className='trophy'/>
                        <p className='spoon-score-text'>
                            {
                                healthScore
                            }
                        </p>
                        </div>

                    </div>
                    : null}
                        
                    </div>
                    </Link>
                </div>
                
            </div>
        

    )
}