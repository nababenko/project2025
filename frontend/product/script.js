const pathParts = window.location.pathname.split("/");
const productID = decodeURIComponent(pathParts[pathParts.length - 1]);
const nameTitle = decodeURIComponent(pathParts[pathParts.length - 2]);

document.title = nameTitle;

document.addEventListener("DOMContentLoaded", async() => {

    console.log("Product: ", productID);
    await loadProductInfo();
    await loadReviews();
})
/*додати логіку кольору за замовчуванням
            а також при натисканні на колір змінювати фото відповідно
            змінити спан назви кольору*/
/*додати функціонал кнопкам */

const photosWrapper = document.querySelector('.photos_wrapper');

async function loadProductInfo(){
    try{
        const res1 = await fetch(`/product/${productID}/info`);
        const productInfo = await res1.json();

        const res2 = await fetch(`/product/${productID}/images`);
        const imagesInfo = await res2.json();

        const res3 = await fetch(`/product/${productID}/colors`);
        const colorsInfo = await res3.json();

        if (productInfo.length > 0) {
            const namePlace = document.querySelector('.name_info');
            namePlace.innerHTML = `<p class="bold_info">${productInfo[0].products_name}</p>`;

            const designerInfo = document.querySelector('#designer_info');
            designerInfo.textContent = `Designer: ${productInfo[0].products_designer}`;

            const priceInfo = document.querySelector('#price_info');
            priceInfo.textContent = `${productInfo[0].products_price} $`

            const imgWrapper = document.querySelector('.photos_wrapper');
            const img = document.createElement('img');
            img.src = productInfo[0].products_cover;
            img.alt = productInfo[0].products_name;
            imgWrapper.appendChild(img);

            const imgColumn = document.querySelector('.img_column');
            imagesInfo.forEach(image => {
               const img = document.createElement('img');
               img.src = image.products_images_link;
               imgColumn.appendChild(img);
            });

            const circles = document.querySelector('.circles');

            const color_name = document.querySelector('#color_name');

            colorsInfo.forEach(color => {
                const circle = document.createElement('span');
                circle.style.background = color.colors_hex;
                circles.appendChild(circle);
            });

            const gallery = document.querySelector('.gallery');
            if(productInfo[0].products_gallery){
                const galleryImg = document.createElement('img');
                galleryImg.src = productInfo[0].products_gallery;
                galleryImg.alt = productInfo[0].products_name;
                gallery.appendChild(galleryImg);
            }else{
                const noImg = document.createElement('div');
                noImg.innerHTML = `<p class="bold_info">Sorry! This product does not have gallery image</p>`;
                gallery.appendChild(noImg)
            }




        } else {
            photosWrapper.innerHTML = `<p class="bold_info">Sorry!This product is not available</p>`;
        }

    } catch(err){console.error('Error fetching product info', err);}

}

async function loadReviews(){
   try{

       const res1 = await fetch(`/product/${productID}/average-rating`);
       const averageRating = await res1.json();
       const res2 = await fetch(`/product/${productID}/rating`);
       const ratings = await res2.json();
       const res3 = await fetch(`/product/${productID}/reviews`);
       const reviewsInfo = await res3.json();

       const totalScore = document.querySelector('#total-score');
       totalScore.textContent = averageRating;

       const totalRate = document.querySelector('.total-rate');

       const coloredStarsCount = Math.round(averageRating);
       drawStars(coloredStarsCount, totalRate);
       if(reviewsInfo.length > 1){document.querySelector('#rev-amount').textContent = `${reviewsInfo.length} reviews`;}
       else{document.querySelector('#rev-amount').textContent = `${reviewsInfo.length} review`;}

       const overallRate = document.querySelector('.overall-rate');
       let stars = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
       ratings.forEach(row => {
           stars[row.reviews_rate] = row.count;
       });
       for(let i = 5; i > 0; i--){
           const ratingRow = document.createElement('div');
           ratingRow.className = 'rating-row';
           const label = i === 1 ? `${i} Star` : `${i} Stars`;

           ratingRow.innerHTML = `
            <span class="rating-label">${label}</span>
            <span class="rating-line"></span>
            <span class="rating-count">(${stars[i]})</span>
            `;

           overallRate.appendChild(ratingRow);
       }

       const reviewBox = document.querySelector('.rev-box-scroll');
       reviewsInfo.forEach(row => {
          const container = document.createElement('div');
          container.className = 'reviews-box';
          const starsRev = document.createElement('div');
          starsRev.className = 'reviews-stars';
          const coloredStarsRev = row.reviews_rate;
          drawStars(coloredStarsRev, starsRev);
          const date = document.createElement('span');
          date.className = 'right-side rev-date';
          const isoDate =  row.reviews_date;
          const newDate = new Date(isoDate);
          const options = { day: '2-digit', month: 'long', year: 'numeric' };
          const formattedDate = newDate.toLocaleDateString('en-GB', options);
          date.textContent = formattedDate;
          starsRev.appendChild(date);
          container.appendChild(starsRev);

          const article = document.createElement('p');
          article.className = 'rev-article';
          article.textContent = row.reviews_title;
          container.appendChild(article);

          const content = document.createElement('p');
          content.className = 'rev-content';
          content.textContent = row.reviews_comment;
          container.appendChild(content);

           const author = document.createElement('p');
           author.className = 'rev-author';
           author.textContent = `By ${row.clients_name}`;
           container.appendChild(author);


          reviewBox.appendChild(container);

       });



   }catch(err){console.error('Error fetching reviews', err);}

}

function drawStars (coloredStars, parent) {
    for (let i = 0; i < coloredStars; i++) {
        const star = document.createElement('span');
        star.textContent = '★';
        parent.appendChild(star);
    }
    for (let i = coloredStars; i < 5; i++) {
        const star = document.createElement('span');
        star.textContent = '★';
        star.className = 'gray-star';
        parent.appendChild(star);
    }

}

document.querySelectorAll('.amount-btn')?.forEach(button => {
    button.addEventListener('click', event => {
        const amount_counter = document.querySelector('.amount-value')
        let currentAmount = parseInt(amount_counter.textContent, 10);
        if (button.dataset.behavior === 'minus-amount') {if(currentAmount > 1) currentAmount--;}
        else{currentAmount++; }
        amount_counter.textContent = currentAmount;
    });
});