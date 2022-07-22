const cardContainer = document.querySelector('.card-container');

function armarHtml(productos) {
  productos.forEach((element) => {
    const div = document.createElement('div');
    div.classList.add('col', 'd-flex', 'justify-content-center-mb-4');
    const { title, price, description, url } = element;
    div.innerHTML = `
      <div class="card shadow mb-1 bg-dark rounded" style="width: 20rem;">
        <h5 class="card-title pt-2 text-center">${title}</h5>
        <img src="${url}" class="card-img-top img-card" alt="...">
        <div class="card-body  "> 
          <p class="card-text description text-white-50" >${description}</p>
          <h5>Precio: <span class="precio">${price}</span></h5>
          <div class="d-grid gap-2">
              <button class="btn btn-primary button">Añadir al carrito</a>
          </div>   
        </div>
      </div> 
    `;
    cardContainer.append(div);
  });
}

const renderProductos = async () => {
  const res = await fetch('script/productos.json');
  const productos = await res.json();
  armarHtml(productos);
};

renderProductos();
