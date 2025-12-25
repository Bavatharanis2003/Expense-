let incomeTotal = 0;
let expenseTotal = 0;
let summary = { Food: 0, Travel: 0, Other: 0 };

window.onload = function () {
    let income = localStorage.getItem("income") || 0;
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    incomeTotal = Number(income);
    document.getElementById("incomeTotal").innerText = incomeTotal;

    expenses.forEach(exp => createExpense(exp, false));
    updateBalance();
};

function addIncome() {
    let income = document.getElementById("income").value;
    if (income === "") return alert("Enter income");

    incomeTotal += Number(income);
    localStorage.setItem("income", incomeTotal);
    document.getElementById("incomeTotal").innerText = incomeTotal;
    document.getElementById("income").value = "";
    updateBalance();
}

function addExpense() {
    let date = dateInput();
    let title = titleInput();
    let category = categoryInput();
    let amount = amountInput();

    if (!date || !title || !amount) return alert("Fill all fields");

    let expense = { date, title, category, amount };
    createExpense(expense, true);
    saveExpense(expense);

    clearInputs();
}

function createExpense(exp, save) {
    expenseTotal += exp.amount;
    summary[exp.category] += exp.amount;

    let li = document.createElement("li");
    li.innerHTML = `
        ${exp.date} | ${exp.title} (${exp.category}) - ₹${exp.amount}
        <button class="delete" onclick="deleteExpense(this,'${exp.category}',${exp.amount})">X</button>
    `;
    document.getElementById("list").appendChild(li);
    updateUI();
}

function deleteExpense(btn, category, amount) {
    expenseTotal -= amount;
    summary[category] -= amount;
    btn.parentElement.remove();
    updateUI();
}

function updateUI() {
    document.getElementById("expenseTotal").innerText = expenseTotal;
    document.getElementById("food").innerText = summary.Food;
    document.getElementById("travel").innerText = summary.Travel;
    document.getElementById("other").innerText = summary.Other;
    updateBalance();
    drawChart();
}

function updateBalance() {
    document.getElementById("balance").innerText = incomeTotal - expenseTotal;
}

function saveExpense(exp) {
    let data = JSON.parse(localStorage.getItem("expenses")) || [];
    data.push(exp);
    localStorage.setItem("expenses", JSON.stringify(data));
}

function filterExpenses() {
    let date = document.getElementById("filterDate").value;
    let category = document.getElementById("filterCategory").value;
    let data = JSON.parse(localStorage.getItem("expenses")) || [];

    document.getElementById("list").innerHTML = "";
    expenseTotal = 0;
    summary = { Food: 0, Travel: 0, Other: 0 };

    data.forEach(exp => {
        if ((date === "" || exp.date === date) &&
            (category === "All" || exp.category === category)) {
            createExpense(exp, false);
        }
    });
}

function monthlyReport() {
    let month = document.getElementById("month").value;
    let data = JSON.parse(localStorage.getItem("expenses")) || [];
    let total = 0;

    data.forEach(exp => {
        if (exp.date.startsWith(month)) total += exp.amount;
    });

    document.getElementById("monthlyTotal").innerText =
        "Total expense for selected month: ₹ " + total;
}

function drawChart() {
    let c = document.getElementById("chart");
    let ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);

    let values = [summary.Food, summary.Travel, summary.Other];
    let labels = ["Food", "Travel", "Other"];

    values.forEach((v, i) => {
        ctx.fillStyle = "#007bff";
        ctx.fillRect(40 + i * 80, 180 - v / 5, 40, v / 5);
        ctx.fillStyle = "#000";
        ctx.fillText(labels[i], 40 + i * 80, 195);
    });
}

function clearAll() {
    if (confirm("Clear all data?")) {
        localStorage.clear();
        location.reload();
    }
}

/* Helper functions */
function dateInput() { return document.getElementById("date").value; }
function titleInput() { return document.getElementById("title").value; }
function categoryInput() { return document.getElementById("category").value; }
function amountInput() { return Number(document.getElementById("amount").value); }
function clearInputs() {
    document.getElementById("date").value = "";
    document.getElementById("title").value = "";
    document.getElementById("amount").value = "";
}
