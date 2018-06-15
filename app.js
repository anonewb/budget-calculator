// BUDGET CONTROLLER
var budgetController = (function() {

  var x = 23;
  var add = function(a) {
    return x + a;
  }

  return {
    publicAdd: function(b) {
      return add(b);
    }
  }

})(); // IIFE


// UI CONTROLLER
var UIController = (function() {

  // UI code

})();


// APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) { 

  var ctrlAddItem = function() {

    // Get the field input data
    // Add item to the budgetCtrl
    // Add item to the UI
    // Calculate the budget
    // Display the budget on the UI
    console.log('added');

  }

  document.querySelector('.add__btn').addEventListener('click',ctrlAddItem);

  document.addEventListener('keypress', function(e) {

    if (e.keyCode === 13 || e.which === 13) {
      ctrlAddItem();
    }

  })

  return {
    
  }

})(budgetController, UIController);