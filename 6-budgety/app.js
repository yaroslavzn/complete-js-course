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

    return {
        addItem: function(type, desc, value) {
            var newItem, id;

            if (data.allItems[type].length > 0) {
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                id = 0;
            }

            if (type === 'exp') {
                newItem = new Expense(id, desc, value);
            } else if (type === 'inc') {
                newItem = new Income(id, desc, value);
            }

            data.allItems[type].push(newItem);

            return newItem;
        },
        testing: function() {
            return data;
        },
    };

})();

var budgetView = (function () {

    // Some code
    var DOMstrings = {
        itemType: '.add__type',
        itemDescription: '.add__description',
        itemValue: '.add__value',
        itemAdd: '.add__btn',
        incomesContainer: '.income__list',
        expensesContainer: '.expenses__list',
    };

    return {
        getInputData: function() {
            return {
                type: document.querySelector(DOMstrings.itemType).value,
                description: document.querySelector(DOMstrings.itemDescription).value,
                value: document.querySelector(DOMstrings.itemValue).value,
            }
        },
        addUiItem: function(type, item) {
            var html, newHtml, itemContainer;

            if (type === 'inc') {
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

                itemContainer = DOMstrings.incomesContainer;
            } else if (type === 'exp') {
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

                itemContainer = DOMstrings.expensesContainer;
            }

            newHtml = html.replace('%id%', item.id);
            newHtml = newHtml.replace('%description%', item.description);
            newHtml = newHtml.replace('%value%', item.value);

            document.querySelector(itemContainer).insertAdjacentHTML('beforeend', newHtml);
        },
        clearFields: function() {
            var fields;

            fields = document.querySelectorAll(DOMstrings.itemDescription + ', ' + DOMstrings.itemValue);

            fields.forEach(function(field) {
                field.value = '';
            });

            fields[0].focus();
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
        var inputData, newItem;

        // 1. Get the field input data
        inputData = view.getInputData();

        // 2. Add the item to the budget model.
        newItem = model.addItem(inputData.type, inputData.description, inputData.value);

        // 3. Add the item to the budget view.
        view.addUiItem(inputData.type, newItem);

        // 4. Clear fields
        view.clearFields();

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