document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("inventory-data");
    const addBtn = document.getElementById("add-btn");
    const reqBtn = document.getElementById("req-btn");

    let data = getItems();

    let tableHTML = "";
    console.log(data);
    
    data.forEach(item => {
        let stockClass = "stock-high";
        let statusClass = "in-stock";
        if (item.status == "Low Stock") {
            stockClass = "stock-low";
            statusClass = "low-stock";
        } else if (item.status == "Out Of Stock") {
            stockClass = "stock-zero";
            statusClass = "out-of-stock";
        }

        tableHTML += `
                    <tr >
                        <td>
                            <div class="item-cell">
                                <img src="${item.image}">
                                <span><a href = 'editInventory.html?id=${item.id}'>${item.name}<a></span>
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
    addBtn.addEventListener('click', () => {
        window.location.href = `addInventory.html`;
    })
    reqBtn.addEventListener('click',()=>{
        window.location.href = 'addRequest.html';
    })
})

