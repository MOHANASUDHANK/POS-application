document.addEventListener('DOMContentLoaded', async () => {

    const itemGrid = document.getElementById('item-grid');
    const categoryPanel = document.getElementById('category-panel');
    const billItemList = document.querySelector('.bill-items-list');
    const totalAmount = document.getElementById('total-amount');
    const emptyBill = document.querySelector('.empty-bill-state')
    const itemNoInput = document.querySelector('.itemNoInput');
    const tableNoInput = document.querySelector('.tableNoInput');
    const coverNoInput = document.querySelector('.coverNoInput');
    const numPad = document.querySelector('.numpad');
    const billAddBtn = document.getElementById('bill-add-btn');
    const inputAllClearBtn = document.getElementById('input-allclear-btn');
    const inputClearBtn = document.getElementById('input-clear-btn');
    const quantityDisplay = document.querySelector('.quantity-display');
    const quantityAdder = document.querySelector('.quantity-adder');
    const quantitySubtractor = document.querySelector('.quantity-subtractor');
    const newBillBtn = document.getElementById('new-bill-btn');
    const priceAmendmentBtn = document.getElementById('price-amendment-btn');
    const priceAmendmentPanel = document.getElementById('price-amendment-panel');
    const billItemContainer = document.getElementById('bill-items-container');
    const billInstruction = document.querySelector('.bill-instruction');
    const amendmentTotalAmount = document.getElementById('amendment-total-amount');
    const amendmentGstAmount = document.getElementById('amendment-gst-amount');
    const amendmentPayable = document.getElementById('amendment-payable');
    const amendmentBalanceValue = document.getElementById('amendment-balance-value');
    const tenderInput = document.querySelector('.tender-input');

    let data = await getItemsJSON();
    let currentBill = [];
    let totalAmountValue = 0;
    let activeInputField = itemNoInput;

    const billingComboList = document.getElementById('billing-combo-list');
    data = data.sort((a, b) => a.name.localeCompare(b.name));
    const optionsHtml = data.map(item => `<li>${item.name}</li>`).join('');
    billingComboList.innerHTML = optionsHtml;

    console.log(billInstruction);

    displayItems(data);
    // console.log(itemNoInput, coverNoInput, tableNoInput);


    categoryPanel.addEventListener('click', (e) => {
        if (e.target.closest('.category-btn')) {
            const targetBtn = e.target.closest('.category-btn');

            categoryPanel.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));

            targetBtn.classList.add('active');

            const category = targetBtn.getAttribute('data-category');

            // console.log(category);
            let items = data;
            if (category != "All Items")

                items = data.filter(data => data.category == category);
            // console.log(data.filter(data => data.category == category));
            displayItems(items)
        }
    })

    itemGrid.addEventListener('click', (e) => {
        if (e.target.closest('.item-card')) {
            const targrtCard = e.target.closest('.item-card');
            const itemId = targrtCard.getAttribute('data-id');
            // console.log(itemId);
            addBillItem(itemId, 1);

        }
    });

    billItemList.addEventListener('click', (e) => {
        if (e.target.closest('.del-btn')) {
            const billRow = e.target.closest('.bill-row');
            const itemId = billRow.getAttribute('data-id');
            currentBill = currentBill.filter(bill => bill.id !== itemId)
            loadBillItems()
        }
    })

    billItemList.addEventListener('input', (e) => {
        const itemId = e.target.getAttribute('data-id');
        let quantity = parseInt(e.target.value);
        console.log(typeof (e.target.value));
        if (isNaN(quantity) || quantity < 1) { quantity = 1; e.target.value = 1 };
        const targetItem = currentBill.find(item => item.id == itemId);
        const totalAmountChange = quantity * targetItem.price - targetItem.quantity * targetItem.price
        targetItem.quantity = quantity;
        // console.log(totalChange);
        const itemRow = billItemList.querySelector(`.bill-row[data-id="${itemId}"]`);
        itemRow.querySelector('.bill-item-total').textContent = `$${quantity * targetItem.price}`
        totalAmountValue += totalAmountChange;
        totalAmount.textContent = `$${totalAmountValue}`
    })

    tenderInput.addEventListener('input', () => {
        // console.log((amendmentPayable));
        const payableAmount = parseFloat(amendmentPayable.innerText.split('$')[1])
        console.log(typeof (payableAmount));

        const balance = (isNaN(payableAmount) || isNaN(parseFloat(tenderInput.value))) ? 0 : parseFloat(tenderInput.value) - payableAmount;

        amendmentBalanceValue.innerText = `$${balance.toFixed(2)}`;
    })


    quantityAdder.addEventListener('click', () => {
        quantityDisplay.innerText = parseInt(quantityDisplay.innerText) + 1

    })
    quantitySubtractor.addEventListener('click', () => {
        if (quantityDisplay.innerText !== '1')
            quantityDisplay.innerText = parseInt(quantityDisplay.innerText) - 1

    })

    itemNoInput.addEventListener('click', () => {
        activeInputField = itemNoInput;
        console.log(activeInputField);
        const enteredString = itemNoInput.value.toLowerCase().trim();
        const items = billingComboList.querySelectorAll('li');
        billingComboList.style.display = 'block';
        // items.forEach(item => {
        //     let match = item.innerText.toLowerCase().startsWith(enteredString);
        //     item.style.display = match ? 'block' : 'none';
        // });
    })

    itemNoInput.addEventListener('input', (e) => {
        const enteredString = e.target.value.toLowerCase().trim();
        const items = billingComboList.querySelectorAll('li');
        billingComboList.style.display = 'block';
        items.forEach(item => {
            let match = item.innerText.toLowerCase().includes(enteredString);
            item.style.display = match ? 'block' : 'none';
        });
    });

    billingComboList.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            itemNoInput.value = e.target.innerText;
            billingComboList.style.display = 'none';
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.combo-container')) {
            billingComboList.style.display = 'none';
        }
    });
    tableNoInput.addEventListener('focus', () => {
        activeInputField = tableNoInput;
        console.log(activeInputField);

    })
    coverNoInput.addEventListener('focus', () => {
        activeInputField = coverNoInput;
        console.log(activeInputField);
    })

    numPad.addEventListener('click', (e) => {
        if (e.target.closest('.numpad-btn')) {

            if (e.target.closest('.backspace')) {
                if (e.target.value !== '')
                    activeInputField.value = activeInputField.value.slice(0, -1)
            }
            else {
                activeInputField.value += e.target.value
            }
        }
    })

    billAddBtn.addEventListener('click', () => {
        const item = data.find(item => item.name.toLowerCase() == itemNoInput.value.toLowerCase())

        const itemId = item.id;
        // console.log(itemId);
        const quantity = parseInt(quantityDisplay.innerText);
        addBillItem(itemId, quantity)
        itemNoInput.value = '';
    })
    inputAllClearBtn.addEventListener('click', (e) => {
        itemNoInput.value = '';
        coverNoInput.value = '';
        tableNoInput.value = '';
        quantityDisplay.innerText = '1';
    })

    inputClearBtn.addEventListener('click', () => {
        activeInputField.value = ''
    })

    newBillBtn.addEventListener('click', () => {
        currentBill = []
        priceAmendmentPanel.classList.add('hidden')
        loadBillItems()
        billItemContainer.classList.remove('hidden');
    })

    priceAmendmentBtn.addEventListener('click', () => {

        const gstAmount = (totalAmountValue * 18 / 100).toFixed(2);
        priceAmendmentPanel.classList.remove('hidden')
        billItemContainer.classList.add('hidden');
        amendmentTotalAmount.innerText = `$${(totalAmountValue).toFixed(2)}`;
        amendmentGstAmount.innerText = `$${(Number(gstAmount)).toFixed(2)}`;
        amendmentPayable.innerText = `$${(Number(totalAmountValue) + Number(gstAmount)).toFixed(2)}`;
    })

    function addBillItem(id, quantity) {
        const item = data.find(data => data.id == id);
        console.log(item);
        let existingItem = currentBill.find(bill => bill.id == item.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        }
        else {
            currentBill.push({
                id: item.id,
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: quantity
            })
        }
        loadBillItems();
    }

    function displayItems(items) {
        let gridHTML = "";
        console.log(items);

        items.forEach(item => {
            gridHTML += `
        <div class = "item-card" data-id="${item.id}">
            <img class="item-image" src = "${item.image}">
            <div class="item-info">
                <div class="item-name">${item.name}</div>
            </div>
        </div>
        `
        })
        itemGrid.innerHTML = gridHTML;
    }

    function loadBillItems() {
        console.log(currentBill);
        let billHTML = "";
        totalAmountValue = 0;

        currentBill.forEach(item => {
            const itemTotal = item.quantity * item.price;
            totalAmountValue += itemTotal;
            billHTML = `
            <div class="bill-row" data-id="${item.id}">
            <div class="bill-item-info">
            <img src="${item.image}" class="bill-item-image">
            <span class="bill-item-name">${item.name}</span>
            </div>
            <div class="bill-item-quantity-input-wrapper">
            <input type="number"class="bill-quantity-input"value="${item.quantity}"min="1" data-id="${item.id}" maxlength="3">
            </div>
            <div class="bill-item-price">$${item.price}</div>
            <div class="bill-item-total">$${itemTotal}</div>
            <div class="bill-item-action">
                <button class="del-btn">
                    <img src="../asserts/delete_18dp_1F1F1F_FILL0_wght400_GRAD0_opsz20.png">
                </button>
            </div>
            </div>
            `+ billHTML
        })
        billItemList.innerHTML = billHTML;
        totalAmount.textContent = `$${totalAmountValue}`;

        if (currentBill.length === 0) {
            emptyBill.classList.remove('hidden');
            billInstruction.classList.add('hidden');
        } else {
            emptyBill.classList.add('hidden');
            billInstruction.classList.remove('hidden');
        }
    }
})