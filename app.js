// budget controller
var budgetController = (function(){

  var x = 23;
  var add = function(a){
    return x + a;
  }

  return {
    publicAdd: function(b){
      return add(b);
    }
  }

})(); // IIFE


// UI controller
var UIController = (function(){

  // UI code

})();


// App controller
var controller = (function(budgetCtrl, UICtrl){ //* Used slightly different names 'budgetCtrl' coz if we have to change the controller name of 'budgetController' to something else, then we dont need to replace its name inside this App controller as 'budgetCtrl' is being used

  var z = budgetCtrl.publicAdd(5);

  return {
    anotherPublic: function(){
      console.log(z);
    }
  }

})(budgetController, UIController);