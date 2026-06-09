
function deleteItem(id) {
    let data = getItems();
    data = data.filter(item => item.id !== id);
    localStorage.setItem('inventoryData', JSON.stringify(data));
    console.log(id);
}

function addItem(newItem) {
    let data = getItems();
    data.push(newItem);
    localStorage.setItem('inventoryData', JSON.stringify(data));
}

function getItems() {
    return JSON.parse(localStorage.getItem('inventoryData')) || [];
    console.log("hi from db get items");
    
}

function editItem(editedItem) {
    let data = getItems();
    const id = editedItem.id;
    const index = data.findIndex(item => item.id === id);
    console.log(editedItem);
    data[index] = {
        ...data[index], ...editedItem
    }
    localStorage.setItem('inventoryData', JSON.stringify(data));
}

function getRequests(){
    return JSON.parse(localStorage.getItem('requestData'))||[];
}

function addRequest(newRequest){
    let data = getRequests();
    data.push(newRequest);
    localStorage.setItem('requestData', JSON.stringify(data));
    console.log(data);
    
}

function deleteRequest(id){
    let data =getRequests();
    data = data.filter(request => request.id !== id);
    localStorage.setItem('requestData', JSON.stringify(data));
    deleteRequestItem(id);
}

function editRequest(editedRequest){
    let data = getRequests();
    const id = editedRequest.id;
    const index = data.findIndex(request => request.id == id);
    data[index] = editedRequest;
    console.log(index);
    
    localStorage.setItem('requestData',JSON.stringify(data));
}




function getRequestItems(){
    return JSON.parse(localStorage.getItem('requestItemsData'))||[];
}

function addRequestItems(newRequestItems){
    let data = getRequestItems();
    data.push(newRequestItems);
    localStorage.setItem('requestItemsData',JSON.stringify(data));
    console.log(newRequestItems);
    
}

function editRequestItems(newRequestItems){
    let data = getRequestItems();
    console.log(data);
    
    const index = data.findIndex(requestItem => requestItem.id === newRequestItems.id);
    data[index] = newRequestItems;
    localStorage.setItem('requestItemsData',JSON.stringify(data));
    
}
