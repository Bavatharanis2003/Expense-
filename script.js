let total = 0;
let summary = { Food: 0, Travel: 0, Other: 0 };

// Load saved data
window.onload = function () {
    let data = JSON.parse(localStorage.getItem("expenses")) || [];
    data.forEach(exp => createExpense(exp));
};

function addExpense() {
    let date = document.getElementById("date").value;
    let title = document.getElementById("title").value;
    let category = document.getElementById("category").value;
    let amount = document.getElementById("amount").value;

    if (date === "" || title === "" || amount === "") {
        alert("Please fill all fields");
        return;
    }

    amount = Number(amount);

    let expense = { date, title, category, amount };
    createExpense(expense);
    saveExpense(expense);

    document.getElementById("date").value = "";
    document.getElementById("title").value = "";
    document.getElementById("amount").value = "";
}

function createExpense(exp) {
    total += exp.amount;
    summary[exp.category] += exp.amount;

    updateUI();

    let li = document.createElement("li");
    li.innerHTML = `
        ${exp.date} | ${exp.title} (${exp.category}) - ₹${exp.amount}
        <button class="delete" onclick="deleteExpense(this, '${exp.category}', ${exp.amount})">X</button>
    `;
    document.getElementById("list").appendChild(li);
}

function deleteExpense(btn, category, amount) {
    total -= amount;
    summary[category] -= amount;
    updateUI();
    btn.parentElement.remove();
}

function updateUI() {
    document.getElementById("total").innerText = total;
    document.getElementById("food").innerText = summary.Food;
    document.getElementById("travel").innerText = summary.Travel;
    document.getElementById("other").innerText = summary.Other;
}

function saveExpense(expense) {
    let data = JSON.parse(localStorage.getItem("expenses")) || [];
    data.push(expense);
    localStorage.setItem("expenses", JSON.stringify(data));
}
