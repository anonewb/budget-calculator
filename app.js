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
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  }

})(); // IIFE


// UI CONTROLLER
var UIController = (function() {

  var DOMSelectors = {
    inputType: '.add__type',
    inputDesc: '.add__description',
    inputValue: '.add__value',
    inputBtn:'.add__btn'
  }

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMSelectors.inputType).value, // inc or exp
        description: document.querySelector(DOMSelectors.inputDesc).value, 
        value: document.querySelector(DOMSelectors.inputValue).value
      };
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

    // Get the field input data
    var input = UICtrl.getInput();
    // console.log(input);

    // Add item to the budgetCtrl
    // Add item to the UI
    // Calculate the budget
    // Display the budget on the UI

  } 

  // public methods: can be accessed by outside modules
  return {
    init: function() {
      LoadEventListeners();
    }
  }

})(budgetController, UIController); // Can now access public methods present in budgetCtrl and UICtrl

// Initializing our App
controller.init();