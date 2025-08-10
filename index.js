// Budget Tracker

// Creating a class called BudgetTracker, this allows the constructor to update accordingly since it is binding events.
class BudgetTracker {
  constructor() {
    this.transactions = this.loadTransactions();
    this.form = document.getElementById("transactionForm");
    this.transactionList = document.getElementById("transactionList");
    this.balanceElement = document.getElementById("balance");
    this.totalIncomeElement = document.getElementById("totalIncome");
    this.totalExpenseElement = document.getElementById("totalExpense");

    // Allows the EventListeners to initalize and update the balance summary.
    this.initEventListeners();
    this.renderTransactions();
    this.updateBalance();
  }

  // This allows for our transactions from local storage to remain even when refreshing, an empty array will return if none exist.
  loadTransactions() {
    return JSON.parse(localStorage.getItem("transactions")) || [];
  }

  saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(this.transactions));
  }

  // Initialize event listeners for form submission, and will prevent the page from reloading.
  initEventListeners() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.addTransaction();
    });
  }

  // Allows new transaction to be added along with the description, amount, and type of transaction (income or expense).
  addTransaction() {
    const description = document.getElementById("description").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;

    // The if statement checks for a valid description and valid amount.
    if (!description || isNaN(amount)) {
      alert("Provide a valid description and amount.");
      return;
    }

    const transaction = {
      id: Date.now(),
      description,
      amount: type === "expense" ? -amount : amount,
      type,
    };

    // This actually adds in the new transaction to the transactions array, saves it to the local storage, updates the balance.
    this.transactions.push(transaction);
    this.saveTransactions();
    this.renderTransactions();
    this.updateBalance();
    this.clearForm();
  }

  // Clears the input fields in the form after submission.
  clearForm() {
    document.getElementById("description").value = "";
    document.getElementById("amount").value = "";
  }

  // Allows for transactions to be sorted in descending order.
  renderTransactions() {
    this.transactionList.innerHTML = "";
    this.transactions
      .slice()
      .sort((a, b) => b.id - a.id)
      .forEach((transaction) => {
        const transactionDiv = document.createElement("div");
        transactionDiv.classList.add("transaction", transaction.type);
        transactionDiv.innerHTML = `
                    <span>${transaction.description}</span>
                    <span class="transaction-amount-container">
                    $${Math.abs(transaction.amount).toFixed(2)}
                    <button class="delete-btn" data-id='${
                      transaction.id
                    }'>Delete</button>
                    </span>
                `;

        this.transactionList.appendChild(transactionDiv);
      });

    this.attachDeleteEventListeners();
  }

  // Attach event listeners to all delete buttons in the transactions.
  attachDeleteEventListeners() {
    this.transactionList.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", () => {
        this.deleteTransaction(Number(button.dataset.id));
      });
    });
  }

  // Allows you to delete a transaction by its ID.
  deleteTransaction(id) {
    this.transactions = this.transactions.filter(
      (transaction) => transaction.id !== id
    );

    this.saveTransactions();
    this.renderTransactions();
    this.updateBalance();
  }

  // Displays the income, expenses, and overall balance in the UI.
  updateBalance() {
    let totalIncome = 0;
    let totalExpense = 0;
    let balance = 0;

    this.transactions.forEach((transaction) => {
      if (transaction.amount > 0) {
        totalIncome += transaction.amount;
      } else {
        totalExpense += Math.abs(transaction.amount);
      }
    });

    //  Balance is calculated by taking the totalIncome - totalExpense.
    balance = totalIncome - totalExpense;

    // Balance is rounded to 2 decimal places and will change colors based on whether it’s positive or negative.
    this.totalIncomeElement.textContent = `Income: $${totalIncome.toFixed(2)}`;
    this.totalExpenseElement.textContent = `Expenses: $${totalExpense.toFixed(
      2
    )}`;
    this.balanceElement.textContent = `Balance: $${balance.toFixed(2)}`;
    this.balanceElement.style.color = balance >= 0 ? "#76f3aaff" : "#ff8275ff";
  }
}

// Initializing the BudgetTracker when the page is loaded.
document.addEventListener("DOMContentLoaded", () => {
  const budgetTracker = new BudgetTracker();
});
