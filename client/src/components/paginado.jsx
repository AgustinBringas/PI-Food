import React from "react";
import './paginado.css'

export default function Paginado({recipesPerPage, allRecipes, paginado}) {
    const pageNumbers = []

    for (let i = 1; i <= Math.ceil(allRecipes/recipesPerPage); i++) {
        pageNumbers.push(i)
    }

    return (
            <div className='paginado-container'>
                <ul className="paginado">
                    { pageNumbers?.map(number => (
                        <li className="number">
                            <span onClick={() =>paginado(number)}>{number}</span>
                        </li>

                    )) }
                </ul>

            </div>
    )
}