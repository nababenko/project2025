const productWrapper = document.querySelector('.product_wrapper');
const sortSelect = document.getElementById('sort');
const designerFilterContainer = document.getElementById('designer-options');
const controlsInfo = document.querySelector('#controls .control');
const pathParts = window.location.pathname.split('/');
const categoryName = decodeURIComponent(pathParts[pathParts.length - 1]);

document.addEventListener('DOMContentLoaded', async () => {
    await loadDesignerFilters();
    await loadProducts();

    sortSelect.addEventListener('change', loadProducts);
    designerFilterContainer.addEventListener('change', loadProducts);
});

async function loadDesignerFilters() {
    try {
        const res = await fetch('/admin/data');
        const designers = await res.json();
        designerFilterContainer.innerHTML = '';

        designers.forEach(designer => {
            const li = document.createElement('li');
            li.innerHTML = `
                <label>
                    <input type="checkbox" value="${designer.products_designer}"> ${designer.products_designer}
                </label>`;
            designerFilterContainer.appendChild(li);
        });
    } catch (err) {
        console.error('Error loading designers:', err);
    }
}

async function loadProducts() {
    const sortValue = sortSelect.value;
    const selectedDesigners = Array.from(
        designerFilterContainer.querySelectorAll('input[type=checkbox]:checked')
    ).map(input => input.value);

    const params = new URLSearchParams();

    // Додаємо параметри сортування
    if (sortValue) {
        const [field, order] = sortValue.split('-');
        params.set('sortField', field);
        params.set('sortOrder', order);
    }

    // Додаємо дизайнерів
    selectedDesigners.forEach(name => params.append('designer', name));

    const url = `/category/${categoryName}/products?${params.toString()}`;
    console.log("Fetching:", url); // DEBUG

    try {
        const res = await fetch(url);
        const products = await res.json();

        if (!Array.isArray(products)) {
            throw new Error('Invalid products format');
        }

        renderProducts(products);
    } catch (err) {
        console.error('Error loading products:', err);
        productWrapper.innerHTML = '<p class="error">Failed to load products.</p>';
    }
}

function renderProducts(products) {
    productWrapper.innerHTML = '';
    controlsInfo.textContent = `${products.length} Results`;

    if (products.length === 0) {
        productWrapper.innerHTML = '<p>No products found.</p>';
        return;
    }

    products.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
            <span class="reaction">
                <button class="like" data-action="like"><i class="fa-regular fa-heart"></i></button>
                <button class="bucket" data-action="addToCart"><i class="fa-solid fa-basket-shopping"></i></button>
            </span>
            <img src="${product.products_cover}" alt="${product.products_name}">
            <p class="designer">${product.products_designer}</p>
            <p class="name">${product.products_name} <span class="rights">${product.products_price}$</span></p>
        `;
        productWrapper.appendChild(div);
    });
}


function toggleFilterAttr(id) {
    const el = document.getElementById(id);
    el.classList.toggle('show');
}