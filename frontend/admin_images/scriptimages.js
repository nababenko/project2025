//add new product
document.addEventListener('DOMContentLoaded', function() {
    // Fetch categories
    fetch('/adminimages/api/products')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('products_id');
            data.forEach(product => {
                const option = document.createElement('option');
                option.value = product.products_id;
                option.textContent = product.products_id;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching categories:', error));

    fetch('/adminimages/api/colors')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('colors_id');
            data.forEach(color => {
                const option = document.createElement('option');
                option.value = color.colors_id;
                option.textContent = color.colors_name;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching categories:', error));


    const form = document.getElementById('images');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(form);

        try {
            const response = await fetch('/adminimages/image', {
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
fetch('/adminimages/data')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('data');
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>${row.products_images_id}</td>
            <td>${row.products_images_pID}</td>
            <td>${row.products_images_cID}</td>
            <td>${row.products_images_link}</td>
            
            <td>
              <button onclick="editRow(${row.products_images_id})">Edit</button>
              <button onclick="deleteRow(${row.products_images_id})">Delete</button>
            </td>
          `;
            tableBody.appendChild(tr);
        });
    });



// Edit row in a table
function editRow(id) {
    fetch(`/adminimages/data/${id}`)
        .then(response => response.json())
        .then(rowData => {
            const form = document.createElement('form');
            form.innerHTML = `
                <select id="product_id" name="products_images_pID"></select>
                <select id="color_id" name="products_images_cID"></select>
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

            const productSelect = form.querySelector('#product_id');
            fetch('/adminimages/api/products')
                .then(response => response.json())
                .then(products => {
                    products.forEach(product => {
                        const option = document.createElement('option');
                        option.value = product.products_id;
                        option.textContent = product.products_id;
                        productSelect.appendChild(option);
                    });

                    productSelect.value = rowData.products_images_pID;
                })
                .catch(error => {
                    console.error('Error fetching edit products:', error);
                });
            const colorSelect = form.querySelector('#color_id');
            fetch('/adminimages/api/colors')
                .then(response => response.json())
                .then(colors => {
                    colors.forEach(color => {
                        const option = document.createElement('option');
                        option.value = color.colors_id;
                        option.textContent = color.colors_name;
                        colorSelect.appendChild(option);
                    });

                    colorSelect.value = rowData.products_images_cID;
                })
                .catch(error => {
                    console.error('Error fetching edit colors:', error);
                });

            form.addEventListener('submit', event => {
                event.preventDefault();
                const formData = new FormData(form);
                const updatedData = Object.fromEntries(formData.entries());

                fetch(`/adminimages/edit/${id}`, {
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


    fetch(`/adminimages/delete/${id}`, {
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