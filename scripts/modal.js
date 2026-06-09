document.addEventListener('DOMContentLoaded', () => {

    const confDeleteModal = document.getElementById('delete-modal')
    const submittedButton = document.getElementById('submitted');
    const submitedModal = document.getElementById('submited-modal')
    const confSubCancelButton = document.getElementById('conf-sub-cancel');
    const confirmSubmitModal = document.getElementById('confirm-submit-modal')
    const confSubButton = document.getElementById('conf-sub');
    const confDelButton = document.getElementById('del-btn');
    const URLParam = new URLSearchParams(window.location.search);
    const addForm = document.getElementById('add-form');
    const confAddModal = document.getElementById('inventory-save-modal');
    const confCancelModal = document.getElementById('cancel-modal');
    const cancelButton = document.getElementById('cancel-btn');
    const confCancelBtn = document.getElementById('cancel-modal-confirm');
    const confCancelBackBtn = document.getElementById('modal-back');
    const confSubBtn = document.getElementById('sub-btn');
    const confReqSubModal = document.getElementById('request-submit-modal');
    const confSaveReqBtn = document.getElementById('req-save-btn');
    const reqSaveModal = document.getElementById('request-save-modal');
    const confDeleteBtn = document.getElementById('inventory-delete');
    const confUpdateBtn = document.getElementById('update-btn');
    const confUpdateModel = document.getElementById('update-modal');




    if (addForm) {
        addForm.addEventListener('submit', (e) => {
            e.preventDefault();
            confAddModal.showModal();
        })
    }
    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            confCancelModal.showModal();
            console.log(confCancelModal);
        })
    }
    if (confCancelBtn) {
        confCancelBtn.addEventListener('click', () => {
            if (document.referrer !== "") {
                window.history.back();
            }
            else {
                window.location.href = "inventory.html"
            }
        })
    }


    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-close')) {
            const activeModal = e.target.closest('dialog');
            activeModal.close();
        }
    })
    if (confSubBtn) {
        confSubBtn.addEventListener('click', () => {
            if (confReqSubModal) {
                confReqSubModal.showModal();
            }
        })
    }

    if (confSaveReqBtn) {
        confSaveReqBtn.addEventListener('click', () => {
            if (reqSaveModal) {
                reqSaveModal.showModal();
            }
        })

    }

    if (confDeleteBtn) {
        console.log('hi');
        
        confDeleteBtn.addEventListener('click', () => {
            if (confDeleteModal) {
                confDeleteModal.showModal();
            }
        })
    }

    if(confUpdateBtn){
        
        
        confUpdateBtn.addEventListener('click',()=>{console.log('hi2');
            if(confUpdateModel){
                confUpdateModel.showModal();
            }
        })
    }

})