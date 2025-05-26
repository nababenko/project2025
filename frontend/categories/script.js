document.addEventListener("DOMContentLoaded", function () {

    fetch('/categories/categories_lst')
        .then(response => response.json())
        .then(categories => {
            const listElement = document.getElementById('list');
            categories.forEach(category => {
                const categoryElement = document.createElement('div');
                categoryElement.classList.add('content');
                categoryElement.innerHTML = `<a class="category" href="/category/${category.categories_name}">${category.categories_name}</a>`;
                listElement.appendChild(categoryElement);
            });
        })
        .catch(error => console.error('Error fetching:', error));

});