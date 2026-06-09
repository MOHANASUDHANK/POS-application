document.addEventListener('DOMContentLoaded',()=>{
    const tableBody = document.getElementById('report-data');
    fetch("../DB/report.json")
    .then(data=>data.json())
    .then(data=>{
        let tableHTML = "";
        data.forEach(data=>{
            tableHTML+=`
            <tr>
            <td>${data.name}</td>
            <td>${data.quantity}</td>
            <td>$${data.price}</td>
            </tr>
            `
        });
        tableBody.innerHTML=tableHTML;
    })
})