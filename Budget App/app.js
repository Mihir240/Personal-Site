//IIFE  for budget controller
var budgetController = (function () {
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercent = function (totalIncome) {
    // Calculating the percent for change for each object in data structure

    if (totalIncome > 0 && this.value < totalIncome) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercent = function () {
    return this.percentage;
  };

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Income.prototype.calcIncPercent = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Income.prototype.getPercent = function () {
    return this.percentage;
  };

  var calculateTotal = function (type) {
    var sum = 0;

    data.allItems[type].forEach(function (current) {
      sum += current.value;
    });

    data.totals[type] = sum;
  };

  // An object to store all expenses and incomes with the use of arrays
  var data = {
    allItems: {
      inc: [],
      exp: [],
    },

    totals: {
      exp: 0,
      inc: 0,
    },

    budget: 0,
    percentage: -1,
  };

  return {
    addItem: function (type, des, val) {
      var newItem, ID;

      /*The data object wil have an allItems object with inc and exp property arrays that are filled 
              Expense and Income function constructors */
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      /*The type will either be the inc or exp array and the next bracket beside the first brackets will 
             have index position with the Expense or Income function constructors so the directly to the object 
             and then we can access properties accordingly*/

      //create the new item based on the type. either
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }

      //push into our data object data structure
      data.allItems[type].push(newItem);

      //Return the new element
      return newItem;
    },

    deleteItem: function (type, id) {
      var index, ids;
      // create an array with all the id numbers that we have

      //.map returns a brand new array, the current array has all the objects but then the new array will have the respective ids to that array
      ids = data.allItems[type].map(function (current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        // first  argument of splic is the index to start deleting items and the second argument is the number of items to be deleted
        data.allItems[type].splice(index, 1);
      }
    },

    calculatePercent: function () {
      //For the expenses
      data.allItems.exp.forEach(function (current) {
        current.calcPercent(data.totals.inc);
      });

      //For the income
      data.allItems.inc.forEach(function (current) {
        current.calcIncPercent(data.totals.inc);
      });
    },

    getPercentage: function () {
      var arrPerc = data.allItems.exp.map(function (current) {
        //will return an new array of the elements with respective percents
        return current.getPercent();
      });

      return arrPerc;
    },

    getIncPercentage: function () {
      var arrIncPerc = data.allItems.inc.map(function (current) {
        //will return an new array of the elements with respective percents
        return current.getPercent();
      });

      return arrIncPerc;
    },

    calculateBudget: function () {
      // calculate total income and expenses
      calculateTotal("exp");
      calculateTotal("inc");
      //calculate the budget. Which will be income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      //calculate the percentage of income that we spent
      if (data.totals.inc > 0 && data.totals.exp < data.totals.inc) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    getBudget: function () {
      return {
        budget: data.budget,
        percentage: data.percentage,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
      };
    },
  };
})();

//IIFE for UI Controller
var UIController = (function () {
  //private object for public getInput method in UI controller
  var domStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentLabel: ".budget__expenses--percentage",
    container: ".container",
    expPercent: ".item__percentage",
    incPercent: ".item__percentInc",
    dateLabel: ".budget-title-month",
  };

  formatNumber = function (num, type) {
    var numSplit, int, dec, sign;

    num = Math.abs(num);

    //number is fixed to 2 decimal places
    num = num.toFixed(2);

    //splits the string into 2 parts at the decimal point and return an array
    numSplit = num.split(".");
    // First index of array includes the integer portion of the string before the decimal point
    int = numSplit[0];
    if (int.length > 3) {
      // Instead of doing this we can also use toLocaleString() method
      for (var i = int.length - 4; i >= 0; i -= 3) {
        int = int.substr(0, i + 1) + "," + int.substr(i + 1, int.length);
      }
    }
    //Second part of array includes the integer portion of the string after the decimal point

    dec = numSplit[1];

    return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
  };

  //Will return an object
  return {
    //function inside of first function will return an object with 3 properties
    //public method anyone can access
    getInput: function () {
      return {
        //value will either be a inc or exp
        type: document.querySelector(domStrings.inputType).value,
        description: document.querySelector(domStrings.inputDescription).value,
        value: parseFloat(document.querySelector(domStrings.inputValue).value),
      };
    },

    addListItem: function (obj, type) {
      var html, newHtml, element;

      // Create Html String with placeholder text
      if (type === "inc") {
        element = domStrings.incomeContainer;
        // using these strings to add div elements to each block below
        html = `<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div>
                <div class="right clearfix"><div class="item__value">%value%</div> <div class="item__percentInc">21%</div>
                <div class="item__delete"><button class="item__delete--btn">
                <i class="ion-ios-close-outline"></i></button></div></div></div>`;
      } else if (type === "exp") {
        element = domStrings.expensesContainer;
        html = `<div class="item clearfix" id="exp-%id%">
                <div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div>
                <div class="item__percentage">21%</div> <div class="item__delete">
                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div></div></div>`;
      }

      //Replace the placeholder text with actual values
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));
      newHtml = newHtml.replace("%description%", obj.description);

      //Insert the html into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    displayBudget: function (obj) {
      var type;

      obj.budget > 0 ? (type = "inc") : (type = "exp");

      document.querySelector(domStrings.budgetLabel).textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(domStrings.incomeLabel).textContent = formatNumber(
        obj.totalInc,
        "inc"
      );
      document.querySelector(
        domStrings.expenseLabel
      ).textContent = formatNumber(obj.totalExp, "exp");

      if (obj.percentage > 0) {
        document.querySelector(domStrings.percentLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(domStrings.percentLabel).textContent = "N/A";
      }
    },

    displayPercentages: function (arrPerc, type) {
      var theDom;

      type === "exp"
        ? (theDom = domStrings.expPercent)
        : (theDom = domStrings.incPercent);

      //This will return a nodelist
      var fields = document.querySelectorAll(theDom);

      fields.forEach(function (current, index) {
        if (arrPerc[index] > 0) {
          current.textContent = arrPerc[index] + "%";
        } else {
          current.textContent = "N/A";
        }
      });
    },

    displayMonth: function () {
      var date = new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "long",
      }).format();

      //document.querySelector(domStrings.dateLabel).textContent = date;

      //getElementsByClassName returns a nodelist, so we need to select the respective element
      document.getElementsByClassName(
        "budget-title-month"
      )[0].textContent = date;
    },

    deleteListItem: function (theSelectorId) {
      var el = document.getElementById(theSelectorId);
      //first need to go to parent and then only can we remove the child
      //need to do this because we can't remove current node directly
      el.parentNode.removeChild(el);
    },

    clearFields: function () {
      var fields;
      //The querySelctorAll will be separated by the comma
      //The querySelectorAll returns a list
      fields = document.querySelectorAll(
        domStrings.inputValue + ", " + domStrings.inputDescription
      );

      //callback function within the forEach
      fields.forEach(function (current, index, array) {
        current.value = "";
      });

      fields[0].focus();
    },

    Ctype: function () {
      // querySelectorAll returns a NodeList
      var fields = document.querySelectorAll(
        domStrings.inputType +
          "," +
          domStrings.inputDescription +
          "," +
          domStrings.inputValue
      );

      fields.forEach(function (current, index, array) {
        current.classList.toggle("red-focus");
      });

      // It is used to toggle the classes between the css classes
      document.querySelector(domStrings.inputBtn).classList.toggle("red");
    },

    getDOMStrings: function () {
      return domStrings;
    },
  };
})();

//IIFE for App Controller
var appController = (function (budgetCtrl, UICtrl) {
  var input, newItem;

  //Application starts from this function
  var initEventList = function () {
    //Retrieving the dom strings object
    var DOM = UICtrl.getDOMStrings();

    //ctrlAddItem is a callback function
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    //When user clicks the enter key
    //addEventlistener always access to the 'event' object and we can call it whatever we want
    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    // Using Event Delegation to delete item from eithr expenses or income
    document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);

    document.querySelector(DOM.inputType).addEventListener("change", UICtrl.Ctype);
  };

  function ctrlAddItem() {
    //1. Get the user input
    input = UICtrl.getInput();
    //2. If the input fields are either empty
    if (isEmpty()) {
      return;
    }
    //3. Add the item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    //4. Add the new item to the user interface
    UICtrl.addListItem(newItem, input.type);

    //5. Clear the fields
    UICtrl.clearFields();

    //6. Calculate and update budget
    updateBudget();

    //7. Update percent
    updatePercent();
  }

  // need event object because we want to know what the target element is
  function ctrlDeleteItem(event) {
    var itemId, splitId, type, ID;
    //target returns an html element in the DOM
    //Using the parentNode will help traverse up the
    itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemId) {
      //will split at the specfied element and put other elements into an array
      splitId = itemId.split("-");
      type = splitId[0];
      ID = parseInt(splitId[1]);

      //Item gets deleted from the data structure
      budgetCtrl.deleteItem(type, ID);

      //Delete the item from the UI
      UICtrl.deleteListItem(itemId);

      //Update the budget
      updateBudget();

      //Update the percent
      updatePercent();
    }
  }

  function isEmpty() {
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      return false;
    }
    return true;
  }

  function updatePercent() {
    //1. Calculate percentages
    var check = budgetCtrl.calculatePercent();

    //2. Read the percentages from the budget controller
    var currPercents = budgetCtrl.getPercentage();

    var currIncPerc = budgetCtrl.getIncPercentage();

    //3.Display the user interface
    //console.log(currPercents);
    UICtrl.displayPercentages(currPercents, "exp");
    UICtrl.displayPercentages(currIncPerc, "inc");
  }

  function updateBudget() {
    //1. Calculate the budget
    budgetCtrl.calculateBudget();

    //2. retrieveing the budget
    var budget = budgetCtrl.getBudget();

    //3. Display the budget on the user Interface
    UICtrl.displayBudget(budget);
  }

  return {
    //public function
    init: function () {
      console.log("Application has started!");

      UICtrl.displayMonth();

      initEventList();
    },
  };
})(budgetController, UIController); // Will be returned immediately but need to call the returned object manually

(function refresh() {
  window.addEventListener("beforeunload", function (event) {
    event.returnValue = "";
  });
})();

// THE APP STARTS HERE!!!
appController.init();
