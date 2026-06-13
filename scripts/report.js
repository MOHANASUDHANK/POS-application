document.addEventListener('DOMContentLoaded', async () => {

    const tableBody = document.getElementById('report-data');
    const itemNameField = document.querySelector('.itemNameInput');
    const comboBox = document.querySelector('.combo-list');
    const filterPeriodPanel = document.querySelector('.filter-period');
    const todayDate = new Date();
    const fromDate = document.getElementById('fromDate');
    const toDate = document.getElementById('toDate');
    const resetBtn = document.querySelector('.reset-btn');
    const filterBtn = document.querySelector('.filter-btn');
    const customBtn = document.querySelector('.custom');


    let inventoryData = getItems();
    let billItemsData = await getBillItems();
    let billData = await getBills();
    console.log(billData, billItemsData);


    inventoryData = inventoryData.sort((a, b) => a.name.localeCompare(b.name));

    const itemNameList = inventoryData.map(item => `
        <li>${item.name}</li>
        `).join('');

    comboBox.innerHTML = itemNameList;

    itemNameField.addEventListener('click', () => {
        comboBox.style.display = 'block'
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.itemNameInput')) {
            comboBox.style.display = 'none';
        }
    })

    itemNameField.addEventListener('input', (e) => {
        const enteredString = e.target.value.toLowerCase().trim();
        const items = comboBox.querySelectorAll('li');
        items.forEach(item => {
            let isMatched = item.innerText.toLowerCase().includes(enteredString);
            item.style.display = isMatched ? 'block' : 'none';
        });
        // console.log(enteredString);
    })
    comboBox.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            itemNameField.value = e.target.innerHTML;
            comboBox.style.display = 'none';
        }
    });

    filterPeriodPanel.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            // const periods = filterPeriodPanel.querySelectorAll('button');
            filterPeriodPanel.querySelector('.active').classList.remove('active');
            e.target.classList.add('active');
            if (!e.target.closest('.custom'))
                document.querySelector('.custom-period').classList.add('hidden');
        }
    })


    customBtn.addEventListener('click', () => {
        document.querySelector('.custom-period').classList.remove('hidden');
    })

    resetBtn.addEventListener('click', (e) => {
        itemNameField.value = ''
        filterPeriodPanel.querySelector('.active').classList.remove('active');
        filterPeriodPanel.firstElementChild.classList.add('active');
        document.querySelector('.custom-period').classList.add('hidden');
        filterBtn.click();
    })

    // console.log(filterPeriodPanel.firstElementChild);


    filterBtn.addEventListener('click', () => {

        const period = document.querySelector('.active').innerText.trim();
        const name = itemNameField.value;

        const customFrom = fromDate.value;
        const customTo = toDate.value;

        const bills = billData.filter(bill => {
            if (period == "Today") {
                return (new Date(bill.createdAt).toDateString() == todayDate.toDateString());
            }
            if (period == "Yesterday") {
                return (new Date(bill.createdAt).toDateString() == new Date(todayDate.getTime() - 24 * 60 * 60 * 1000).toDateString());
            }
            if (period == "This Week") {
                return (new Date(bill.createdAt) >= new Date(todayDate.getTime() - todayDate.getDay() * 24 * 60 * 60 * 1000));
            }
            if (period == "This Month") {
                console.log((new Date(bill.createdAt)).getFullYear(), new Date(todayDate).getFullYear(), (new Date(bill.createdAt)).getMonth(), new Date(todayDate).getMonth());

                return ((new Date(bill.createdAt)).getFullYear() == new Date(todayDate).getFullYear() && (new Date(bill.createdAt)).getMonth() == new Date(todayDate).getMonth())
            }
            if (period == "Custom") {
                const billDate = new Date(bill.createdAt);
                billDate.setHours(0, 0, 0, 0);
                return billDate >= new Date(customFrom) && billDate <= new Date(customTo);
            }
        });
        const billIds = new Set(bills.map(bill => bill.id));
        const items = billItemsData.filter(item => {
            // console.log(item,billIds.has(item.billId) , item.name.includes(name));

            return billIds.has(item.billID) && item.name.includes(name)
        });

        console.log(items);

        const salesList = new Map();

        items.forEach(item => {


            if (!salesList.has(item.name)) {
                salesList.set(item.name, {
                    quantity: 0,
                    totalPrice: 0
                });
            }

            salesList.set(item.name, {
                quantity: salesList.get(item.name).quantity + parseInt(item.quantity),
                totalPrice: salesList.get(item.name).totalPrice + parseInt(item.quantity) * parseInt(item.price)
            });
        });


        console.log('hi', name);

        let tableHTML = "";
        salesList.forEach((data, name) => {
            tableHTML += `
        <tr>
            <td>${name}</td>
            <td>${data.quantity}</td>
            <td>$${data.totalPrice.toFixed(2)}</td>
        </tr>
        `;
        });
        tableBody.innerHTML = tableHTML;

    })

    const todayBills = billData.filter(bill => {
        return new Date(bill.createdAt).toDateString() === todayDate.toDateString();
    });

    const todayBillIds = new Set(todayBills.map(bill => bill.id));

    const todayItems = billItemsData.filter(item => todayBillIds.has(item.billID));

    const sales = new Map();

    todayItems.forEach(item => {

        if (!sales.has(item.name)) {
            sales.set(item.name, {
                quantity: 0,
                totalPrice: 0
            });
        }

        sales.set(item.name, {
            quantity: sales.get(item.name).quantity + parseInt(item.quantity),
            totalPrice: sales.get(item.name).totalPrice + parseInt(item.quantity) * parseInt(item.price)
        });


    });


    console.log(todayItems);

    let tableHTML = "";
    sales.forEach((data, name) => {
        tableHTML += `
        <tr>
            <td>${name}</td>
            <td>${data.quantity}</td>
            <td>$${data.totalPrice.toFixed(2)}</td>
        </tr>
        `;
    });
    tableBody.innerHTML = tableHTML;

})