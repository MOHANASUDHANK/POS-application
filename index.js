document.addEventListener("DOMContentLoaded", () => {
    const menuLinks = document.querySelectorAll(".nav-menu li");
    const contentFrame = document.getElementById("content-frame");

    menuLinks.forEach(link =>{
        link.addEventListener('click',(e)=>{
            e.preventDefault();
            menuLinks.forEach(l=>l.classList.remove('active'));
            link.classList.add('active');
            const page = link.getAttribute('data-page');
            console.log(page)
            if(page){
                loadPage(page)
            }
        })
        
    })

    function loadPage(page){

    }

    // const deleteCancelButton = document.getElementById('del-cancel');
    // const deleteModal = document.getElementById('delete-modal')
    // deleteCancelButton.addEventListener("click",()=>{
    //     deleteModal.classList.add('hide')
    // })
    // const submittedButton = document.getElementById('submitted');
    // const submitedModal = document.getElementById('submited-modal')
    // submittedButton.addEventListener("click",()=>{
    //     submitedModal.classList.add('hide')
    // })
    // const confSubCancelButton = document.getElementById('conf-sub-cancel');
    // const confirmSubmitModal = document.getElementById('confirm-submit-modal')
    // confSubCancelButton.addEventListener("click",()=>{
    //     confirmSubmitModal.classList.add('hide')
    // })
    // const confSubButton = document.getElementById('conf-sub');
    // confSubButton.addEventListener("click",()=>{
    //     confirmSubmitModal.classList.add('hide')
    //     submitedModal.classList.remove('hide')
    // })

});

