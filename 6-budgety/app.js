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
        },
        budget: 0,
        percentage: -1,
    };

    var calculateTotal = function(type) {
        var sum = 0;

        data.allItems[type].forEach(function(item) {
            sum += item.value;
        });

        data.total[type] = sum;
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
        calculateBudget: function() {
            // Calculate total incomes
            calculateTotal('inc');

            // Calculate total expenses
            calculateTotal('exp');

            // Calculate budget
            data.budget = data.total.inc - data.total.exp;

            // Calculate percentage
            if (data.total.inc > 0) {
                data.percentage = Math.floor((data.total.exp / data.total.inc) * 100);
            }
        },
        getBudget: function() {
            return {
                budget: data.budget,
                inc: data.total.inc,
                exp: data.total.exp,
                percentage: data.percentage,
            };
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
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
    };

    return {
        getInputData: function() {
            return {
                type: document.querySelector(DOMstrings.itemType).value,
                description: document.querySelector(DOMstrings.itemDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.itemValue).value),
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
        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.inc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.exp;

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
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

    var updateBudget = function() {
        // 1. Calculate the budget.
        model.calculateBudget();

        // 2. Return the budget
        var budget = model.getBudget();

        // 3. Display the budget on the UI
        view.displayBudget(budget);
    };

    var ctrlAddItem = function() {
        var inputData, newItem;

        // 1. Get the field input data
        inputData = view.getInputData();

        if (inputData.description !== '' && !isNaN(inputData.value) && inputData.value > 0) {
            // 2. Add the item to the budget model.
            newItem = model.addItem(inputData.type, inputData.description, inputData.value);

            // 3. Add the item to the budget view.
            view.addUiItem(inputData.type, newItem);

            // 4. Clear fields
            view.clearFields();

            // 5. Update the budget
            updateBudget();
        }

    };

    return {
        init: function() {
            setupEventListeners();

            view.displayBudget(
                {
                    budget: 0,
                    inc: 0,
                    exp: 0,
                    percentage: -1,
                }
            );

            console.log('Application has started.');
        }
    };

})(budgetModel, budgetView);

budgetController.init();