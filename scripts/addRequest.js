document.addEventListener('DOMContentLoaded', () => {

    const addItemButton = document.getElementById('add-item-btn')
    const submitButton = document.getElementById('sub-btn');
    const saveButton = document.getElementById('save-modal-confirm');
    // const cancelButton = document.getElementById('cancel-btn');
    // const cancelModal = document.getElementById('cancel-modal');
    // const cancelModalBack = document.getElementById('cancel-modal-back');
    const cancelModalConfirm = document.getElementById('cancel-modal-confirm');
    const requestform = document.getElementById('req-form');
    const idField = document.getElementById('id');
    const requestDate = document.getElementById('requestDate');
    const tableBody = document.getElementById('items-table-body');
    
    let requestId ="REQ-000001" ;
    let data = getRequests();
    let inventoryData = getItems();
    console.log(data);
    
    if(data.length != 0){
        const lastId  = data[data.length -1].id;
        const arr = lastId.split('-');
        requestId = arr[0] + '-' + String(parseInt(arr[1]) + 1).padStart(6, '0');
    }

    idField.value  = requestId; 
    requestDate.value  = new Intl.DateTimeFormat('en-In', { day: '2-digit', month: 'short', year: 'numeric',  }).format(new Date())
    
    const optionsHtml = inventoryData.map(item=>
        `<option value="${item.name}">${item.name}</option>`
    ).join('');
    console.log(optionsHtml);

     let tableHTML = '';
        tableHTML+=`
            <tr >
            <td>
            <select class="item-name">
            <option disabled selected>Select Name</option>
            ${optionsHtml}
            </select>
            </td>
            <td>
            <textarea class="item-desc" readonly></textarea></td>
            <td>
            <input type="number" class="item-qty" placeholder="Enter quantity" min="1" required>
            </td>
            <td>
            <input type="text" class="item-unit" >
            </td>
            <td class="action-col">
            <button type="button" class="delete-btn">
            <img src="../asserts/icons8-trash-48.png"">
            </button>
            </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend',tableHTML);

    addItemButton.addEventListener('click',()=>{
        let tableHTML = '';
        tableHTML+=`
            <tr >
            <td>
            <select class="item-name">
            <option disabled selected>Select Name</option>
            ${optionsHtml}
            </select>
            </td>
            <td>
            <textarea class="item-desc" readonly></textarea></td>
            <td>
            <input type="number" class="item-qty" placeholder="Enter quantity" min="1" required>
            </td>
            <td>
            <input type="text" class="item-unit" >
            </td>
            <td class="action-col">
            <button type="button" class="delete-btn">
            <img src="../asserts/icons8-trash-48.png"">
            </button>
            </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend',tableHTML);

        
    })

    tableBody.addEventListener('click',(e)=>{
        console.log(e.target.tagName);
        
        if(e.target.tagName=='IMG' || e.target.classList.contains('delete-btn')){
        const row = e.target
        .closest('tr');
        row.remove();}
        
    })

    tableBody.addEventListener('change',(e)=>{
        if(e.target.classList.contains('item-name')){
            const name = e.target.value;
            const row =e.target.closest('tr');

            const descField = row.querySelector('.item-desc');
            const unitField = row.querySelector('.item-unit');

            const item = inventoryData.find(i => i.name == name);

            if(item){
                descField.value = item.description || '';
                unitField.value = item.unit || '';
            }
        }
    })

    saveButton.addEventListener('click', (e) => {

        const itemArray = [];
        const tableRows = tableBody.querySelectorAll('tr');
        const formData = new FormData(requestform);
        const form = Object.fromEntries(formData);

        tableRows.forEach(row=>{
            console.log(row.querySelector('.item-name').value);
            itemArray.push({
                name:row.querySelector('.item-name').value,
                quantity:row.querySelector('.item-qty').value,
            })
        })

        const newRequest = {
            id: form.id,
            subject:form.subject,
            requestedBy:form.requestedBy,
            requestedDate:new Intl.DateTimeFormat('en-In', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()),
            expectingDate:form.expectingDate,
            status:form.status,
            action:"notViewed"
        }

        
        const newRequestItems = {
            id:requestId,
            data:itemArray
        }


        console.log(itemArray)
        addRequest(newRequest);
        addRequestItems(newRequestItems);
        window.location.href = 'itemRequest.html'
    })

    // submitButton.addEventListener('click', (e) => {
    //     document.getElementById('confirm-submit-modal').classList.remove('hide');
    // })


    // cancelButton.addEventListener('click', () => {
    //     if (cancelModal) {
    //         cancelModal.classList.remove('hide');
    //     }
    // });

    // if (cancelModalBack) {
    //     cancelModalBack.addEventListener('click', () => {
    //         if (cancelModal) {
    //             cancelModal.classList.add('hide');
    //         }
    //     });
    // }

    // if (cancelModalConfirm) {
    //     cancelModalConfirm.addEventListener('click', () => {
    //         window.location.href = 'itemRequest.html';
    //     });
    // }
})