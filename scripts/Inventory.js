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
    const excelBtn = document.querySelector('.excel-btn');
    const lengthSelect = document.querySelector('.left-container select');
    const globalSearch = document.getElementById('global-search');

    let data = getItems();

    const itemNameList = data.map(item => `<li>${item.name}</li>`).join('');
    console.log(itemNameList);

    comboBox.innerHTML = itemNameList;

    const table = new DataTable('#inventory-table', {
        data: data,
        layout: {
            topStart:null,
            topEnd:null,
            bottomEnd:
            {
                features:['pageLength','paging','info'],
                className:'custom-bottom-wrapper'
            },
            bottomStart:null,
        },
        buttons: [
            {
                extend: 'excelHtml5',
                title: 'Inventory Data Report',
                exportOptions: {
                    format: {
                        body: function (data) {
                            if (typeof data === 'string' && data.includes('<')) {
                                return data.replace(/<\/?[^>]+(>|$)/g, "").trim();
                            }
                            return data;
                        }
                    }
                }
            }
        ],
        columns: [
            {
                data: 'name',
                render: function (data, type, item) {
                    return `
                    <div class="item-cell">
                        <img src="${item.image}">
                        <span><a href='editInventory.html?id=${item.id}'>${data}</a></span>
                    </div>
                    `;
                }
            },
            { data: 'category' },
            {
                data: 'price',
                render: data => `$${data}`
            },
            { data: 'unit' },
            { data: 'purchased' },
            { data: 'sold' },
            {
                data: 'stock',
                className: 'stock-cell',
                render: function (data, type, item) {
                    let stockClass = "stock-high";

                    if (item.status === "Low Stock") {
                        stockClass = 'stock-low';
                    } else if (item.status === "Out Of Stock" || item.status === "Out of Stock") {
                        stockClass = 'stock-zero';
                    }
                    return `<div class="${stockClass}">${data}</div>`;
                }
            },
            {
                data: 'status',
                render: function (data) {
                    let statusClass = "in-stock";
                    if (data === "Low Stock") statusClass = "low-stock";
                    if (data === "Out Of Stock" || data === "Out of Stock") statusClass = "out-of-stock";
                    return `<span class="${statusClass}">${data}</span>`;
                }
            },
            { data: 'lastUpdated' }
        ]
    });

    $.fn.dataTable.ext.search.push(function (settings, searchData, index, rowData) {
        const categoryVal = categorySelect.value;
        const nameVal = itemNameField.value.trim().toLowerCase();
        const statusVal = statusSelect.value;

        if (categoryVal !== "All Categories" && rowData.category !== categoryVal) {
            return false;
        }
        if (nameVal && !rowData.name.toLowerCase().includes(nameVal)) {
            return false;
        }
        if (statusVal !== "All Status" && rowData.status.toLowerCase() !== statusVal.toLowerCase()) {
            return false;
        }
        return true;
    });

    filterBtn.addEventListener('click', () => {
        table.draw();
    });

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

    resetBtn.addEventListener('click', () => {
        categorySelect.value = "All Categories";
        itemNameField.value = "";
        statusSelect.value = "All Status";
        table.draw();
    });

    table.on('draw',function(){
        const count = table.rows({filter:'applied'}).count();
        document.getElementById('total-count').innerText=`Total ${count} Item found`
    })

    addBtn.addEventListener('click', () => {
        window.location.href = `addInventory.html`;
    });
    reqBtn.addEventListener('click', () => {
        window.location.href = 'addRequest.html';
    });
    excelBtn.addEventListener('click', () => {
        table.button('.buttons-excel').trigger();
    });

    globalSearch.addEventListener('input',(e)=>{
        table.search(e.target.value).draw();
    })

    filterBtn.click();
});