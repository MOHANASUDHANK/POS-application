document.addEventListener("DOMContentLoaded",async () => {
    const uploadBox = document.getElementById('uploadBox');
    const fileInput = document.getElementById('file-upload');
    const stateEmpty = document.getElementById('stateEmpty');
    const statePreview = document.getElementById('statePreview');
    const imgPreview = document.getElementById('imgPreview');
    const addForm = document.getElementById('add-form');
    const cancelButton = document.getElementById('cancel-btn');
    const saveButton = document.getElementById('save-btn');
    const idField = document.getElementById('id');
    const stockField = document.getElementById('stock');
    const statusField = document.getElementById('status');
    const cancelModal = document.getElementById('cancel-modal');
    const cancelModalBack = document.getElementById('cancel-modal-back');
    const cancelModalConfirm = document.getElementById('cancel-modal-confirm');
    const confSaveButton = document.getElementById('save-modal-confirm');
    const confAddModal = document.getElementById('inventory-save-modal');
    const confSaveBackButton = document.getElementById('save-modal-back');

    let itemId = "ITM-000001"
    let objectUrl = null;
    let imageString = null;
    let data =await getItems()

    if (data.length != 0) {
        const lastId = data[data.length - 1].id;
        const arr = lastId.split('-');
        itemId = arr[0] + '-' + String(parseInt(arr[1]) + 1).padStart(6, '0');
    }
    idField.value = itemId;

    stockField.addEventListener('input', () => {
        if (stockField.value > 25) {
            statusField.value = 'In Stock';
        }
        else if (stockField.value > 0) {
            statusField.value = 'Low Stock';
        }
        else {
            statusField.value = 'Out Of Stock';
        }
    })

    uploadBox.addEventListener('click', (e) => {
        if (e.target.id === 'stateEmpty') return;

        fileInput.click();
    });

    fileInput.addEventListener('change', () => {

        processFile(fileInput.files[0]);

    });

    function processFile(file) {
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
        }

        objectUrl = URL.createObjectURL(file);
        imgPreview.src = objectUrl;

        const reader = new FileReader();
        reader.onloadend = () => {
            imageString = reader.result;
        }

        reader.readAsDataURL(file);

        if (stateEmpty) stateEmpty.classList.add('hidden');
        if (statePreview) statePreview.classList.remove('hidden');
    }

    

    confSaveButton.addEventListener('click', () => {
        const formData = new FormData(addForm);
        const form = Object.fromEntries(formData);
        console.log('add-item-conf-btn');
        
        const newItem = {
            id: form.id,
            name: form.name,
            image: imageString,
            description: form.description,
            category: form.category,
            price: form.price,
            unit: form.unit,
            stock: form.stock,
            status: form.status,
            supplier: form.supplier,
            sold: 0,
            purchased: form.stock,
            lastUpdated: new Intl.DateTimeFormat('en-In', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date())
        }
        addItem(newItem);
        window.location.href = 'Inventory.html';

    })
  
});