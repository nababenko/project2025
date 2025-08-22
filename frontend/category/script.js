const productWrapper = document.querySelector('.product_wrapper');
const sortSelect = document.getElementById('sort');
const designerFilterContainer = document.getElementById('designer-options');
const colorsFilterContainer = document.getElementById('colors-options');
const controlsInfo = document.querySelector('#controls .control');
const pathParts = window.location.pathname.split('/');
const categoryName = decodeURIComponent(pathParts[pathParts.length - 1]);



document.addEventListener('DOMContentLoaded', async () => {
    await loadDesignerFilters();
    await loadColorsFilters();
    await loadProducts();

    sortSelect.addEventListener('change', loadProducts);
    designerFilterContainer.addEventListener('change', loadProducts);
    colorsFilterContainer.addEventListener('change', loadProducts);
});

document.title = categoryName;

async function loadDesignerFilters() {
    try {
        const res = await fetch('/admin/data');
        let designers = await res.json();
        designers.sort((a, b) => a.products_designer.localeCompare(b.products_designer));
        designers = designers.filter((designer, index, self) =>
            index === self.findIndex(d => d.products_designer === designer.products_designer)
        );
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

    const selectedColors = Array.from(
        colorsFilterContainer.querySelectorAll('input[type=checkbox]:checked')
    ).map(input => input.value);

    const params = new URLSearchParams();

    // sorting parameters
    if (sortValue) {
        const [field, order] = sortValue.split('-');
        params.set('sortField', field);
        params.set('sortOrder', order);
    }

    // designers
    selectedDesigners.forEach(name => params.append('designer', name));
    selectedColors.forEach(color => params.append('color', color));

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




async function loadColorsFilters() {
    try {
        const res = await fetch('/admincolors/colorsdata');
        const colors = await res.json();

        //  sorting by color name
        colors.sort((a, b) => a.colors_name.localeCompare(b.colors_name));

        colorsFilterContainer.innerHTML = '';

        colors.forEach(color => {
            const li = document.createElement('li');
            li.innerHTML = `
                <label>
                    <input type="checkbox" value="${color.colors_id}"> ${color.colors_name}
                </label>`;
            colorsFilterContainer.appendChild(li);
        });
    } catch (err) {
        console.error('Error loading colors:', err);
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
        div.className = 'product list_view';
        div.innerHTML = `
            <span class="reaction">
                <button class="like" data-action="like"><i class="fa-regular fa-heart"></i></button>
                <button class="bucket" data-action="addToCart"><i class="fa-solid fa-basket-shopping"></i></button>
            </span>
            <img src="${product.products_cover}" alt="${product.products_name}">
            <div class="color-dots" id="colors-${product.products_id}"></div>
            <p class="designer">${product.products_designer}</p>
            <a class="name" href="/product/${product.products_name}/${product.products_id}" id="product.products_id"><b>${product.products_name}</b> <span class="rights">${product.products_price}$</span></a>
        `;
        productWrapper.appendChild(div);

        fetch(`/category/products/${product.products_id}/colors`)
            .then(response => response.json())
            .then(colors => {
                const container = document.getElementById(`colors-${product.products_id}`);
                if (!Array.isArray(colors) || colors.length === 0) {

                    return;
                }
                colors.forEach(hex => {
                    const dot = document.createElement('span');
                    dot.className = 'color-dot';
                    dot.style.backgroundColor = hex;
                    container.appendChild(dot);
                });
            })
            .catch(error => console.error('Error loading colors:', error));
    });
}


function toggleFilterAttr(id, buttonEl) {
    const el = document.getElementById(id);
    el.classList.toggle('show');


    if (el.classList.contains('show')) {
        buttonEl.textContent = '−';
    } else {
        buttonEl.textContent = '+';
    }
}

function HandleView(view_control){
    const products = document.querySelectorAll('.product');
    products.forEach(product => {
        product.classList.remove('list_view', 'grid_view');
        product.classList.add(view_control);
    });
}

const clearBtn = document.querySelector('#clear_btn');
clearBtn.addEventListener('click', ()=>{
    const designerCheckbox = designerFilterContainer.querySelectorAll('input[type=checkbox]');
    designerCheckbox.forEach(checkbox => checkbox.checked = false);

    const colorCheckbox = colorsFilterContainer.querySelectorAll('input[type=checkbox]');
    colorCheckbox.forEach(checkbox => checkbox.checked = false);

    loadProducts();
})