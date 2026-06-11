document.addEventListener("DOMContentLoaded", async() => {
    const tableBody = document.getElementById("request-data");
    const addBtn = document.getElementById("add-btn");
    let data =await getRequests();
    
            let tableHTML = "";
            let date = null
            data.forEach(request => {console.log(data);
                if(request.expectingDate)
                 date = new Intl.DateTimeFormat('en-In', { day: '2-digit', month: 'short', year: 'numeric',  }).format(new Date(request.expectingDate))
                
                
                let statusClass = "green";
                if      (request.status == "Pending")      statusClass = "orange";
                else if (request.status == "On the way")   statusClass = "blue";
                else if (request.status == "Canceled")     statusClass = "red"
                let action = "../asserts/icons8-eye-24.png";
                tableHTML += `
                    <tr>
                    <td><a href='editRequest.html?id=${request.id}'>${request.id}<a/></td>
                    <td>${request.subject}</td>
                    <td>${request.requestedBy}</td>
                    <td>${request.requestedDate}</td>
                    <td>${date}</td>
                    <td><span class="${statusClass}">${request.status}</span></td>
                    <td><a href='editRequest.html?id=${request.id}'><img src="${action}"</a></td>
                    </tr>
                `
            });
            tableBody.innerHTML = tableHTML;
        
    addBtn.addEventListener('click',()=>{
        window.location.href="addRequest.html";
    })
})