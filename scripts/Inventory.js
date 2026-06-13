document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("inventory-data");
    const addBtn = document.getElementById("add-btn");
    const reqBtn = document.getElementById("req-btn");

    const categorySelect = document.getElementById('category');
    const itemNameField = document.querySelector('.itemNameInput');
    const comboBox = document.querySelector('.combo-list');
    const statusSelect = document.getElementById('status');
    const filterBtn = document.querySelector('.filter-btn');
    const resetBtn = document.querySelector('.reset-btn');

    let data = getItems();

    const itemNameList =data.map(item=>`<li>${item.name}</li>`).join('');
    console.log(itemNameList);
    
    comboBox.innerHTML = itemNameList;

    itemNameField.addEventListener('click', () => {
        comboBox.style.display = 'block';
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.combo-container')) {
            comboBox.style.display = 'none';
        }
    });

    itemNameField.addEventListener('input', (e) => {
        const enteredString = e.target.value.toLowerCase().trim();
        const items = comboBox.querySelectorAll('li');
        items.forEach(item => {
            let isMatched = item.innerText.toLowerCase().includes(enteredString);
            item.style.display = isMatched ? 'block' : 'none';
        });
    });

    comboBox.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            itemNameField.value = e.target.innerHTML;
            comboBox.style.display = 'none';
        }
    });

    

    

    filterBtn.addEventListener('click', () => {
        const categoryVal = categorySelect.value;
        const nameVal = itemNameField.value.trim().toLowerCase();
        const statusVal = statusSelect.value;
        
        const filteredData = data.filter(item => {
            if (categoryVal !== "All Categories" && item.category !== categoryVal) {
                return false;
            }
            if (nameVal && !item.name.toLowerCase().includes(nameVal)) {
                return false;
            }
            if (statusVal !== "All Status") {
                if (item.status.toLowerCase() !== statusVal.toLowerCase()) {
                    return false;
                }
            }
            return true;
        });

        let tableHTML = "";
        filteredData.forEach(item => {
            let stockClass = "stock-high";
            let statusClass = "in-stock";
            if (item.status == "Low Stock") {
                stockClass = "stock-low";
                statusClass = "low-stock";
            } else if (item.status == "Out Of Stock" || item.status == "Out of Stock") {
                stockClass = "stock-zero";
                statusClass = "out-of-stock";
            }

            tableHTML += `
                <tr>
                    <td>
                        <div class="item-cell">
                            <img src="${item.image}">
                            <span><a href='editInventory.html?id=${item.id}'>${item.name}</a></span>
                        </div>
                    </td>
                    <td>${item.category}</td>
                    <td>$${item.price}</td>
                    <td>${item.unit}</td>
                    <td>${item.purchased}</td>
                    <td>${item.sold}</td>
                    <td class="${stockClass}">${item.stock}</td>
                    <td>
                        <span class="${statusClass}">${item.status}</span>
                    </td>
                    <td>${item.lastUpdated}</td>
                </tr>
            `;
        });
        tableBody.innerHTML = tableHTML;
    });

    resetBtn.addEventListener('click', () => {
        categorySelect.value = "All Categories";
        itemNameField.value = "";
        statusSelect.value = "All Status";
        filterBtn.click();
    });

    addBtn.addEventListener('click', () => {
        window.location.href = `addInventory.html`;
    });
    reqBtn.addEventListener('click', () => {
        window.location.href = 'addRequest.html';
    });

    filterBtn.click();
});
