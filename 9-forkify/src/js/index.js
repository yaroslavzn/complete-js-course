import Search from "./models/Search";
import Recipe from "./models/Recipe";
import {elements, renderLoader, clearLoader} from "./views/base";
import * as searchView from "./views/searchView";

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 **/
const state = {};

const controlSearch = async () => {
    // 1. Get query from view
    const query = searchView.getInput();

    if (query) {
        // 2. New search object and add to state
        state.search = new Search(query);

        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearSearchList();
        renderLoader(elements.searchRes);

        try {
            // 4. Search for recipes
            await state.search.getResults();

            // 5. Render result on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (e) {
            console.log(e);
        }

    }
};

elements.searchForm.addEventListener('submit', e => {
   e.preventDefault();

   controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const button = e.target.closest('.btn-inline');

    if (button) {
        const goTo = parseInt(button.dataset.goto, 10);

        searchView.clearSearchList();
        searchView.renderResults(state.search.result, goTo);
    }
});

// Recipe controller
// const r = new Recipe(47746);
const recipeController = async () => {
    const id = window.location.hash.replace('#', '');

    if (id) {
        // Prepare UI for changes

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            console.log(state.recipe);
        } catch (e) {
            alert(e);
        }
    }
};

['hashchange', 'load'].forEach(evt => window.addEventListener(evt, recipeController));