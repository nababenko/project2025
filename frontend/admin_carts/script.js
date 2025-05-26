//add new product
document.addEventListener('DOMContentLoaded', function() {

    const form = document.getElementById('cart');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(form);

        try {
            const response = await fetch('/admincarts/carts', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                location.reload();
            } else {
                alert(result.error);
            }
        } catch (error) {
            alert('An unexpected error occurred');
            console.error(error);
        }
    });
    fetch('/admincarts/api/clients')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('client_id');
            data.forEach(category => {
                const option = document.createElement('option');
                option.value = category.clients_id;
                option.textContent = category.clients_id;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching client_id:', error));
    fetch('/admincarts/api/products')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('cproduct_id');
            data.forEach(category => {
                const option = document.createElement('option');
                option.value = category.products_id;
                option.textContent = category.products_id;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching p_id:', error));
    fetch('/admincarts/cartsdata')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('carts_id');
            data.forEach(category => {
                const option = document.createElement('option');
                option.value = category.carts_id;
                option.textContent = category.carts_id;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching c_id:', error));

    const form2 = document.getElementById('cp');
    form2.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(form);

        try {
            const response = await fetch('/admincarts/carts-products-add', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                location.reload();
            } else {
                alert(result.error);
            }
        } catch (error) {
            alert('An unexpected error occurred');
            console.error(error);
        }
    });

});

//output table
fetch('/admincarts/cartsdata')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('data_carts');
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>${row.carts_id}</td>
            <td>${row.carts_clients_id}</td>
            <td>${row.carts_date}</td>
            
            <td>
              <button onclick="editRow(${row.carts_id})">Edit</button>
              <button onclick="deleteRow(${row.carts_id})">Delete</button>
            </td>
          `;
            tableBody.appendChild(tr);
        });
    });
fetch('/admincarts/carts-products')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('data_cartsp');
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>${row.carts_products_id}</td>
            <td>${row.carts_products_cID}</td>
            <td>${row.carts_products_pID}</td>
            <td>${row.carts_products_quantity}</td>
            
            <td>
              <button onclick="">Edit</button>
              <button onclick="">Delete</button>
            </td>
          `;
            tableBody.appendChild(tr);
        });
    });


// Edit row in a table
/*function editRow(id) {
    fetch(`/adminclients/data/${id}`)
        .then(response => response.json())
        .then(rowData => {
            const form = document.createElement('form');
            form.innerHTML = `
                <input type="text" id="name" name="name" value="${rowData.colors_name}">
                <input type="text" id="hex" name="hex" value="${rowData.colors_hex}">

                <button type="submit">Save</button>
            `;

            const modal = document.createElement('div');
            modal.classList.add('modal-overlay');

            const modalContent = document.createElement('div');
            const closeButton = document.createElement('span');
            closeButton.textContent = '×';
            closeButton.style.cssText = `
                position: absolute;
                top: 10px;
                right: 15px;
                font-size: 20px;
                cursor: pointer;
                color: #888;
            `;
            closeButton.onclick = () => modal.remove();
            modalContent.style.position = 'relative';
            modalContent.appendChild(closeButton);
            modalContent.classList.add('modal-content');
            modalContent.appendChild(form);

            modal.appendChild(modalContent);
            document.body.appendChild(modal);


            form.addEventListener('submit', event => {
                event.preventDefault();
                const formData = new FormData(form);
                const updatedData = Object.fromEntries(formData.entries());

                fetch(`/admin/colorsedit/${id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedData)
                })
                    .then(response => response.text())
                    .then(message => {
                        console.log(message);
                        modal.remove();
                        alert("Data updated successfully.");
                        location.reload();
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}*/

//delete row from table
function deleteRow(id) {

    const confirmation = confirm('Are you sure you want to delete this row?');
    if (!confirmation) {
        return;
    }


    fetch(`/adminclients/cartsdelete/${id}`, {
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

// add script for edit and delete rows im products_colors
