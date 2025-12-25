
let incomeTotal = 0;
let expenseTotal = 0;
let budget = 0;
let expenses = [];

window.onload = function () {
    expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    incomeTotal = Number(localStorage.getItem("income")) || 0;
    budget = Number(localStorage.getItem("budget")) || 0;

    document.getElementById("incomeTotal").innerText = incomeTotal;
    expenses.forEach(e => renderExpense(e));
    updateUI();
};

// Income
function addIncome() {
    let val = Number(document.getElementById("income").value);
    incomeTotal += val;
    localStorage.setItem("income", incomeTotal);
    updateUI();
}

// Budget
function setBudget() {
    budget = Number(document.getElementById("budget").value);
    localStorage.setItem("budget", budget);
    updateUI();
}

// Add Expense
function addExpense() {
    let exp = {
        date: document.getElementById("date").value,
        title: document.getElementById("title").value,
        category: document.getElementById("category").value,
        amount: Number(document.getElementById("amount").value)
    };

    expenses.push(exp);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderExpense(exp);
    updateUI();
}

// Render Expense
function renderExpense(exp) {
    let li = document.createElement("li");
    li.innerHTML = `
        ${exp.date} - ${exp.title} - ₹${exp.amount}
        <span>
            <button class="edit" onclick="editExpense('${exp.title}')">E</button>
            <button class="delete" onclick="deleteExpense('${exp.title}')">X</button>
        </span>
    `;
    document.getElementById("list").appendChild(li);
}

// Delete
function deleteExpense(title) {
    expenses = expenses.filter(e => e.title !== title);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    reloadList();
}

// Edit
function editExpense(title) {
    let exp = expenses.find(e => e.title === title);
    document.getElementById("title").value = exp.title;
    document.getElementById("amount").value = exp.amount;
    deleteExpense(title);
}

// Search
function searchExpense() {
    let key = document.getElementById("search").value.toLowerCase();
    document.getElementById("list").innerHTML = "";
    expenses.filter(e => e.title.toLowerCase().includes(key))
            .forEach(e => renderExpense(e));
}

// UI update
function updateUI() {
    expenseTotal = expenses.reduce((s, e) => s + e.amount, 0);
    document.getElementById("expenseTotal").innerText = expenseTotal;
    document.getElementById("balance").innerText = incomeTotal - expenseTotal;

    let today = new Date().toISOString().slice(0,10);
    let todayTotal = expenses
        .filter(e => e.date === today)
        .reduce((s, e) => s + e.amount, 0);

    document.getElementById("todayTotal").innerText = todayTotal;

    let msg = document.getElementById("budgetMsg");
    if (budget && expenseTotal > budget) {
        msg.innerText = "⚠ Budget Exceeded";
    } else {
        msg.innerText = "Within Budget";
    }
}

// Reload
function reloadList() {
    document.getElementById("list").innerHTML = "";
    expenses.forEach(e => renderExpense(e));
    updateUI();
}

// Clear
function clearAll() {
    localStorage.clear();
    location.reload();
}

// Dark Mode
function toggleMode() {
    document.body.classList.toggle("dark");
}
