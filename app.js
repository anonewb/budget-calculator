// BUDGET CONTROLLER
var budgetController = (function() {

  

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

})();


// APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) { 

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

  return {
    init: function() {
      LoadEventListeners();
    }
  }

})(budgetController, UIController);

controller.init();