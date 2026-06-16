
async function deleteItem(id) {
    let data =await getItems();
    data = data.filter(item => item.id !== id);
    localStorage.setItem('inventoryData', JSON.stringify(data));
    console.log(id);
}

async function addItem(newItem) {
    let data =await getItems();
    data.push(newItem);
    localStorage.setItem('inventoryData', JSON.stringify(data));
}
async function getItemsJSON(){
       let data=null;
 await fetch('../DB/inventory.json').then(res=>data=res.json()).catch(e=>console.log(e));
 return data;
}

function getItems() {
   let data=null;
   data =JSON.parse( localStorage.getItem('inventoryData'));
//    console.log(data);
//     fetch('../DB/inventory.json').then(res=>data=res.json()).catch(e=>console.log(e))
    return   data;
}


async function editItem(editedItem) {
    let data =await getItems();
    const id = editedItem.id;
    const index = data.findIndex(item => item.id == id);
    console.log(editedItem);
    data[index] = {
        ...data[index], ...editedItem
    }
    localStorage.setItem('inventoryData', JSON.stringify(data));
}

async function getRequests(){
     let data=null;
        data =JSON.parse( localStorage.getItem('requestData'));

//    await fetch('../DB/request.json').then(res=>data=res.json()).catch(e=>console.log(e))
    return   data;
}

async function addRequest(newRequest){
    let data =await getRequests();
    data.push(newRequest);
    localStorage.setItem('requestData', JSON.stringify(data));
    console.log(data);
    
}

async function deleteRequest(id){
    let data =await getRequests();
    data = data.filter(request => request.id != id);
    localStorage.setItem('requestData', JSON.stringify(data));
    deleteRequestItem(id);
}

async function editRequest(editedRequest){
    let data =await getRequests();
    const id = editedRequest.id;
    const index = data.findIndex(request => request.id == id);
    data[index] = editedRequest;
    console.log(index);
    
    localStorage.setItem('requestData',JSON.stringify(data));
}




 function getRequestItems(){
    let data=null;
       data =JSON.parse( localStorage.getItem('requestItemsData'));
console.log(data);

//    await fetch('../DB/requestItems.json').then(res=>data=res.json()).catch(e=>console.log(e))
    return   data;
}

async function addRequestItems(newRequestItems){
    let data =await getRequestItems();
    data.push(newRequestItems);
    localStorage.setItem('requestItemsData',JSON.stringify(data));
    console.log(newRequestItems);
    
}

async function editRequestItems(newRequestItems){
    let data =await getRequestItems();
    console.log(data);
    
    const index =await data.findIndex(requestItem => requestItem.id === newRequestItems.id);
    data[index] = newRequestItems;
    localStorage.setItem('requestItemsData',JSON.stringify(data));
}

async function getBills(){
    let data = null;
    await fetch('../DB/sales.json').then(res=>data=res.json()).catch(e=>console.log(e))
    return data;
}

async function getBillItems(){
    let data = null;
  await   fetch('../DB/billItems.json').then(res=>data=res.json())
    return data;
}