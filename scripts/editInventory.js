document.addEventListener("DOMContentLoaded", () => {

    const uploadBox = document.getElementById('uploadBox');
    const fileInput = document.getElementById('file-upload');
    const stateEmpty = document.getElementById('stateEmpty');
    const statePreview = document.getElementById('statePreview');
    const imgPreview = document.getElementById('imgPreview');
    const editForm = document.getElementById('edit-form');
    const deleteButton = document.getElementById('delete-modal-confirm');
    const cancelButton = document.getElementById('cancel-btn');
    const cancelModal = document.getElementById('cancel-modal');
    const cancelModalBack = document.getElementById('cancel-modal-back');
    const cancelModalConfirm = document.getElementById('cancel-modal-confirm');
    const updateButton = document.getElementById('update-modal-confirm');
    const queryParam = new URLSearchParams(window.location.search);
    const id = queryParam.get("id");
    let data = getItems();
    let imageString = null;
    console.log(data);
    const item = data.find(i => i.id === id)
    console.log(item);
    if (item) {
        document.getElementById("id").value = item.id;
        document.getElementById("itemName").value = item.name;
        document.getElementById("category").value = item.category;
        document.getElementById("description").value = item.description;
        document.getElementById("price").value = item.price;
        document.getElementById("inStock").value = item.stock;
        document.getElementById("status").value = item.status;
        document.getElementById("imgPreview").src = item.image;
        document.getElementById("unit").value = item.unit;
        imageString = item.image;
    }


    console.log(typeof (id));

    let objectUrl = null;

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

    updateButton.addEventListener('click', (e) => {
        e.preventDefault();


        const formData = new FormData(editForm);
        const form = Object.fromEntries(formData);
        console.log(form);
        const editedItem = {
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
            lastUpdated: new Intl.DateTimeFormat('en-In', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date())
        }
        console.log(5);

        editItem(editedItem);
        window.location.href = "inventory.html"
    })

    deleteButton.addEventListener('click', () => {
        deleteItem(id);
        window.location.href='inventory.html'
    });

    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            if (cancelModal) {
                cancelModal.classList.remove('hide');
            }
        });
    }

    if (cancelModalBack) {
        cancelModalBack.addEventListener('click', () => {
            if (cancelModal) {
                cancelModal.classList.add('hide');
            }
        });
    }

    if (cancelModalConfirm) {
        cancelModalConfirm.addEventListener('click', () => {
            window.location.href = 'Inventory.html';
        });
    }
});