document.addEventListener('DOMContentLoaded', function () {
    const randomMealDiv = document.getElementById('rdm');
    const searchedMealsDiv = document.getElementById('sr');
    const searchTitle = document.getElementById('SearchedResults');
    const searchInput = document.getElementById('searchInput');

    // Function to update the searched meal div with name and image
    function updateSearchedMeals(meals) {
        searchTitle.classList.remove('hidden');
        searchedMealsDiv.innerHTML = '';
        meals.forEach(meal => {
            searchedMealsDiv.innerHTML += `<div class="searched-meal">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <p>${meal.strMeal}</p>
            </div>`;
        });
    }

    // Function to handle search input
    function handleSearchInput() {
        const searchTerm = searchInput.value.trim();

        // Fetch meals based on search term
        if (searchTerm !== '') {
            fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
                .then(response => response.json())
                .then(data => {
                    const meals = data.meals;
                    updateSearchedMeals(meals);
                })
                .catch(error => console.error('Error fetching searched meals:', error));
        } else {
            // Clear the searched meal div if the search term is empty
            searchedMealsDiv.innerHTML = '';
            searchTitle.classList.add('hidden');
        }
    }

    // Add event listener for search input
    searchInput.addEventListener('input', handleSearchInput);

    // Add event listener for Enter key press
    searchInput.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default behavior (e.g., form submission)
            handleSearchInput(); // Manually trigger the search input handling
        }
    });

    // Fetch random meal after everything is set up
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];
            randomMealDiv.innerHTML = `<div class="random-meal-item">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <p>${meal.strMeal}</p>
            </div>`;
        })
        .catch(error => console.error('Error fetching random meal:', error));
});