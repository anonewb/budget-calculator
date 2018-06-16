// BUDGET CONTROLLER
var budgetController = (function() {

  //* CONSTRUCTORS
  // we need to create expense object to store properties of the item(expense) like id, desc, value
  // we created the constructor of 'Expense' obj as we want to create lots of objects(expense lists)  
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }
  // now we can instantiate a new obj easily

  //* DATA STRUCTURE
  // Creating a neat data structure to store items and value
  var data = { // data means Data Structure
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1  
  }

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(current) {
      sum += current.value;
    });
    data.totals[type] = sum;
  };

    //*** When we want to 'return' multiple values, insert all the values inside '{}' ie object
  return {
    addItem: function(type, desc, val) {
      var newItem, ID, typeID;
      ID=0;

      // [1 2 3 4 5], next ID = 6
      // [1 2 4 6 9], next ID = 10
      // ID = last ID + 1
      // ID = data.allItems[type][data.allItems[type].length - 1].id + 1
      typeID = data.allItems[type]
      

      if (typeID.length > 0) {
        ID = typeID[data.allItems[type].length - 1].id + 1
      } else {
        ID = 0;
      }

      if (type === 'exp') {
        newItem = new Expense(ID, desc, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, desc, val);
      }

      data.allItems[type].push(newItem);

      return newItem;
    },
    calculateBudget: function() {
      
      // cal total income and expense
      calculateTotal('inc');
      calculateTotal('exp');

      // cal the budget: income - expense
      data.budget = data.totals.inc - data.totals.exp;

      if (data.totals.inc > 0) {
        // cal the % if income that we spent
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
      
    },
    getBudget: function() {

      //*** When we want to 'return' multiple values, insert all the values inside '{}' ie object
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      }
    },
    dataLog: function() { // Created just to view the private Data Structure
      console.log(data); // Run 'budgetController.dataLog()' in console to view DS(data obj)
    }
  }

})(); // IIFE




// UI CONTROLLER
var UIController = (function() {

  var DOMSelectors = {
    inputType: '.add__type',
    inputDesc: '.add__description',
    inputValue: '.add__value',
    inputBtn:'.add__btn',
    incomeContainerList: '.income__list',
    expensesContainerList: '.expenses__list'
  }

  //*** When we want to 'return' multiple values, insert all the values inside '{}' ie object
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMSelectors.inputType).value, // inc or exp
        description: document.querySelector(DOMSelectors.inputDesc).value, 
        value: parseFloat(document.querySelector(DOMSelectors.inputValue).value)
      };
    },
    addListItem: function(obj, type) {
      var html, element;

      // create HTML template of inc/exp listItem to be added
      if (type === 'inc') {
        element = DOMSelectors.incomeContainerList;
        html = `
          <div class="item clearfix" id="income-${obj.id}">
            <div class="item__description">${obj.description}</div>
            <div class="right clearfix">
                <div class="item__value">+ ${obj.value}</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
          </div>
        `;
      } else if (type === 'exp') {
        element = DOMSelectors.expensesContainerList;
        html = `
          <div class="item clearfix" id="expense-${obj.id}">
            <div class="item__description">${obj.description}</div>
            <div class="right clearfix">
                <div class="item__value">- ${obj.value}</div>
                <div class="item__percentage">21%</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
          </div>
        `;
      }

      // insert HTML into DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', html);

      //** .insertAdjacentHTML()----> element.insertAdjacentHTML(position, text);
      // <p>tag is the element and position can be: 
      // <!-- beforebegin -->
      // <p>
      //   <!-- afterbegin -->
      //   foo
      //   <!-- beforeend -->  <----- we used this to add at end of ul but before ul closes
      // </p>
      // <!-- afterend -->

    },
    clearFields: function() {
      var fields = document.querySelectorAll(DOMSelectors.inputDesc + ', ' + DOMSelectors.inputValue);

      // converting nodeList to Array
      var fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function(currentField) {
        currentField.value = "";
      });
      fieldsArr[0].focus();
    },
    getDOMSelectors: function() {
      return DOMSelectors;
    }
  }

})(); // IIFE




// APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) { //* Used slightly different names 'budgetCtrl' coz if we have to change the controller name of 'budgetController' to something else, then we dont need to replace its name inside this App controller as 'budgetCtrl' is being used

  // private methods: cannot be accessed by outside modules to avoid data override

  var LoadEventListeners = function() {

    var DOMSelectors = UICtrl.getDOMSelectors();

    document.querySelector(DOMSelectors.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAddItem();
      }
    });

  }

  var ctrlAddItem = function() {

    // 1. Get the field input data
    var input = UICtrl.getInput();
    // console.log(input);

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      
      // 2. Add item to the budgetCtrl
      var newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. Add item to the UI
      UICtrl.addListItem(newItem, input.type);

      // 4. clear the fields
      UICtrl.clearFields();

      // 5. calculate and update budget
      updateBudget();
      
    }

  } 

  var updateBudget = function() {

    // 1. Calculate the budget
    budgetCtrl.calculateBudget();

    // 2. return the budget
    var budget = budgetCtrl.getBudget();

    // 3. Display the budget on the UI
    console.log(budget);

  }

  // public methods: can be accessed by outside modules
  //*** When we want to 'return' multiple values, insert all the values inside '{}' ie object
  return { 
    init: function() {
      LoadEventListeners();
    }
  }

})(budgetController, UIController); // Can now access public methods present in budgetCtrl and UICtrl

// Initializing our App
controller.init();