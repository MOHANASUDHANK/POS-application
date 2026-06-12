document.addEventListener('DOMContentLoaded', async () => {

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

    let requestId = "REQ-000001";
    let data = await getRequests();
    let inventoryData = await getItems();
    inventoryData = inventoryData.sort((a, b) => a.name.localeCompare(b.name))
    console.log(data);

    if (data.length != 0) {
        const lastId = data[data.length - 1].id;
        const arr = lastId.split('-');
        requestId = arr[0] + '-' + String(parseInt(arr[1]) + 1).padStart(6, '0');
    }

    idField.value = requestId;
    requestDate.value = new Intl.DateTimeFormat('en-In', { day: '2-digit', month: 'short', year: 'numeric', }).format(new Date())

    const optionsHtml = inventoryData.map(item =>
        `<li>${item.name}</li>`
    ).join('');
    console.log(optionsHtml);

    let tableHTML = '';
    tableHTML += `
            <tr >
            <td>
            <div class="combo-container">
                <input type="text" class="combo-input item-name" placeholder="Enter Name" >

                <ul class="combo-list">
                    ${optionsHtml}
                </ul>
            </div>
            </td>
            <td>
            <textarea class="item-desc" readonly></textarea></td>
            <td>
            <input type="number" class="item-qty" placeholder="Enter quantity" min="1" required>
            </td>
            <td>
            <input type="text" class="item-unit" readonly>
            </td>
            <td class="action-col">
            <button type="button" class="delete-btn">
            <img src="../asserts/icons8-trash-48.png"">
            </button>
            </td>
            </tr>
        `;
    tableBody.insertAdjacentHTML('beforeend', tableHTML);

    addItemButton.addEventListener('click', () => {
        let tableHTML = '';
        tableHTML += `
            <tr >
            <td>
            <div class="combo-container">
                <input type="text" class="combo-input item-name" placeholder="Enter Name" autocomplete="off" required>
                
                <ul class="combo-list">
                    ${optionsHtml}
                </ul>
            </div>
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
        tableBody.insertAdjacentHTML('beforeend', tableHTML);


    })

    tableBody.addEventListener('click', (e) => {
        console.log(e.target.tagName);

        if (e.target.tagName == 'IMG' || e.target.classList.contains('delete-btn')) {
            const row = e.target
                .closest('tr');
            row.remove();
        }
    })

    tableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('combo-input')) {
            const container = e.target.closest('.combo-container');
            const list = container.querySelector('.combo-list');
            const items = list.querySelectorAll('li');
            const enteredString = e.target.value.toLowerCase().trim();
            document.querySelectorAll('.combo-list').forEach(list => {
                list.style.display = 'none';
            }); 
            list.style.display = 'block';
            console.log(container,list,items);
            items.forEach(item => {
                let match = item.innerText.toLowerCase().includes(enteredString);
                item.style.display = match ? 'block' : 'none';
            });
        }
    });

    tableBody.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            const li = e.target;
            const container = li.closest('.combo-container');
            const input = container.querySelector('.combo-input');
            const list = container.querySelector('.combo-list');

            input.value = li.innerText;
            const name = input.value;
            list.style.display = 'none';

            const row = li.closest('tr');
            const descField = row.querySelector('.item-desc');
            const unitField = row.querySelector('.item-unit');

            const item = inventoryData.find(i => i.name == name);

            if (item) {
                descField.value = item.description;
                unitField.value = item.unit;
            }
        }
    });

    tableBody.addEventListener('input', (e) => {
        if (e.target.classList.contains('combo-input')) {
            const container = e.target.closest('.combo-container');
            const list = container.querySelector('.combo-list');
            const items = list.querySelectorAll('li');
            const enteredString = e.target.value.toLowerCase().trim();

            list.style.display = 'block';

            items.forEach(item => {
                let match = item.innerText.toLowerCase().includes(enteredString);
                item.style.display = match ? 'block' : 'none';
            });

        
        }
    });

    document.addEventListener('click', (e) => {
        if(!e.target.closest('.combo-container')){
            document.querySelectorAll('.combo-list').forEach(list => {
                list.style.display = 'none';
            }); 
        }
    });

    saveButton.addEventListener('click', (e) => {

        const itemArray = [];
        const tableRows = tableBody.querySelectorAll('tr');
        const formData = new FormData(requestform);
        const form = Object.fromEntries(formData);

        tableRows.forEach(row => {
            console.log(row.querySelector('.item-name').value);
            itemArray.push({
                name: row.querySelector('.item-name').value,
                quantity: row.querySelector('.item-qty').value,
            })
        })

        const newRequest = {
            id: form.id,
            subject: form.subject,
            requestedBy: form.requestedBy,
            requestedDate: new Intl.DateTimeFormat('en-In', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()),
            expectingDate: form.expectingDate,
            status: form.status,
            action: "notViewed"
        }


        const newRequestItems = {
            id: requestId,
            data: itemArray
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