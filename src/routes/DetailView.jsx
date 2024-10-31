import React, { Component, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Recipe from "../components/Recipe";

const DetailView = () => {
    const API_KEY = import.meta.env.VITE_APP_API_KEY;
    let params = useParams();
    let id = params.id;
    const [recipe, setRecipe] = useState({})
    useEffect(() => {
        const fetchRecipeInfo = async () => {
          const response = await fetch(
            `https://api.spoonacular.com/recipes/${id}/information?apiKey=` 
            + API_KEY
          );
          const json = await response.json();
          setRecipe(json);
        };
        fetchRecipeInfo().catch(console.error);
      }, [id])
  return (
    <div>
      <div className="Detail">
        <img 
            className = "icons"
            src={recipe.image}
            alt={`Image for the recipe titled ${recipe.title}`}
        />
        <div className="recipe-info-detail">
            <h2>{recipe.title}</h2>
            <strong>Diets:</strong> <span>{recipe.diets?.join(", ") || "No specific diets"}</span> <br />
            <strong>Cooking time:</strong> <span>{recipe.readyInMinutes} min</span> | 
            <strong> Price per serving:</strong> <span>${recipe.pricePerServing}</span> <br />
            <strong>From: </strong> <span>{recipe.sourceName}</span> | 
            <strong> Health Score: </strong> <span>{recipe.healthScore}</span> <br />
            <strong>Cuisines: </strong> <span> {recipe.cuisines?.join(", ") || "Unspecified"} </span>
            <strong>Occasions: </strong> <span> {recipe.occasions?.join(", ") || "Unspecified"} </span>
            <p>
            <strong>Ingredients:</strong> {recipe.extendedIngredients ? recipe.extendedIngredients.map(ingredient => ingredient.name).join(', ') : "Unknown"}
            </p>
            <a href={recipe.sourceUrl}>Read more from the original source</a>
        </div>
      </div>
        <div className="recipe-info-detail">
          <p>
          <h3>Recipe:</h3> {recipe.extendedIngredients ? <ul>
          {recipe.extendedIngredients.map((ingredient, index) => (
            <li key={index}>{ingredient.original}</li>
          ))}
        </ul> : "Unknown"}
        </p>
        <h3>Summary:</h3>
      <div dangerouslySetInnerHTML={{ __html: recipe.summary }} />
        </div>
    </div>
  );
};

export default DetailView;