document.addEventListener('DOMContentLoaded', function () {
    // Fetch random meal
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(response => response.json())
        .then(data => {
            const randomMealDiv = document.getElementById('randomDish');
            // Update the content of the random meal div with name and image
            const meal = data.meals[0];
            randomMealDiv.innerHTML = `<p>${meal.strMeal}</p><img src="${meal.strMealThumb}" alt="${meal.strMeal}">`;
        })
        .catch(error => console.error('Error fetching random meal:', error));

    const searchedMealsDiv = document.getElementById('searchedMeals');
    const searchTitle = document.getElementById('searchTitle');

    // Function to update the searched meal div with name and image
    function updateSearchedMeals(meals) {
        searchTitle.classList.remove('hidden');
        searchedMealsDiv.innerHTML = '';
        meals.forEach(meal => {
            searchedMealsDiv.innerHTML += `<div class="searched-meal">
                <p>${meal.strMeal}</p>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            </div>`;
        });
    }

    // Function to handle search input
    function handleSearchInput() {
        const searchInput = document.getElementById('searchbox');
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
    const searchInput = document.getElementById('searchbox');
    searchInput.addEventListener('input', handleSearchInput);
});
