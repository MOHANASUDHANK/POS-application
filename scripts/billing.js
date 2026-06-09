document.addEventListener('DOMContentLoaded', () => {

    const itemGrid = document.getElementById('item-grid');
    const categoryPanel = document.getElementById('category-panel');
    const billItemList = document.querySelector('.bill-items-list');
    const totalAmount = document.getElementById('total-amount');
     

    const data = getItems();
    let currentBill=[];


    function displayItems(items) {
        let gridHTML = "";
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
        console.log('hi');
        
    }
    displayItems(data);

    categoryPanel.addEventListener('click',(e)=>{
       if(e.target.closest('.category-btn')){
        const targetBtn = e.target.closest('.category-btn');

        categoryPanel.querySelectorAll('.category-btn').forEach(btn=>btn.classList.remove('active'));

        targetBtn.classList.add('active');
        
        const category = targetBtn.getAttribute('data-category');

        // console.log(category);
        let items=data;
        if(category!="All Items")
            
        items = data.filter(data => data.category == category);
        // console.log(data.filter(data => data.category == category));
        displayItems(items)
       }
        
    })

    itemGrid.addEventListener('click',(e)=>{
        if(e.target.closest('.item-card')){
            const targrtCard = e.target.closest('.item-card');
            const itemId = targrtCard.getAttribute('data-id');
            // console.log(itemId);
            addBillItem(itemId);
            
        }
    });

    billItemList.addEventListener('click',(e)=>{
        if(e.target.closest('.del-btn')){
            const billRow = e.target.closest('.bill-row');
            const itemId = billRow.getAttribute('data-id');
            currentBill=currentBill.filter(bill=>bill.id !== itemId)
        loadBillItems()
        }
    })

    function addBillItem(id){
        const item = data.find(data=>data.id==id);
        // console.log(item);
        let existingItem =  currentBill.find(bill=>bill.id==item.id);
        if(existingItem){
            existingItem.quantity+=1;
        }
        else{
            currentBill.push({
                id:item.id,
                name: item.name,
                image: item.image,
                price:item.price,
                quantity:1
            })
        }
        loadBillItems();
    }

    function loadBillItems(){
        console.log(currentBill);
        let billHTML = "";
        let sum = 0;

        currentBill.forEach(item=>{
            const itemTotal = item.quantity*item.price;
            sum+=itemTotal;
            billHTML+=`
            <div class="bill-row" data-id="${item.id}">
            <div class="bill-item-info">
            <img src="${item.image}" class="bill-item-image">
            <span class="bill-item-name">${item.name}</span>
            </div>
            <div class="bill-item-quantity-input-wrapper">
            <input type="number"class="bill-quantity-input"value="${item.quantity}"min="1" data-id="${item.id}">
            </div>
            <div class="bill-item-price">$${item.price}</div>
            <div class="bill-item-total">$${itemTotal}</div>
            <div class="bill-item-action">
                <button class="del-btn">
                    <img src="../asserts/delete_18dp_1F1F1F_FILL0_wght400_GRAD0_opsz20.png">
                </button>
            </div>
            </div>
            `
        })
        billItemList.innerHTML=billHTML;
        totalAmount.textContent=`$${sum}`
    }

    
})