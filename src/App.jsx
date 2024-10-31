import { useState, useEffect } from 'react'
import './App.css'
import Recipe from "./components/Recipe"
import NavBar from "./components/NavBar"

function App() {
  const API_KEY = import.meta.env.VITE_APP_API_KEY;
  const [list, setList] = useState(null);
  const [dietData, setDietData] = useState([]);
  const [checkedDiets, setCheckedDiets] = useState({
    vegan: false,
    vegetarian: false,
    glutenFree: false,
  });
  const [stats, setStats] = useState({
    count: 0,
    meanIngredients: 0,
    ingredientMode: "",
    meanCookingTime: 0,
    priceRange: [0, 0],
    priceMean: 0,
  });
  const [filteredStats, setFilteredStats] = useState({
    count: 0,
    meanIngredients: 0,
    ingredientMode: "",
    meanCookingTime: 0,
    priceRange: [0, 0],
    priceMean: 0,
  });
  const [maxPrice, setMaxPrice] = useState(600);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState(false);
  useEffect(() => {
    if (!list) {
    const fetchAllRecipes = async () => {
      const response = await fetch(
        "https://api.spoonacular.com/recipes/complexSearch?&number=7&addRecipeInformation=true&fillIngredients=true&sort=popularity&apiKey=" 
        + API_KEY
      );
      const json = await response.json();
      setList(json);
      setFilteredResults(json.results);
      initializeStats(json.results);
    };
    fetchAllRecipes().catch(console.error);
  }
  }, [list]);
  const calculateStats = (recipes) =>{
    const count = recipes.length;
    const allIngredients = [];
    const allCookingTimes = [];
    const allPrices = [];
    recipes.forEach((recipe) => {
      if (recipe.extendedIngredients) {
        allIngredients.push(...recipe.extendedIngredients.map(i => i.name));
      }
      if (recipe.readyInMinutes) {
        allCookingTimes.push(recipe.readyInMinutes);
      }
      if (recipe.pricePerServing) {
        allPrices.push(recipe.pricePerServing);
      }
    });
    const meanIngredients = (allIngredients.length / count).toFixed(2);
    const meanCookingTime = calculateMean(allCookingTimes).toFixed(2);
    const priceRange = calculatePriceRange(allPrices);
    const priceMean = calculateMean(allPrices).toFixed(2);
    const ingredientMode = findMode(allIngredients);
    return {
      count, meanIngredients, ingredientMode, meanCookingTime,
      priceRange,
      priceMean,
    };
  };
  const initializeStats = (recipes) => {
    const newStats = calculateStats(recipes);
    setStats(newStats);
    setMaxPrice(newStats.priceRange[1]);
    setFilteredStats(newStats);
    setDietData(calculateDietStats(recipes));
  }
  const calculateMean = (arr) => arr.length > 0 ?arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  const calculatePriceRange = (arr) => arr.length > 0 ? [Math.round(Math.min(...arr) * 100) / 100, Math.round(Math.max(...arr) * 100) / 100] : [0,0];
  const findMode = (arr) =>{
    const frequencies = {};
    arr.forEach(item => {
      if (frequencies[item])
        {frequencies[item] +=1;}
      else {frequencies[item] = 1;}
    });
    const maxFrequency = Math.max(...Object.values(frequencies))
    let mode = null;
    for (const [key, value] of Object.entries(frequencies)) {
      if (value === maxFrequency) {
        mode = key;
        break;
      }
    }
    return mode;
  };
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckedDiets((prevDiets) => ({
      ...prevDiets,
      [name]: checked,
    }));
    setFilters(true);
  };
  const calculateDietStats = (recipes) => {
    const dietCounts = {
      vegan: 0,
      vegetarian: 0,
      glutenFree: 0,
      dairyFree: 0,
      sustainable: 0,
    };
    
    recipes.forEach(recipe => {
      if (recipe.vegan) {
        dietCounts.vegan++;
      }
      if (recipe.vegetarian) {
        dietCounts.vegetarian++;
      }
      if (recipe.glutenFree) {
        dietCounts.glutenFree++;
      }
      if (recipe.dairyFree) {
        dietCounts.dairyFree++;
      }
      if (recipe.sustainable) {
        dietCounts.sustainable++;
      }
    });
    const dietData = [
      { diet: "Vegan", count: dietCounts.vegan },
      { diet: "Vegetarian", count: dietCounts.vegetarian },
      { diet: "Gluten-Free", count: dietCounts.glutenFree },
      { diet: "Dairy-Free", count: dietCounts.dairyFree },
      { diet: "Ketogenic", count: dietCounts.ketogenic },
    ];
    return dietData;
  };
  useEffect(() => {
    if (list && list.results){
      const filteredData = list.results.filter((recipe) => {
        let checksDiet = true;
        for (const [dietName, isChecked] of Object.entries(checkedDiets)) {
          if (isChecked && !recipe[dietName]) {
            checksDiet = false;
            break
          }
        }
        if (searchInput === ""){
          return (recipe.pricePerServing <= maxPrice && checksDiet)
        }
        else {
          const input = searchInput.toLowerCase();
          let recipeIngredients = ""
          if (recipe.extendedIngredients)
            {recipeIngredients = recipe.extendedIngredients.map(ingredient => ingredient.name.toLowerCase()).join(', ')}
          let recipeDiets = ""
          if (recipe.diets)
            {recipeDiets = recipe.diets.join(', ')}
          return (
            recipe.pricePerServing <= maxPrice && checksDiet &&
            (recipe.title.toLowerCase().includes(input) 
            || recipeIngredients.includes(input) 
            || recipe.readyInMinutes.toString().includes(input) 
            || recipe.pricePerServing.toString().includes(input))
            || recipeDiets.includes(input)
            )
            }
      })
      setFilteredResults(filteredData);
      setFilteredStats(calculateStats(filteredData));
      setDietData(calculateDietStats(filteredData));
    }
    }, [checkedDiets, maxPrice, searchInput, list]);
  return (
    <div className="whole-page">
    <NavBar count={filteredStats.count || 0}
            mean={filteredStats.meanIngredients || 0}
            mode={filteredStats.ingredientMode || "N/A"}
            time={filteredStats.meanCookingTime || 0}
            priceRange={`$${filteredStats.priceRange[0] || 0} - $${filteredStats.priceRange[1] || 0}`}
            priceMean={filteredStats.priceMean || 0}
            data={filteredResults}
            dietData={dietData}
    />
    <div className='Main'>
      <h1>Discover New Recipes</h1>
      <div className = "Filters">
        <input
        type="text"
        placeholder="Search by keywords"
        onChange={(e) => setSearchInput(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            name="vegan"
            checked={checkedDiets.vegan}
            onChange={handleCheckboxChange}
          />
          Vegan
        </label>
        <label>
          <input
            type="checkbox"
            name="vegetarian"
            checked={checkedDiets.vegetarian}
            onChange={handleCheckboxChange}
          />
          Vegetarian
        </label>
        <label>
          <input
            type="checkbox"
            name="glutenFree"
            checked={checkedDiets.glutenFree}
            onChange={handleCheckboxChange}
          />
          Gluten-free
        </label>
        <label><strong>Maximum Price:</strong> ${maxPrice}</label>
        <input 
          type="range" 
          min={Math.round(stats.priceRange[0] * 100) / 100} 
          max={Math.round(stats.priceRange[1] * 100) / 100} 
          step="0.01" 
          value={maxPrice.toFixed(2)} 
          onChange={(e) => {setMaxPrice(Math.round(Number(e.target.value) * 100) / 100); setFilters(true)}}
        />
      </div>
        {searchInput.length > 0 || filters
          ? filteredResults.map((recipe) => (
            <Recipe
            key={recipe.id}
            image={recipe.image}
            title={recipe.title}
            id={recipe.id}
            url={recipe.sourceUrl}
            ingredients={recipe.extendedIngredients}
            diets={recipe.diets}
            time={recipe.readyInMinutes}
            price={recipe.pricePerServing}
          />
          ))
          : list && list.results && list.results
          .map((recipe) => (
            <Recipe
            key={recipe.id}
            image={recipe.image}
            title={recipe.title}
            url={recipe.sourceUrl}
            id={recipe.id}
            ingredients={recipe.extendedIngredients}
            diets={recipe.diets}
            time={recipe.readyInMinutes}
            price={recipe.pricePerServing}
          />
          ))
        }
      </div>
</div>
  )
}

export default App
