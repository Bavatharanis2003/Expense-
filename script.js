let incomeTotal = 0;
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

/* Income */
function addIncome() {
    let val = Number(document.getElementById("income").value);
    if (!val) return;
    incomeTotal += val;
    localStorage.setItem("income", incomeTotal);
    updateUI();
}

/* Budget */
function setBudget() {
    budget = Number(document.getElementById("budget").value);
    localStorage.setItem("budget", budget);
    updateUI();
}

/* Add Expense */
function addExpense() {
    let titleVal = document.getElementById("title").value.trim();
    let categoryVal = document.getElementById("category").value;
    let autoCat = autoCategory(titleVal);
    if (autoCat) categoryVal = autoCat;

    let exp = {
        date: document.getElementById("date").value,
        title: titleVal,
        category: categoryVal,
        amount: Number(document.getElementById("amount").value)
    };

    if (!exp.date || !exp.title || !exp.amount) return alert("Fill all fields");

    expenses.push(exp);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderExpense(exp);
    updateUI();
}

/* Auto Category */
function autoCategory(title){
    title = title.toLowerCase();
    if(title.includes("lunch")||title.includes("dinner")||title.includes("breakfast")) return "Food";
    if(title.includes("bus")||title.includes("train")||title.includes("cab")||title.includes("taxi")) return "Travel";
    return null;
}

/* Render Expense */
function renderExpense(exp) {
    let li = document.createElement("li");
    li.innerHTML = `
        ${exp.date} | ${exp.title} (${exp.category}) - ₹${exp.amount}
        <span>
            <button class="edit" onclick="editExpense('${exp.title}')">E</button>
            <button class="delete" onclick="deleteExpense('${exp.title}')">X</button>
        </span>
    `;
    document.getElementById("list").appendChild(li);
}

/* Delete */
function deleteExpense(title) {
    if(!confirm("Delete this expense?")) return;
    expenses = expenses.filter(e => e.title !== title);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    reloadList();
}

/* Edit */
function editExpense(title) {
    let exp = expenses.find(e => e.title === title);
    document.getElementById("title").value = exp.title;
    document.getElementById("amount").value = exp.amount;
    document.getElementById("category").value = exp.category;
    deleteExpense(title);
}

/* Search */
function searchExpense() {
    let key = document.getElementById("search").value.toLowerCase();
    document.getElementById("list").innerHTML = "";
    expenses.filter(e => e.title.toLowerCase().includes(key)).forEach(e => renderExpense(e));
}

/* Filter */
function applyFilter() {
    let date = document.getElementById("filterDate").value;
    let cat = document.getElementById("filterCategory").value;
    document.getElementById("list").innerHTML = "";
    expenses.filter(e => 
        (date === "" || e.date === date) &&
        (cat === "All" || e.category === cat)
    ).forEach(e => renderExpense(e));
}

/* Reset Filter */
function resetFilter() {
    document.getElementById("filterDate").value = "";
    document.getElementById("filterCategory").value = "All";
    reloadList();
}

/* Monthly Report */
function monthlyReport() {
    let month = document.getElementById("month").value;
    let total = expenses.filter(e=>e.date.startsWith(month)).reduce((s,e)=>s+e.amount,0);
    document.getElementById("monthlyTotal").innerText = "Total: ₹" + total;
}

/* Update UI */
function updateUI() {
    let expenseTotal = expenses.reduce((s, e) => s + e.amount, 0);
    document.getElementById("expenseTotal").innerText = expenseTotal;
    document.getElementById("balance").innerText = incomeTotal - expenseTotal;
    document.getElementById("expenseCount").innerText = expenses.length;

    /* Today total */
    let today = new Date().toISOString().slice(0,10);
    let todayTotal = expenses.filter(e=>e.date===today).reduce((s,e)=>s+e.amount,0);
    document.getElementById("todayTotal").innerText = todayTotal;

    /* Budget alert */
    let msg = document.getElementById("budgetMsg");
    if(budget && expenseTotal>budget){
        msg.innerText = "⚠ Budget Exceeded!";
        msg.style.color = "red";
    } else {
        msg.innerText = "Within Budget";
        msg.style.color = "green";
    }

    drawChart();
}

/* Reload */
function reloadList() {
    document.getElementById("list").innerHTML = "";
    expenses.forEach(e => renderExpense(e));
    updateUI();
}

/* Draw Chart */
function drawChart() {
    let food=0, travel=0, other=0;
    expenses.forEach(e=>{
        if(e.category==="Food") food+=e.amount;
        if(e.category==="Travel") travel+=e.amount;
        if(e.category==="Other") other+=e.amount;
    });

    let canvas=document.getElementById("chart");
    let ctx=canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);

    let values=[food,travel,other];
    let labels=["Food","Travel","Other"];

    values.forEach((v,i)=>{
        ctx.fillStyle="#007bff";
        ctx.fillRect(40+i*80,180-v/5,40,v/5);
        ctx.fillStyle="#000";
        ctx.fillText(labels[i],40+i*80,195);
    });
}

/* Download CSV */
function downloadCSV(){
    let csv="Date,Title,Category,Amount\n";
    expenses.forEach(e=>{
        csv+=`${e.date},${e.title},${e.category},${e.amount}\n`;
    });
    let blob=new Blob([csv], {type:'text/csv'});
    let url=URL.createObjectURL(blob);
    let a=document.createElement("a");
    a.href=url;
    a.download="expenses.csv";
    a.click();
}

/* Clear All */
function clearAll() {
    if(confirm("Clear all data?")){
        localStorage.clear();
        location.reload();
    }
}

/* Dark Mode */
function toggleMode() {
    document.body.classList.toggle("dark");
}
