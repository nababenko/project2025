//add new
document.addEventListener('DOMContentLoaded', function() {

    const form = document.getElementById('category');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(form);

        try {
            const response = await fetch('/admincategories/category', {
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
fetch('/admincategories/data')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('data');
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>${row.categories_id}</td>
            <td>${row.categories_name}</td>
            <td>${row.categories_description}</td>
            
            <td>
              <button onclick="editRow(${row.categories_id})">Edit</button>
              <button onclick="deleteRow(${row.categories_id})">Delete</button>
            </td>
          `;
            tableBody.appendChild(tr);
        });
    });



// Edit row in a table
function editRow(id) {
    fetch(`/admincategories/data/${id}`)
        .then(response => response.json())
        .then(rowData => {
            const form = document.createElement('form');
            form.innerHTML = `
                <input type="text" id="categories_name" name="categories_name" value="${rowData.categories_name}">
                <textarea id="categories_description" name="categories_description">${rowData.categories_description}</textarea>
                
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

                fetch(`/admincategories/edit/${id}`, {
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


    fetch(`/admincategories/delete/${id}`, {
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

