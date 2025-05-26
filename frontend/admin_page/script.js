//проблеми з редагуванням через дату



//add new product
document.addEventListener('DOMContentLoaded', function() {
    // Fetch categories
    fetch('/admin/api/categories')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('product_category');
            data.forEach(category => {
                const option = document.createElement('option');
                option.value = category.categories_id;
                option.textContent = category.categories_name;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching categories:', error));


    const form = document.getElementById('product');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(form);

        try {
            const response = await fetch('/admin/product', {
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
fetch('/admin/data')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('data');
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>${row.products_id}</td>
            <td>${row.products_name}</td>
            <td>${row.products_designer}</td>
            <td>${row.products_description}</td>
            <td>${row.products_cover}</td>
            <td>${row.products_price}</td>
            <td>${row.products_categories_id}</td>
            
            <td>
              <button onclick="editRow(${row.products_id})">Edit</button>
              <button onclick="deleteRow(${row.products_id})">Delete</button>
            </td>
          `;
            tableBody.appendChild(tr);
        });
    });



// Edit row in a table
function editRow(id) {
    fetch(`/admin/data/${id}`)
        .then(response => response.json())
        .then(rowData => {
            const form = document.createElement('form');
            form.innerHTML = `
                <input type="text" id="products_name" name="products_name" value="${rowData.products_name}">
                <input type="text" id="products_designer" name="products_designer" value="${rowData.products_designer}">
                <textarea id="products_description" name="products_description">${rowData.products_description}</textarea>
                <input type="text" id="products_cover" name="products_cover" value="${rowData.products_cover}">
                <input type="number" id="products_price" name="products_price" step="0.01" value="${rowData.products_price}">                                
                <select id="products_categories_id" name="products_categories_id"></select>
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

            const categorySelect = form.querySelector('#products_categories_id');

            fetch('/admin/api/categories')
                .then(response => response.json())
                .then(categories => {
                    categories.forEach(category => {
                        const option = document.createElement('option');
                        option.value = category.categories_id;
                        option.textContent = category.categories_name;
                        categorySelect.appendChild(option);
                    });

                    categorySelect.value = rowData.products_categories_id;
                })
                .catch(error => {
                    console.error('Error fetching categories:', error);
                });

            form.addEventListener('submit', event => {
                event.preventDefault();
                const formData = new FormData(form);
                const updatedData = Object.fromEntries(formData.entries());

                fetch(`/admin/edit/${id}`, {
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
}

//delete row from table
function deleteRow(id) {

    const confirmation = confirm('Are you sure you want to delete this row?');
    if (!confirmation) {
        return;
    }


    fetch(`/admin/delete/${id}`, {
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


//check if file is loaded
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('link');
    const customFileUpload = document.querySelector('.custom-file-upload');

    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            customFileUpload.classList.add('uploaded');
        } else {
            customFileUpload.classList.remove('uploaded');
        }
    });
});