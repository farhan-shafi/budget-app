class BudgetApp {
  constructor() {
    this.totalBudget = 0;
    this.remainingBudget = 0;
    this.spentBudget = 0;
    this.remainingBudgetElement = document.querySelector(
      ".remaining-budget-value"
    );
    this.spentBudgetElement = document.querySelector(".spent-budget-value");
    this.budgetInput = document.querySelector(".budget-input");
    this.budgetInputButton = document.querySelector(".add-budget");
    this.totalBudgetElement = document.querySelector(".total-budget-value");

    this.expenseDate = document.querySelector("#expense-date");
    this.addExpenseBtn = document.querySelector(".add-expense");
    this.expenseAmount = document.querySelector("#expense-amount");
    this.expenseCategory = document.querySelector("#expense-category");
    this.expenseDescription = document.querySelector("#expense-description");
    this.newExpenseCategory = document.querySelector("#new-expense-category");
    this.addCategoryBtn = document.querySelector(".add-expense-category-btn");
    this.expensesListElement = document.querySelector(".budget-expenses-list");
    this.expenseCategories = [
      {
        label: "Select",
        value: "",
      },
      {
        label: "Grocery",
        value: "grocery",
      },
      {
        label: "Food",
        value: "food",
      },
    ];
    this.expensesList = [];
    this.init();
  }
  init() {
    this.attachEventHandler();
    this.addInitialCategories();
  }
  addInitialCategories() {
    this.expenseCategories.forEach((category) => {
      this.addExpenseCategory(category);
    });
  }
  addExpenseListItem({ date, amount, category, description }) {
    let listItem = document.createElement("li");
    listItem.classList.add("expense-list-item");

    const listItemDataElements = [
      {
        tag: "select",
        value: category,
        type: "",
        className: "expense-list-item-category",
      },
      {
        tag: "input",
        value: date,
        type: "text",
        className: "expense-list-item-date",
      },
      {
        tag: "input",
        value: amount,
        type: "number",
        className: "expense-list-item-amount",
      },
      {
        tag: "input",
        value: description,
        type: "text",
        className: "expense-list-item-description",
      },
    ];

    listItemDataElements.forEach((item) => {
      let itemElem = document.createElement(item.tag);
      itemElem.classList.add(item.className);

      if (item.tag !== "select") {
        itemElem.setAttribute("type", item.type);
        itemElem.readOnly = true;

        itemElem.value = item.value;
      } else {
        this.expenseCategories.forEach((category) => {
          const option = this.createOption(category);
          itemElem.value = this.convertToKababCase(item.value);

          itemElem.appendChild(option);
        });
      }
      listItem.appendChild(itemElem);
    });

    let divElement = document.createElement("div");
    let editBtn = document.createElement("button");
    editBtn.classList.add("btn", "edit-btn");
    editBtn.innerHTML = "Edit";

    let deleteBtn = document.createElement("button");
    deleteBtn.classList.add("btn", "delete-btn");
    deleteBtn.innerHTML = "Delete";

    divElement.appendChild(editBtn);
    divElement.appendChild(deleteBtn);

    listItem.appendChild(divElement);

    editBtn.addEventListener("click", () => {
      this.editExpense(listItem, editBtn);
    });
    deleteBtn.addEventListener("click", () => {
      this.deleteExpense(listItem, deleteBtn);
    });

    this.expensesListElement.appendChild(listItem);
  }
  editExpense(listItem, btn) {
    let listItemExpenseInputs = listItem.querySelectorAll("input");
    if (!listItem.classList.contains("editing")) {
      listItem.classList.add("editing");
      btn.innerHTML = "Update";
      listItemExpenseInputs.forEach((input) => {
        input.readOnly = false;
        if (input.classList.contains("expense-list-item-amount")) {
          this.updateRemainingBudget(Number(input.value), "+");
          this.updateSpentBudget(Number(input.value), "-");
        }
      });
    } else {
      listItemExpenseInputs.forEach((input) => {
        if (input.classList.contains("expense-list-item-amount")) {
          let updatedAmount = Number(input.value);
          if (this.remainingBudget >= updatedAmount && updatedAmount > 0) {
            this.updateRemainingBudget(updatedAmount);
            this.updateSpentBudget(updatedAmount);
            input.readOnly = true;
            btn.innerHTML = "Edit";
            listItem.classList.remove("editing");
          } else if (updatedAmount < 0) {
            alert(`Sorry! You can't enter a negative value`);
          } else {
            alert(
              `Sorry! You have only ${this.remainingBudget} amount available`
            );
          }
        }
      });
    }
  }
  deleteExpense(listItem) {
    let listItemExpenseInputs = listItem.querySelectorAll("input");
    listItemExpenseInputs.forEach((input) => {
      if (input.classList.contains("expense-list-item-amount")) {
        this.updateRemainingBudget(Number(input.value), "+");
        this.updateSpentBudget(Number(input.value), "-");
      }
    });
    listItem.remove();
  }

  createOption(category) {
    const option = document.createElement("option");
    option.innerHTML = category.label;
    option.value = category.value;
    return option;
  }
  addExpenseCategory(category) {
    const option = this.createOption(category);
    this.expenseCategory.appendChild(option);
  }
  addBudget() {
    if (this.budgetInput.value === "") {
      alert("Please enter your amount");
    } else if (Number(this.budgetInput.value) < 0) {
      alert(`Sorry! You can't enter a negative value`);
    } else {
      this.totalBudget = this.totalBudget + Number(this.budgetInput.value);
      this.totalBudgetElement.innerHTML = this.totalBudget;
      this.remainingBudget = this.totalBudget;
      this.budgetInput.value = "";
      this.updateRemainingBudget();
    }
  }
  updateRemainingBudget(amount = 0, operator = "-") {
    if (operator === "-") {
      this.remainingBudget = this.remainingBudget - amount;
    } else if (operator === "+") {
      this.remainingBudget = this.remainingBudget + amount;
    }
    this.remainingBudgetElement.innerHTML = this.remainingBudget;
  }
  updateSpentBudget(amount, operator = "+") {
    if (operator === "-") {
      this.spentBudget = this.spentBudget - amount;
    } else if (operator === "+") {
      this.spentBudget = this.spentBudget + amount;
    }
    this.spentBudgetElement.innerHTML = this.spentBudget;
  }
  addExpense() {
    const date = this.expenseDate.value;
    const amount = Number(this.expenseAmount.value);
    const category = this.expenseCategory.value;
    const description = this.expenseDescription.value;
    if (date && amount && category && description) {
      if (this.remainingBudget >= amount && amount > 0) {
        this.addExpenseListItem({
          date,
          amount,
          category: this.convertToPascalCase(category),
          description,
        });
        this.updateRemainingBudget(amount);
        this.updateSpentBudget(amount);

        this.expenseDate.value = "";
        this.expenseAmount.value = "";
        this.expenseCategory.value = "";
        this.expenseDescription.value = "";
      } else if (amount < 0) {
        alert(`Sorry! You can't enter a negative value`);
      } else {
        alert(`Sorry! You have only ${this.remainingBudget} amount available`);
      }
    } else {
      alert("Make sure you have fill all fields.");
    }
  }
  convertToKababCase(string) {
    var words = string.toLowerCase().split(" ");
    var kababCase = words.join("-");
    return kababCase;
  }
  convertToPascalCase(string) {
    var words = string.split(" ");
    var pascalCase = words
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");

    return pascalCase;
  }

  attachEventHandler() {
    // For Budget
    this.budgetInputButton.addEventListener("click", () => {
      this.addBudget();
    });
    this.budgetInput.addEventListener("keydown", (event) => {
      if (event.keyCode === 13) {
        this.addBudget();
      }
    });

    // For Expense
    this.addExpenseBtn.addEventListener("click", () => {
      this.addExpense();
    });

    //For New Category
    this.addCategoryBtn.addEventListener("click", () => {
      const newCategoryValue = this.newExpenseCategory.value;
      if (newCategoryValue !== "") {
        const expenseItemCategories = document.querySelectorAll(
          ".expense-list-item .expense-list-item-category"
        );
        const value = this.convertToKababCase(newCategoryValue);
        const label = this.convertToPascalCase(newCategoryValue);

        const newCategoryObject = {
          value,
          label,
        };

        expenseItemCategories.forEach((item) => {
          item.appendChild(this.createOption(newCategoryObject));
        });

        this.addExpenseCategory(newCategoryObject);
        this.expenseCategories.push(newCategoryObject);
        this.newExpenseCategory.value = "";
      }
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  new BudgetApp();
});
