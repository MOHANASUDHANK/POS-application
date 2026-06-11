document.addEventListener("DOMContentLoaded",async () => {

    const addItemButton = document.getElementById('add-item-btn');
    const submitButton = document.getElementById('sub-btn');
    const saveButton = document.getElementById('save-btn');
    const cancelButton = document.getElementById('cancel-btn');
    const cancelModal = document.getElementById('cancel-modal');
    const cancelModalBack = document.getElementById('cancel-modal-back');
    const cancelModalConfirm = document.getElementById('cancel-modal-confirm');
    const requestform = document.getElementById('req-form');
    const tableBody = document.getElementById('item-list');
    const updateRequestBtn = document.getElementById('update-modal-confirm')
    const queryParam = new URLSearchParams(window.location.search);
    const id = queryParam.get("id");

    let data =await getRequests();
    let itemsData =await getRequestItems();
    let inventoryData =await getItems(); 

    const request = data.find(i => i.id == id);
    const requestItems = itemsData.find(i => i.id == id);

    if (request) {
        const requestedDate = request.requestedDate.split(',')[0];
        document.getElementById("id").value = request.id;
        document.getElementById("subject").value = request.subject;
        document.getElementById("requested_by").value = request.requestedBy;
        document.getElementById("requested_date").value = requestedDate;
        document.getElementById("expecting_delivery").value = new Date(request.expectingDate).toISOString().split("T")[0];;
        document.getElementById("status").value = request.status;
    }

    const optionsHtml = inventoryData.map(item =>
        `<option value="${item.name}">${item.name}</option>`
    ).join('');

    
    
    let tableHTML = '';
    if (requestItems) {
        requestItems.data.forEach(item => {

            const invMatch = inventoryData.find(i => i.name==item.name);

            // console.log('hi',inventoryData);
            const desc = invMatch.description;
            const unit = invMatch.unit;

            tableHTML += `
            <tr>
                <td>
                    <select class="item-name">
                        <option disabled>Select Name</option>
                        ${inventoryData.map(i => `<option value="${i.name}" ${i.name === item.name ? 'selected' : ''}>${i.name}</option>`).join('')}
                    </select>
                </td>
                <td>
                    <textarea class="item-desc" readonly>${desc}</textarea>
                </td>
                <td>
                    <input type="number" class="item-qty" placeholder="Enter quantity" value="${item.quantity}" min="1" required>
                </td>
                <td>
                    <input type="text" class="item-unit" value="${unit}">
                </td>
                
                <td class="action-col">
                    <button type="button" class="delete-btn">
                        <img src="../asserts/icons8-trash-48.png">
                    </button>
                </td>
            </tr>
            `;
        });
        tableBody.innerHTML = tableHTML;
    }


    addItemButton.addEventListener('click', () => {
        let newRowHTML = `
            <tr>
                <td>
                    <select class="item-name">
                        <option disabled selected>Select Name</option>
                        ${optionsHtml}
                    </select>
                </td>
                <td>
                    <textarea class="item-desc" readonly></textarea>
                </td>
                <td>
                    <input type="number" class="item-qty" placeholder="Enter quantity" min="1" required>
                </td>
                <td>
                    <input type="text" class="item-unit">
                </td>
                
                <td class="action-col">
                    <button type="button" class="delete-btn">
                        <img src="../asserts/icons8-trash-48.png">
                    </button>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('afterbegin', newRowHTML);
    });


    tableBody.addEventListener('change', (e) => {
        if (e.target.classList.contains('item-name')) {
            const name = e.target.value;
            const row = e.target.closest('tr');

            const descField = row.querySelector('.item-desc');
            const unitField = row.querySelector('.item-unit');

            const item = inventoryData.find(i => i.name === name);

            if (item) {
                descField.value = item.description || '';
                unitField.value = item.unit || '';
            }
        }
    });

    tableBody.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG' || e.target.classList.contains('delete-btn')) {
            const row = e.target.closest('tr');
            if (row) row.remove();
        }
    });

    updateRequestBtn.addEventListener('click', (e) => {
        const itemArray = [];
        const tableRows = tableBody.querySelectorAll('tr');
        const formData = new FormData(requestform);
        const form = Object.fromEntries(formData);

        tableRows.forEach(row => {
            itemArray.push({
                name: row.querySelector('.item-name').value,
                quantity: row.querySelector('.item-qty').value,
            });
        });

        const updatedRequest = {
            id: form.id,
            subject: form.subject,
            requestedBy: form.requestedBy,
            requestedDate: new Intl.DateTimeFormat('en-In', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()),
            expectingDate: form.expectingDate,
            status: form.status,
            action: "notViewed"
        };

        const updatedRequestItems = {
            id: id,
            data: itemArray
        };

        editRequest(updatedRequest);
        editRequestItems(updatedRequestItems);
        window.location.href = 'itemRequest.html';
    });

    if (submitButton) {
        submitButton.addEventListener('click', (e) => {
            const modal = document.getElementById('confirm-submit-modal');
            if (modal) modal.classList.remove('hide');
        });
    }

    cancelButton.addEventListener('click', () => {
        if (cancelModal) {
            cancelModal.classList.remove('hide');
        }
    });

    if (cancelModalBack) {
        cancelModalBack.addEventListener('click', () => {
            if (cancelModal) {
                cancelModal.classList.add('hide');
            }
        });
    }

    if (cancelModalConfirm) {
        cancelModalConfirm.addEventListener('click', () => {
            window.location.href = 'itemRequest.html';
        });
    }
});