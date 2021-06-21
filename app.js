var Budget = (function () {
  //BUDGET CONTROLLER

  var Expense = function (id, description, value) {
    this.id = id;
    this.value = value;
    this.description = description;
    this.percentage = -1;
  };

  var Income = function (id, description, value) {
    this.id = id;
    this.value = value;
    this.description = description;
  };

  //storing all these objects in an array

  var calculateTotal = function (type) {
    var sum = 0;
    data.items[type].forEach(function (currentEl) {
      sum += currentEl.value;
    });

    data.total[type] = sum;
  };

  var data = {
    items: {
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

  return {
    additem: function (type, des, val) {
      var newItem, id;
      var id = 0; //unique number to be assigned to any exp or inc item

      //creation of unique id
      if (data.items[type].length > 0) {
        id = data.items[type][data.items[type].length - 1].id + 1;
      } else {
        id = 0;
      }

      if (type === "exp") {
        newItem = new Expense(id, des, val);
      } else if (type === "inc") {
        newItem = new Income(id, des, val);
      }
      //pushing in data structure
      data.items[type].push(newItem);

      //return the new element
      return newItem;
    },

    deleteItem: function (type, id) {
      var ids, index;

      //map is also a function similar to for each, however the differrence is that map returns a brand new array!
      //like foreach, Map also takes a callback function
      var ids = data.items[type].map(function (current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        //splice is used to remove an elements from the array.
        //it takes 2 parameters 1)position number at which we want to start deleling 2)number of elements to delete.
        data.items[type].splice(index, 1);
      }
    },

    //calculate budget fucntion
    calculateBgt: function () {
      //calculate total inc and exp
      calculateTotal("exp");
      calculateTotal("inc");

      //calculate the total
      data.budget = data.total.inc - data.total.exp;

      //calculating the percentage
      if (data.total.inc > 0) {
        data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    //making a function just for returning data
    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.total.inc,
        totalExp: data.total.exp,
        percentage: data.percentage,
      };
    },

    //for testing purposes
    testing: function () {
      console.log(data);
    },
  };
})();

//....................................................BUDGET UPDATE................................................................//

var BudgetUpdate = function () {
  //calculating everything
  Budget.calculateBgt();

  //returing it after calculating
  var budget = Budget.getBudget();

  // console.log(budget);
  InterFaceController.displayBudget(budget);
};

//interface controller, Idpendendent modules as i am using IFFY Here. Use this to get data when usen interacts with ui

//.................................................interface................................................................................................//

var InterFaceController = (function () {
  //defining a object which holds all the class names
  var DOMstrings = {
    inputType: ".add__type",
    discType: ".add__description",
    valueType: ".add__value",
    inputBtn: ".add__btn",
    incContainer: ".income__list",
    expContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    percentageLabel2: ".budget__income--percentage",
    monthLable: ".budget__title--month",
    parentContainer: ".container",
  };

  //method

  return {
    userInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value, //income or expense
        disc: document.querySelector(DOMstrings.discType).value, //description of inc or exp

        value: parseFloat(document.querySelector(DOMstrings.valueType).value), //value of inc or exp
      };
    },

    //adding items and using the object passed and values in arrays

    AddItems: function (obj, type) {
      var html, newHtml, element;
      // Create HTML string with placeholder text

      if (type === "inc") {
        element = DOMstrings.incContainer;

        html =
          '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><img src="./logo/cross-small-green.png" class="icon-cross-green" alt="remove-exp"></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expContainer;

        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><img src="./logo/cross-small-red.png" class="icon-cross-red" alt="remove-exp"></button></div></div></div>';
      }

      newHTML = html.replace("%id%", obj.id);
      newHTML = newHTML.replace("%description%", obj.description);
      newHTML = newHTML.replace("%value%", obj.value);

      //inserting data into the dom, using adjasentHTML method
      document.querySelector(element).insertAdjacentHTML("beforeend", newHTML);
    },

    deleteListItems: function (selectorID) {
      //we can only delete the child in js not the parent
      var childEl = document.getElementById(selectorID);
      childEl.parentNode.removeChild(childEl);
    },

    //updating month and year

    //clearing the fields after entering the data
    clearFields: function () {
      var fields, fieldArray;

      //queryselector doesnt return an array but something similar to it WHICH IS CALLED LIST, You can convery the list
      //to an array using something called Slice. its returns a list as an array! the syntax is differrent though.

      var fields = document.querySelectorAll(
        DOMstrings.discType +
          ", " +
          DOMstrings.inputType +
          "," +
          DOMstrings.valueType
      );

      var fieldArray = Array.prototype.slice.call(fields);

      //for each method insted of for loop!
      fieldArray.forEach(function (current, index, array) {
        //1) value of the array 2)index number or id of array 3)entire array

        current.value = "";
      });
      //focus method to get back tp the 1st field after adding the values
      fieldArray[0].focus();
    },

    displayBudget: function (obj) {
      document.querySelector(DOMstrings.budgetLabel).textContent =
        obj.budget + "₹";

      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expenseLabel).textContent =
        obj.totalExp;

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + "%";
        document.querySelector(DOMstrings.percentageLabel2).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "--";
        document.querySelector(DOMstrings.percentageLabel2).textContent = "+";
      }
    },

    getMonth: function () {
      var year, today, month, monthArray;
      today = new Date();
      year = today.getFullYear();
      month = today.getMonth();

      monthArray = [
        "January",
        "Fabuary",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "NovemBer",
        "December",
      ];

      document.querySelector(DOMstrings.monthLable).textContent =
        monthArray[month] + "" + year;
    },

    getDOMstrings: function () {
      return DOMstrings; //exposing the DOMSTRING Object to public
    },
  };
})();

//.................................................................Controller.........................................................................

var Controller = (function (BgtCntrl, InterFaceCntrl) {
  //GLOBAL CONTROLLER, BASICALLY WHAT HAPPENS WHEN YOU CLICK THE BUTTON, ITS ALL HERE

  var AllEventListeners = function () {
    var DOMfromUI = InterFaceController.getDOMstrings();

    document
      .querySelector(DOMfromUI.inputBtn)
      .addEventListener("click", CtrlAddItem); //call back so no arguments () here
    //this event listener is for when the button was clicked!, The tick one.

    //adding a key press event listener in Global controller since the event takes place in the global web page
    //unlike the other events which are targatted towards a perticular element!
    //you can console log 'event' and then see what number of key was pressed

    document.addEventListener("keypress", function (event) {
      if (event.key === 13 || event.which === 13) {
        CtrlAddItem();
      }
    });

    document
      .querySelector(DOMfromUI.parentContainer)
      .addEventListener("click", ctrlDeleteItem);
  };

  var CtrlAddItem = function () {
    var input, newItem;

    //1.) field input data
    var input = InterFaceController.userInput();
    console.log(input);

    if (input.disc !== "" && !isNaN(input.value) && input.value > 0) {
      //2) adding item to the budget controller
      var newItem = BgtCntrl.additem(input.type, input.disc, input.value);

      //3)add item to the UI

      InterFaceCntrl.AddItems(newItem, input.type);

      //4)clearing fields after entering the data
      InterFaceCntrl.clearFields();

      //updating the budget function

      BudgetUpdate();
    }
  };

  var ctrlDeleteItem = function (event) {
    var itemID, splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; //id will br returned after this
    //parent node is used to move up from the selected element in DOM Structure!
    //using parent node here 4 times means that after clicking the button it will target the filed itself not the button
    //since the field is a Parent initself

    if (itemID) {
      //there is a method called split, to which every string has access! the split method splits the mentioned thing.
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);
    }

    //deleting the item from array using map method
    Budget.deleteItem(type, ID);

    //deleting item from the interface
    InterFaceController.deleteListItems(itemID);

    //updating and displaying the new budget
    BudgetUpdate();
  };

  return {
    //init function is called evry time a program is executed in the beginning
    init: function () {
      console.log("application started.");
      // updating the date
      InterFaceController.getMonth();
      InterFaceController.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
<<<<<<< HEAD
=======
      
>>>>>>> f1f31d1 (initial)
      });
      AllEventListeners();

      //displaying the result on UI
    
    },
  };
})(Budget, InterFaceController);

Controller.init();
