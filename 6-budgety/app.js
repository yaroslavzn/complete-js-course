var budgetModel = (function() {

    // Some code
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        total: {
            exp: 0,
            inc: 0,
        }
    };

})();

function Income(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
}

var budgetView = (function () {

    // Some code
    var DOMstrings = {
        itemType: '.add__type',
        itemDescription: '.add__description',
        itemValue: '.add__value',
        itemAdd: '.add__btn',
    };

    return {
        getInputData: function() {
            return {
                type: document.querySelector(DOMstrings.itemType).value,
                description: document.querySelector(DOMstrings.itemDescription).value,
                value: document.querySelector(DOMstrings.itemValue).value,
            }
        },
        getDOMstrings: function() {
            return DOMstrings;
        },
    };

})();

var budgetController = (function (model, view) {



    var setupEventListeners = function() {
        var DOM = view.getDOMstrings();

        document.querySelector(DOM.itemAdd).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(e) {

            if (e.keycode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });
    };

    var ctrlAddItem = function() {

        // 1. Get the field input data
        var inputData = view.getInputData();

        // 2. Add the item to the budget model.

        // 3. Add the item to the budget view.

        // 4. Calculate the budget.

        // 5. Display the budget on the UI
    };

    return {
        init: function() {
            setupEventListeners();

            console.log('Application has started.');
        }
    };

})(budgetModel, budgetView);

budgetController.init();