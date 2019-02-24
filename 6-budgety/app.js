var budgetModel = (function() {

    // Some code
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calculatePercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = (this.value / totalIncome) * 100;
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
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
        deleteItem: function(type, id) {
            var ids, index;

            ids = data.allItems[type].map(function(item) {
                return item.id;
            });

            index = ids.indexOf(id);

            data.allItems[type].splice(index, 1);
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
        calculatePercentages: function() {
            data.allItems.exp.forEach(function(item) {
                item.calculatePercentage(data.total.inc);
            });
        },
        getPercentages: function() {
            return data.allItems.exp.map(function(item) {
               return item.getPercentage();
            });
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
        itemsContainer: '.container',
        expPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month',
    };

    var formatNumber = function(num, type) {
        var int, dec;

        num = num.toFixed(2);
        splitNum = num.split('.');

        int = splitNum[0];
        dec = splitNum[1];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
        }

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
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
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

                itemContainer = DOMstrings.incomesContainer;
            } else if (type === 'exp') {
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

                itemContainer = DOMstrings.expensesContainer;
            }

            newHtml = html.replace('%id%', item.id);
            newHtml = newHtml.replace('%description%', item.description);
            newHtml = newHtml.replace('%value%', formatNumber(item.value, type));

            document.querySelector(itemContainer).insertAdjacentHTML('beforeend', newHtml);
        },
        deleteUiItem: function(id) {
            var elem = document.getElementById(id);

            elem.parentNode.removeChild(elem);
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
            var type;

            type = obj.budget > 0 ? 'inc' : 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.inc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.exp, 'exp');

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },
        displayPercentages: function(percentages) {
            var percLabels = document.querySelectorAll(DOMstrings.expPercLabel);

            percLabels.forEach(function(item, idx) {

                if (percentages[idx] > 0) {
                    item.textContent = Math.floor(percentages[idx]) + '%';
                } else {
                    item.textContent = '---';
                }
            });
        },
        displayDate: function() {
            var now, month, months, year;

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            now = new Date();

            month = now.getMonth();
            year = now.getFullYear();

            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },
        changeType: function() {
            var items = document.querySelectorAll(DOMstrings.itemType + ',' + DOMstrings.itemDescription + ',' + DOMstrings.itemValue);

            items.forEach(function(item) {
                item.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.itemAdd).classList.toggle('red');
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

        document.querySelector(DOM.itemsContainer).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.itemType).addEventListener('change', view.changeType);
    };

    var updateBudget = function() {
        // 1. Calculate the budget.
        model.calculateBudget();

        // 2. Return the budget
        var budget = model.getBudget();

        // 3. Display the budget on the UI
        view.displayBudget(budget);
    };

    var updatePercentages = function() {
        // 1. Calculate percentages
        model.calculatePercentages();

        // 2. Return percentages
        var percentages = model.getPercentages();

        // 3. Display percentages on the UI
        view.displayPercentages(percentages);
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

            // 6. Update percentages
            updatePercentages();
        }

    };

    var ctrlDeleteItem = function(e) {
        var itemID, splitId, type, id;

        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitId = itemID.split('-');
            type = splitId[0];
            id = parseInt(splitId[1]);

            // 1. Remove item from the data structure
            model.deleteItem(type, id);

            // 2. Remove item from the UI
            view.deleteUiItem(itemID);

            // 3. Update budget
            updateBudget();

            // 4. Update percentages
            updatePercentages();
        }
    };

    return {
        init: function() {
            setupEventListeners();

            view.displayDate();

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