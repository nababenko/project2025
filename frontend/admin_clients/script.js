
//output table
document.addEventListener('DOMContentLoaded', () => {
    fetch('/adminclients/clientsdata')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('data_clients');
            data.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row.clients_id}</td>
                    <td>${row.clients_email}</td>
                    <td>${row.clients_name}</td>
                    <td>${row.clients_surname}</td>
                    <td>
                        <button onclick="deleteRow(${row.clients_id})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Error fetching client data:', error);
        });
});



//delete row from table
function deleteRow(id) {

    const confirmation = confirm('Are you sure you want to delete this row?');
    if (!confirmation) {
        return;
    }


    fetch(`/adminclients/clientsdelete/${id}`, {
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

