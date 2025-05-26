//add new
document.addEventListener('DOMContentLoaded', function() {

    const form = document.getElementById('product');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(form);

        try {
            const response = await fetch('/admincolors/colors-products-add', {
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
    fetch('/admincolors/api/products')
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
    fetch('/admincolors/colorsdata')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('color_id');
            data.forEach(category => {
                const option = document.createElement('option');
                option.value = category.colors_id;
                option.textContent = category.colors_name;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching c_id:', error));

    const form2 = document.getElementById('color');
    form2.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(form2);

        try {
            const response = await fetch('/admincolors/colors', {
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
fetch('/admincolors/colorsdata')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('data');
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>${row.colors_id}</td>
            <td>${row.colors_name}</td>
            <td>${row.colors_hex}</td>
            
            <td>
              <button onclick="editRow(${row.colors_id})">Edit</button>
              <button onclick="deleteRow(${row.colors_id})">Delete</button>
            </td>
          `;
            tableBody.appendChild(tr);
        });
    });
fetch('/admincolors/colors-products')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('data_pc');
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>${row.products_colors_cID}</td>
            <td>${row.products_colors_pID}</td>
            
            <td>
              <button onclick="deleteRowpc(${row.products_colors_cID},${row.products_colors_pID})">Delete</button>
            </td>
          `;
            tableBody.appendChild(tr);
        });
    });


// Edit row in a table
function editRow(id) {
    fetch(`/admincolors/data/${id}`)
        .then(response => response.json())
        .then(rowData => {
            const form = document.createElement('form');
            form.innerHTML = `
                <label for="colors_name">Name:</label>
                <input type="text" id="colors_name" name="colors_name" value="${rowData.colors_name}" required>

                <label for="colors_hex">HEX:</label>
                <input type="text" id="colors_hex" name="colors_hex" value="${rowData.colors_hex}" required>
                
                <button type="submit">Save</button>
            `;

            const modal = document.createElement('div');
            modal.classList.add('modal-overlay');

            const modalContent = document.createElement('div');
            modalContent.classList.add('modal-content');
            modalContent.style.position = 'relative';

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

            modalContent.appendChild(closeButton);
            modalContent.appendChild(form);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);

            form.addEventListener('submit', event => {
                event.preventDefault();

                const formData = new FormData(form);


                fetch(`/admincolors/colorsedit/${id}`, {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.text())
                    .then(message => {
                        console.log('Response:', message);
                        alert("Data updated successfully.");
                        modal.remove();
                        location.reload();
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Update failed.');
                    });
            });
        })
        .catch(error => {
            console.error('Error loading row:', error);
            alert('Error loading data for editing.');
        });
}


//delete row from table
function deleteRow(id) {

    const confirmation = confirm('Are you sure you want to delete this row?');
    if (!confirmation) {
        return;
    }


    fetch(`/admincolors/colorsdelete/${id}`, {
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
//delete row from table products colors
function deleteRowpc(c_id, p_id) {

    const confirmation = confirm('Are you sure you want to delete this row?');
    if (!confirmation) {
        return;
    }


    fetch(`/admincolors/colorsproductsdelete/${c_id}/${p_id}`, {
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
