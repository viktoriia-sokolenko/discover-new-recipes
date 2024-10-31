import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const API_KEY = import.meta.env.VITE_APP_API_KEY;



const Recipe = ({id, image, title, diets, time, price, ingredients, url}) => {
    return (
        <div>
            <li className="recipe-list" key={id}>
                <img 
                    className = "icons"
                    src={image}
                    alt={`Image for the recipe titled ${title}`}
                />
                <div className="recipe-info">
                    <Link to={`/recipeDetails/${id}`} key={id}>
                        <h3>{title}</h3>
                    </Link>
                    <strong>Diets:</strong> <span>{diets?.join(", ") || "No specific diets"}</span> <br />
                    <strong>Cooking time:</strong> <span>{time} min</span> | 
                    <strong> Price per serving:</strong> <span>${price}</span>
                    <p>
                    <strong>Ingredients:</strong> {ingredients ? ingredients.map(ingredient => ingredient.name).join(', ') : "Unknown"}
                    </p>
                    <a href={url}>Read more</a>
                </div>
            </li>
        </div>
      );
};
export default Recipe;