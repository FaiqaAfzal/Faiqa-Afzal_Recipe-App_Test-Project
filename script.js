const searchBox = document.querySelector(".searchBox");
const searchBtn = document.querySelector(".searchBtn");
const recipeContainer = document.querySelector(".recipe-container");
const recipeDetailsContent = document.querySelector(".recipe-details-content");
const recipeCloseBtn = document.querySelector(".recipe-close-btn");
const API_KEY = 'df9e4510c9364b83999063369da7581a';

//...............FUNCTION TO GET RECIPES...............

const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = `
    <div>
        <img src="./Images/lets-cook-together-lettering-free-vector.jpg" alt="Fetching Recipes" class="fetching-recipes">
    </div>
    `;
    try {
        const data = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&apiKey=${API_KEY}`);
        const response = await data.json();

        recipeContainer.innerHTML = "";
        if (response.results.length === 0) {
            recipeContainer.innerHTML = `
            <div>
               <img src ="./Images/no-result-found-1200x675.jpg" alt="Error Image" class="error-image">
            </div>
            `;
            return;
        }
        //  --------------RECIPE-------------- 
        response.results.forEach(meal => {
            const recipeDiv = document.createElement("div");
            recipeDiv.classList.add("recipe");
            recipeDiv.innerHTML = `
                <img src="${meal.image}">
                <h3>${meal.title}</h3>
            `;
            // --------------RECIPE BUTTON-------------- 
            const button = document.createElement("button");
            button.textContent = "View Recipe";
            recipeDiv.appendChild(button);

            // -----ADDING EVENTLISTENER TO RECIPE BUTTON-----
            button.addEventListener("click", () => {
                openRecipePopup(meal.id);
            });

            recipeContainer.appendChild(recipeDiv);
        });
    } catch (error) {
        recipeContainer.innerHTML = "<h2>Error in Fetching Recipes...</h2>"; 
    }
}

// ...............FUNCTION TO FETCH INGREDIENTS AND RECIPE DETAILS...............

const openRecipePopup = async (id) => {
    try {
        const data = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`);
        const meal = await data.json();

        const ingredientsList = meal.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('');

        recipeDetailsContent.innerHTML = `
            <h2 class="recipeName">${meal.title}</h2>
            <h3>Ingredients:</h3>
            <ul class="ingredientList">${ingredientsList}</ul>
            <div class="recipeInstructions">
                <h3>Instructions:</h3>
                <p>${meal.instructions}</p>
            </div>
        `;

        recipeDetailsContent.parentElement.style.display = "block";
    } catch (error) {
        recipeDetailsContent.innerHTML = "<h2>Error in Fetching Recipe Details...</h2>";
        recipeDetailsContent.parentElement.style.display = "block";
    }
}

recipeCloseBtn.addEventListener("click", () => {
    recipeDetailsContent.parentElement.style.display = "none";
});

searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (!searchInput) {
        recipeContainer.innerHTML = ` 
        <div>
            <img src ="./Images/mealbox.png" alt="Error Image" class="error-msg">
        </div>
        `;
        return;
    }
    fetchRecipes(searchInput);
});