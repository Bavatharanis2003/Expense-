let total = 0;

function addExpense() {
    let title = document.getElementById("title").value;
    let amount = document.getElementById("amount").value;

    if (title === "" || amount === "") {
        alert("Please enter details");
        return;
    }

    amount = Number(amount);
    total += amount;

    document.getElementById("total").innerText = total;

    let li = document.createElement("li");
    li.innerHTML = `${title} <span>₹${amount}</span>`;

    document.getElementById("list").appendChild(li);

    document.getElementById("title").value = "";
    document.getElementById("amount").value = "";
}
