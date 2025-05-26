
//output table
fetch('/adminreviews/data')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('data');
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>${row.reviews_id}</td>
            <td>${row.reviews_clients_id}</td>
            <td>${row.reviews_products_id}</td>
            <td>${row.reviews_date}</td>
            <td>${row.reviews_rate}</td>
            <td>${row.reviews_title}</td>
            <td>${row.reviews_comment}</td>
            
            <td>
              <button onclick="deleteRow(${row.reviews_id})">Delete</button>
            </td>
          `;
            tableBody.appendChild(tr);
        });
    });



//delete row from table
function deleteRow(id) {

    const confirmation = confirm('Are you sure you want to delete this row?');
    if (!confirmation) {
        return;
    }


    fetch(`/adminreviews/delete/${id}`, {
        method: 'POST'
    })
        .then(response => response.text())
        .then(message => {
            console.log(message);
            const deletedRow = document.getElementById(`row-${id}`);
            if (deletedRow) {
                deletedRow.remove();
            }
            alert("Data deleted successfully.");
            location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

