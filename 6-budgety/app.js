var budgetModel = (function() {

    // Some code

})();

var budgetView = (function () {

    // Some code
    var DOMstrings = {

    };

    return {
        getInputData: function() {

        },
    };

})();

var budgetController = (function (model, view) {

    var ctrlAddItem = function() {

        // 1. Get the field input data

        // 2. Add the item to the budget model.

        // 3. Add the item to the budget view.

        // 4. Calculate the budget.

        // 5. Display the budget on the UI
    };

    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(e) {

        if (e.keycode === 13 || e.which === 13) {
            ctrlAddItem();
        }
    });

})(budgetModel, budgetView);