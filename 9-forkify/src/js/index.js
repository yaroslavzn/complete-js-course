import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import {elements, renderLoader, clearLoader} from "./views/base";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";

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
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        if (state.search) {
            searchView.highlightSelected(id);
        }

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
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        } catch (e) {
            alert(e);
        }
    }
};

['hashchange', 'load'].forEach(evt => window.addEventListener(evt, recipeController));

// List controller
const controlList = () => {
    // Create a new list if there in none yet
    if (!state.list) {
        state.list = new List();
    }

    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })
};

// Handle delete shop list item
elements.shoppingList.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id);
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value);

        state.list.updateCount(id, val);
    }
});

// Like controller

const controlLike = () => {
    if (!state.likes) {
        state.likes = new Likes();
    }
    const currentID = state.recipe.id;

    if (!state.likes.isLiked(currentID)) {
        const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img);

        likesView.toggleLikeButton(true);

        likesView.renderLike(newLike);
    } else {
        state.likes.deleteLike(currentID);

        likesView.toggleLikeButton(false);

        likesView.deleteLike(currentID);
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());
};


// Restore recipes when the page loads
window.addEventListener('load', () => {
    state.likes = new Likes();

    state.likes.readStorage();

    likesView.toggleLikeMenu(state.likes.getNumLikes());

    state.likes.likes.forEach(el => {
        likesView.renderLike(el);
    })
});

elements.recipe.addEventListener('click', e => {
   if (e.target.matches('.btn-decrease, .btn-decrease *')) {
       // Decrease button is clicked
       if (state.recipe.servings > 1) {
           state.recipe.updateServings('dec');
           recipeView.updateServingsIngredient(state.recipe);
       }
   } else if (e.target.matches('.btn-increase, .btn-increase *')) {
       state.recipe.updateServings('inc');
       recipeView.updateServingsIngredient(state.recipe);
   } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
       controlList();
   } else if (e.target.matches('.recipe__love, .recipe__love *')) {
       controlLike();
   }
});