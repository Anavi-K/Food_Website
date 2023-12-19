document.addEventListener('DOMContentLoaded', function () {
    // Get references to DOM elements
    const randomMealDiv = document.getElementById('rdm');
    const searchedMealsDiv = document.getElementById('sr');
    const searchTitle = document.getElementById('SearchedResults');
    const searchInput = document.getElementById('searchInput');
    const ingredientsModal = document.getElementById('ingredientsModal');

    // Define openIngredientsModal in the global scope
    window.openIngredientsModal = function (mealId) {
        // Display loading message in the modal
        ingredientsModal.innerHTML = '<p>Loading...</p>';
        ingredientsModal.style.display = 'block';

        // Fetch meal details based on mealId
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
            .then(response => response.json())
            .then(data => {
                // Extract meal data
                const meal = data.meals[0];

                // Populate modal with meal information
                ingredientsModal.innerHTML = `<div>
                    <h3>${meal.strMeal}</h3>
                    <ul>${getIngredientsList(meal)}</ul>
                    <button id="closeModalButton">Close</button>
                </div>`;

                // Attach click event handler for the close button
                const closeModalButton = document.getElementById('closeModalButton');
                closeModalButton.addEventListener('click', closeIngredientsModal);
            })
            .catch(error => {
                // Handle errors during the fetch
                console.error('Error fetching ingredients:', error);
                ingredientsModal.innerHTML = '<p>Error fetching ingredients. Please try again.</p>';
            });
    };

    // Function to close the ingredients modal
    function closeIngredientsModal() {
        ingredientsModal.style.display = 'none';
    }

    // Update the UI with searched meals
    function updateSearchedMeals(meals) {
        searchTitle.classList.remove('hidden');
        searchedMealsDiv.innerHTML = '';
        meals.forEach(meal => {
            const mealItem = document.createElement('div');
            mealItem.className = 'searched-meal';
            mealItem.innerHTML = `<img src="${meal.strMealThumb}" alt="${meal.strMeal}" onclick="openIngredientsModal('${meal.idMeal}')">
                <p>${meal.strMeal}</p>`;
            searchedMealsDiv.appendChild(mealItem);
        });
    }

    // Generate an ingredients list from meal data
    function getIngredientsList(meal) {
        let ingredientsList = '';
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient && ingredient.trim() !== '') {
                ingredientsList += `<li>${measure} ${ingredient}</li>`;
            }
        }
        return ingredientsList;
    }

    // Handle user input for meal search
    function handleSearchInput() {
        const searchTerm = searchInput.value.trim();

        // Display loading indicator
        searchedMealsDiv.innerHTML = '<p>Loading...</p>';

        // Fetch meals based on search term
        if (searchTerm !== '') {
            fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
                .then(response => response.json())
                .then(data => {
                    const meals = data.meals;
                    updateSearchedMeals(meals);
                })
                .catch(error => {
                    // Handle errors during the fetch
                    console.error('Error fetching searched meals:', error);
                    searchedMealsDiv.innerHTML = '<p>Error fetching meals. Please try again.</p>';
                });
        } else {
            // Clear the searched meal div if the search term is empty
            searchedMealsDiv.innerHTML = '';
            searchTitle.classList.add('hidden');
        }
    }

    // Event listeners for search input
    searchInput.addEventListener('change', handleSearchInput);

    searchInput.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSearchInput();
        }
    });

    // Fetch a random meal and display it in the UI
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];
            const randomMealItem = document.createElement('div');
            randomMealItem.className = 'random-meal-item';
            randomMealItem.innerHTML = `<img src="${meal.strMealThumb}" alt="${meal.strMeal}" onclick="openIngredientsModal('${meal.idMeal}')">
                <p>${meal.strMeal}</p>`;
            randomMealDiv.appendChild(randomMealItem);
        })
        .catch(error => console.error('Error fetching random meal:', error));
});
