document.addEventListener("DOMContentLoaded", async () => {

    const tableBody = document.getElementById("request-data");
    const addBtn = document.getElementById("add-btn");
    const idField = document.getElementById('id');
    const subjectField = document.getElementById('subject');
    const requestedByField = document.getElementById('requested-by');
    const fromDate = document.getElementById('fromDate');
    const toDate = document.getElementById('toDate');
    const excelBtn = document.querySelector('.excel-btn');
    const filterBtn = document.querySelector('.filter-btn');
    const resetBtn = document.querySelector('.reset-btn');

    let data = await getRequests();

    const idComboList = document.querySelector('.id-combo-list');
    const requestedByComboList = document.querySelector('.requestedBy-combo-list');

    idComboList.innerHTML = data.map(request => `<li>${request.id}</li>`).join('');

    const uniqueRequestedBy = [...new Set(data.map(req => req.requestedBy))];
    requestedByComboList.innerHTML = uniqueRequestedBy.map(name => `<li>${name}</li>`).join('');


    const table = new DataTable('#request-table', {
        data: data,
        layout: {
            topStart: null,
            topEnd: null,
            top: null,
            bottom: {
                features: ['pageLength', 'paging', 'info'],
                className: 'custom-bottom-wrapper'
            },
            bottomStart: null,
            bottomEnd: null
        },
        buttons: [
            {
                extend: 'excelHtml5',
                title: 'Request Data Report',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5],
                    format: {
                        body: function (data) {
                            return data.replace(/<\/?[^>]+(>|$)/g, "").trim()
                        }
                    }
                }
            }
        ],
        columns: [
            {
                data: 'id',
                render: function (data) {
                    return `
                    <a href='editRequest.html?id=${data}'>${data}</a>`
                }
            }, {
                data: 'subject'
            }, {
                data: 'requestedBy'
            }, {
                data: 'requestedDate'
            }, {
                data: 'expectingDate',
                render: function (data) {
                    const date = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(data));
                    return date
                }
            }, {
                data: 'status',
                className: 'statusClass'
            }, {
                data: null,
                orderable: false,
                render: function (_, _, data) {
                    return `<a href='editRequest.html?id=${data.id}'><img src="../asserts/icons8-eye-24.png"></a>`
                }
            }
        ]

    })

    $.fn.dataTable.ext.search.push(function (settings, searchData, index, rowData) {
        const idVal = idField.value.trim().toLowerCase();
        const subjectVal = subjectField.value.trim().toLowerCase();
        const requestedByVal = requestedByField.value.trim().toLowerCase();
        const fromDateVal = fromDate.value;
        const toDateVal = toDate.value;

        if (idVal && !rowData.id.toLowerCase().includes(idVal)) {
            return false;
        }
        if (subjectVal && !rowData.subject.toLowerCase().includes(subjectVal)) {
            return false;
        }
        if (requestedByVal && !rowData.requestedby.toLowerCase().includes(requestedByVal)) {
            return false;
        }
        if (fromDateVal && toDateVal) {
            const itemDate = new Date(rowData.requestedDate);
            const startDate = new Date(fromDateVal);
            const endDate = new Date(toDateVal);
            itemDate.setHours(0, 0, 0, 0);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);

            if (itemDate < startDate || itemDate > endDate) {
                return false;
            }

        }
        return true;
    });


    excelBtn.addEventListener('click', () => {
        table.button('.buttons-excel').trigger();
    })


    resetBtn.addEventListener('click', () => {
        idField.value = "";
        subjectField.value = "";
        requestedByField.value = "";
        fromDate.value = "";
        toDate.value = "";
        table.draw();
    })























    idField.addEventListener('click', () => {
        idComboList.style.display = 'block';
    });

    idField.addEventListener('input', (e) => {
        const enteredString = e.target.value.toLowerCase().trim();
        const items = idComboList.querySelectorAll('li');
        items.forEach(item => {
            let isMatched = item.innerText.toLowerCase().includes(enteredString);
            item.style.display = isMatched ? 'block' : 'none';
        });
    });

    idComboList.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            idField.value = e.target.innerHTML;
            idComboList.style.display = 'none';
        }
    });

    requestedByField.addEventListener('click', () => {
        requestedByComboList.style.display = 'block';
    });

    requestedByField.addEventListener('input', (e) => {
        const enteredString = e.target.value.toLowerCase().trim();
        const items = requestedByComboList.querySelectorAll('li');
        items.forEach(item => {
            let isMatched = item.innerText.toLowerCase().includes(enteredString);
            item.style.display = isMatched ? 'block' : 'none';
        });
    });

    requestedByComboList.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            requestedByField.value = e.target.innerHTML;
            requestedByComboList.style.display = 'none';
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.combo-container')) {
            idComboList.style.display = 'none';
            requestedByComboList.style.display = 'none';
        }
    });

    filterBtn.addEventListener('click', () => {
        table.draw()
    })

    // filterBtn.addEventListener('click', () => {
    //     const idVal = idField.value.trim().toLowerCase();
    //     const subjectVal = subjectField.value.trim().toLowerCase();
    //     const requestedByVal = requestedByField.value.trim().toLowerCase();
    //     const fromDateVal = fromDate.value;
    //     const toDateVal = toDate.value;


    //     const filteredData = data.filter(request => {
    //         if (idVal && !request.id.toLowerCase().includes(idVal)) {
    //             return false;
    //         }
    //         if (subjectVal && !request.subject.toLowerCase().includes(subjectVal)) {
    //             return false;
    //         }
    //         if (requestedByVal && !request.requestedBy.toLowerCase().includes(requestedByVal)) {
    //             return false;
    //         }
    //         if(fromDate && toDate){
    //             if(new Date(request.requestedDate) < new Date(fromDateVal) || new Date(request.requestedDate) > new Date(toDateVal)){
    //                 return false;
    //             }
    //         }

    //         return true;
    //     });

    //      let tableHTML = "";
    //     let date = null;
    //     filteredData.forEach(request => {
    //         if (request.expectingDate) {
    //             date = new Intl.DateTimeFormat('en-In', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(request.expectingDate));
    //         } else {
    //             date = "";
    //         }

    //         let statusClass = "green";
    //         if (request.status == "Pending") statusClass = "orange";
    //         else if (request.status == "On the way") statusClass = "blue";
    //         else if (request.status == "Canceled") statusClass = "red";

    //         let action = "../asserts/icons8-eye-24.png";
    //         tableHTML += `
    //             <tr>
    //             <td><a href='editRequest.html?id=${request.id}'>${request.id}</a></td>
    //             <td>${request.subject}</td>
    //             <td>${request.requestedBy}</td>
    //             <td>${request.requestedDate}</td>
    //             <td>${date}</td>
    //             <td><span class="${statusClass}">${request.status}</span></td>
    //             <td><a href='editRequest.html?id=${request.id}'><img src="${action}"</a></td>
    //             </tr>
    //         `;
    //     });
    //     tableBody.innerHTML = tableHTML;        
    // });

    // resetBtn.addEventListener('click', () => {
    //     idField.value = "";
    //     subjectField.value = "";
    //     requestedByField.value = "";
    //     fromDate.value = "";
    //     toDate.value = "";
    //     filterBtn.click();
    // });

    addBtn.addEventListener('click', () => {
        window.location.href = "addRequest.html";
    });
    table.on('draw',function(){
        const count = table.rows({filter:'applied'}).count();
        document.getElementById('total-count').innerText=`Total ${count} Request found`
    })

    // filterBtn.click();
});