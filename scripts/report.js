document.addEventListener('DOMContentLoaded', async () => {

    const itemNameField = document.querySelector('.itemNameInput');
    const comboBox = document.querySelector('.combo-list');
    const filterPeriodPanel = document.querySelector('.filter-period');
    const fromDate = document.getElementById('fromDate');
    const toDate = document.getElementById('toDate');
    const resetBtn = document.querySelector('.reset-btn');
    const filterBtn = document.querySelector('.filter-btn');
    const customBtn = document.querySelector('.custom');
    const excelBtn = document.querySelector('.excel-btn');
    const globalSearch = document.getElementById('global-search');

    let inventoryData = getItems();
    let billItemsData = await getBillItems();
    let billData = await getBills();
    console.log(billData, billItemsData);


    inventoryData = inventoryData.sort((a, b) => a.name.localeCompare(b.name));
    const itemNameList = inventoryData.map(item => `<li>${item.name}</li>`).join('');
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
    });

    function salesData(period, name, customFrom, customTo) {
        const todayDate = new Date();
        const bills = billData.filter(bill => {
            if (period == "Today") {
                return (new Date(bill.createdAt).toDateString() === todayDate.toDateString());
            }
            if (period == "Yesterday") {
                return (new Date(bill.createdAt).toDateString() === new Date(todayDate.getTime() - 24 * 60 * 60 * 1000).toDateString());
            }
            if (period == "This Week") {
                return (new Date(bill.createdAt) >= new Date(todayDate.getTime() - todayDate.getDay() * 24 * 60 * 60 * 1000));
            }
            if (period == "This Month") {
                return ((new Date(bill.createdAt)).getFullYear() === todayDate.getFullYear() && (new Date(bill.createdAt)).getMonth() === todayDate.getMonth());
            }
            if (period == "Custom" && customFrom && customTo) {
                console.log('hello');
                
                const billDate = new Date(bill.createdAt);
                billDate.setHours(0, 0, 0, 0);
                return billDate >= new Date(customFrom) && billDate <= new Date(customTo);
            }
            return true;
        });

        const billIds = new Set(bills.map(bill => bill.id));
        const filteredItems = billItemsData.filter(item => {
            return billIds.has(item.billID) && (name == "" || item.name.toLowerCase().includes(name.toLowerCase()));
        });

        const salesMap = new Map();
        filteredItems.forEach(item => {
            if (!salesMap.has(item.name)) {
                salesMap.set(item.name, {
                    quantity: 0,
                    totalPrice: 0
                });
            }
            const qty = parseInt(item.quantity);
            const price = parseFloat(item.price);
            salesMap.set(item.name, {
                quantity: salesMap.get(item.name).quantity + qty,
                totalPrice: salesMap.get(item.name).totalPrice + qty * price
            });
        });

        const salesArray = [];
        salesMap.forEach((data, itemName) => {
            salesArray.push({
                name: itemName,
                quantity: data.quantity,
                totalPrice: data.totalPrice
            });
        });

        return salesArray;
    }

    const initialData = salesData("Today", "", "", "");
    const table = new DataTable('#report-table', {
        data: initialData,
        layout: {
            topStart: null,
            topEnd: null,
            bottom: {
                features: ['pageLength', 'paging', 'info'],
                className: 'custom-bottom-wrapper'
            },
            bottomStart: null,
            bottomEnd: null
        },
        buttons: [
            {
                extend: 'excelHtml5',
                title: 'Sales Report Data',
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
            { data: 'name' },
            { data: 'quantity' },
            { 
                data: 'totalPrice',
                render: data => `$${parseFloat(data).toFixed(2)}`
            }
        ]
    });

    excelBtn.addEventListener('click', () => {
        table.button('.buttons-excel').trigger();
    });

    resetBtn.addEventListener('click', () => {
        itemNameField.value = '';
        filterPeriodPanel.querySelector('.active').classList.remove('active');
        filterPeriodPanel.firstElementChild.classList.add('active');
        document.querySelector('.custom-period').classList.add('hidden');
        filterBtn.click();
    });

    filterBtn.addEventListener('click', () => {
        const period = filterPeriodPanel.querySelector('.active').innerText.trim();
        const name = itemNameField.value;
        const customFrom = fromDate.value;
        const customTo = toDate.value;

        const newData = salesData(period, name, customFrom, customTo);
        table.clear().rows.add(newData).draw();
    });

    table.on('draw',function(){
        const count = table.rows({filter:'applied'}).count();
        document.getElementById('total-count').innerText=`Total ${count} Recorts found`
    })
    globalSearch.addEventListener('input',(e)=>{
        table.search(e.target.value).draw();
    })
});