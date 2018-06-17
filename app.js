// BUDGET CONTROLLER
var budgetController = (function() {

  //* CONSTRUCTORS
  // we need to create expense object to store properties of the item(expense) like id, desc, value
  // we created the constructor of 'Expense' obj as we want to create lots of objects(expense lists)  
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  }

  //*** We create methods inside constructor on the prototype object so that
        //  all the newly created/instance objects from the constructor can inherit this methods easily through prototype chain
  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome>0) {
      this.percentage = Math.round((this.value/totalIncome)*100);
    } else {
      this.percentage = -1;
    }
  }

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

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
  };

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
    deleteItem: function(type, id) {
      var ids, index;
      
      // id = 6
      //data.allItems[type][id];
      // ids = [1 2 4  8]
      //index = 3
      
      // diff betw map and forEach is map() returns with new Array, while forEach() doesnt return

      console.log(data);

      ids = data.allItems[type].map(function(current) {
          return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
          data.allItems[type].splice(index, 1);
      }
      
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
    calculatePercentages: function() {  
      data.allItems.exp.forEach(function(cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },
    getPercentages: function() {
      var allPerc = data.allItems.exp.map(function(cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },
    getBudget: function() {

      //*** When we want to 'return' multiple values, insert all the values inside '{}' ie object
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      }
    },
    dataLog: function() { // Created just to view the private Data Structure
      console.log(data); // Run 'budgetController.dataLog()' in console to view DS(data obj)
    }
  }

})(); // IIFE




// UI CONTROLLER
var UIController = (function() {

  // if class name changes in HTML, then we have to update that name inside here only
  var DOMSelectors = {
    inputType: '.add__type',
    inputDesc: '.add__description',
    inputValue: '.add__value',
    inputBtn:'.add__btn',
    incomeContainerList: '.income__list',
    expensesContainerList: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expPerLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  }

  var formatNumber = function(num, type) {
    var numSplit, int, dec, type;
    /*
        + or - before number
        exactly 2 decimal points
        comma separating the thousands

        2310.4567 -> + 2,310.46
        2000 -> + 2,000.00
        */

    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');

    int = numSplit[0];
    if (int.length > 3) {
        int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
    }

    dec = numSplit[1];

    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

  };

  var nodeListForEach = function(list, callback) {
    for(var i=0; i<list.length; i++) {
      callback(list[i], i);
    }
  };

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
          <div class="item clearfix" id="inc-${obj.id}">
            <div class="item__description">${obj.description}</div>
            <div class="right clearfix">
                <div class="item__value">${formatNumber(obj.value, type)}</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="far fa-check-circle"></i></button>
                </div>
            </div>
          </div>
        `;
      } else if (type === 'exp') {
        element = DOMSelectors.expensesContainerList;
        html = `
          <div class="item clearfix" id="exp-${obj.id}">
            <div class="item__description">${obj.description}</div>
            <div class="right clearfix">
                <div class="item__value">${formatNumber(obj.value, type)}</div>
                <div class="item__percentage">21%</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="far fa-check-circle"></i></button>
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
    deleteListItem: function(selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el); // we cant remove any element directly
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
    displayBudget: function(obj) {
      var type;
      obj.budget > 0 ? type = 'inc' : type = 'exp';

      document.querySelector(DOMSelectors.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMSelectors.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMSelectors.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
      
      if (obj.percentage > 0) {
        document.querySelector(DOMSelectors.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMSelectors.percentageLabel).textContent = '-';
      }
    },
    displayPercentages: function(percentages) {
      var fields = document.querySelectorAll(DOMSelectors.expPerLabel);

      nodeListForEach(fields, function(current, index) {
        if (percentages[index]>0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '-';
        } 
      });
    },
    displayMonth: function() {
      var now = new Date();
      // var christmas = new Date(2018, 11, 25);
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      var month = now.getMonth();
      var year = now.getFullYear();
      document.querySelector(DOMSelectors.dateLabel).textContent = months[month] + ', ' + year;
    },
    changeType: function() {
      var fields = document.querySelectorAll(
        DOMSelectors.inputType + ',' +
        DOMSelectors.inputDesc + ',' +
        DOMSelectors.inputValue
      );
      nodeListForEach(fields, function(cur) {
        cur.classList.toggle('red-focus');
      });
      document.querySelector(DOMSelectors.inputBtn).classList.toggle('red');
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

    document.querySelector(DOMSelectors.container).addEventListener('click', ctrlDeleteItem);

    document.querySelector(DOMSelectors.inputType).addEventListener('change', UICtrl.changeType);

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

      // 5. cal and update budget
      updateBudget();

      // 6. cal and update %
      updatePercentages();
      
    }

  } 

  var updateBudget = function() {

    // 1. Calculate the budget
    budgetCtrl.calculateBudget();

    // 2. return the budget
    var budget = budgetCtrl.getBudget();

    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);

  }

  var updatePercentages = function() {

    // 1. Calculate %
    budgetCtrl.calculatePercentages();

    // 2. Read % from budgetCtrl
    var percentages = budgetCtrl.getPercentages();

    // 3. Display the UI with new %
    // console.log(percentages);
    UICtrl.displayPercentages(percentages);

  }

  var ctrlDeleteItem = function(e) {
    var itemID, splitID, type, ID;

    itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // 1. del item from DS
      budgetCtrl.deleteItem(type, ID);
      // 2. del item from UI
      UICtrl.deleteListItem(itemID);
      // 3. update and show the new budget
      updateBudget();
      // 4. cal and update %
      updatePercentages();
    }
  }

  // public methods: can be accessed by outside modules
  //*** When we want to 'return' multiple values, insert all the values inside '{}' ie object
  return { 
    init: function() {
      UICtrl.displayMonth();
      // Displaying begining values of budget on the UI
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      LoadEventListeners();
    }
  }

})(budgetController, UIController); // Can now access public methods present in budgetCtrl and UICtrl

// Initializing our App
controller.init();