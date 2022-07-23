const tbody = document.querySelector('.tbody');
const modalBody = document.querySelector('.modal-body');
const buttonEfectivo = document.querySelector('.button-pay-efectivo');
const buttonTarjeta = document.querySelector('.button-pay-tarjeta');

let carrito = [];

function alertasSuccess(msj) {
  Toastify({
    text: msj,
    className: 'info',
    duration: 1200,
    style: {
      background: 'linear-gradient(to right, #00b09b, #96c93d)',
    },
  }).showToast();
}
function alertasDanger(msj) {
  Toastify({
    text: msj,
    className: 'info',
    duration: 1200,
    style: {
      background:
        'linear-gradient(275deg, rgba(2,0,36,1) 0%, rgba(8,9,9,1) 0%, rgba(133,47,21,1) 60%, rgba(18,19,19,1) 98%)',
    },
  }).showToast();
}

const addToCarritoItem = (e) => {
  const button = e.target;
  const item = button.closest('.card');
  const itemTitle = item.querySelector('.card-title').textContent;
  const itemPrice = item.querySelector('.precio').textContent;
  const itemImg = item.querySelector('.card-img-top').src;
  const newItem = {
    title: itemTitle,
    price: itemPrice,
    img: itemImg,
    cant: 1,
  };

  addItemCarrito(newItem);
};

function addItemCarrito(newItem) {
  const inputElement = tbody.getElementsByClassName('Input-value');
  alertasSuccess('Producto añadido al carrito');

  for (let index = 0; index < carrito.length; index++) {
    if (carrito[index].title.trim() === newItem.title.trim()) {
      carrito[index].cant++;
      inputElement[index].value++;
      precioTotal();
      return null;
    }
  }

  carrito.push(newItem);
  renderCarrito();
}

function renderCarrito() {
  tbody.innerHTML = '';
  carrito.map((item) => {
    const tr = document.createElement('tr');
    tr.classList.add('ItemCarrito');
    const content = `
        <th scope="row">1</th>
        <td class="table__productos">
            <img src=${item.img} alt="">
            <h6 class="title">${item.title}</h6>
        </td>
        <td class="table__precio">
            <p>${item.price}</p>
        </td>
        <td class="table__cantidad">
            <input type="number" min="1" value=${item.cant} class ="Input-value">
            <button class="delete btn btn-danger">x</button>
        </td>
      
      `;
    tr.innerHTML = content;
    tbody.appendChild(tr);
    tr.querySelector('.delete').addEventListener('click', removeItemCarrito);
    tr.querySelector('.Input-value').addEventListener(
      'change',
      modificarCantidad
    );
  });
  precioTotal();
}

function precioTotal() {
  let total = 0;
  const itemCartTotal = document.querySelector('.itemCartTotal');
  carrito.forEach((element) => {
    const precio = parseInt(element.price.replace('$', ''));
    total = total + precio * element.cant;
  });

  itemCartTotal.innerHTML = `Total $${total}`;
  addLocalStorage();
}

function removeItemCarrito(e) {
  const buttomDelete = e.target;
  //obtenemos el componente padre del boton
  const tr = buttomDelete.closest('.ItemCarrito');
  const title = tr.querySelector('.title').textContent;
  carrito.forEach((element) => {
    if (element.title.trim() === title.trim()) {
      carrito.splice(carrito.indexOf(element), 1);
    }
  });
  tr.remove();
  //Una vez que removemos un elemento devemos volver a calcular el total
  precioTotal();

  alertasDanger('Producto removido del carrito');
}

function modificarCantidad(e) {
  const inputModificador = e.target;
  const tr = inputModificador.closest('.ItemCarrito');
  const title = tr.querySelector('.title').textContent;
  carrito.forEach((element) => {
    if (element.title.trim() === title.trim()) {
      if (inputModificador.value < 1) inputModificador.value = 1;
      element.cant = inputModificador.value;
      precioTotal();
    }
  });
}

function addLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function armarElementsResumen(mostrarResumen) {
  carrito.forEach((element) => {
    const p = document.createElement('p');
    const resumen = `
        <p class="resumenCompra">${element.cant}x ${element.title}  </p>
    `;
    p.innerHTML = resumen;
    mostrarResumen.appendChild(p);
  });
}

const armarResumen = () => {
  const mostrarResumen = modalBody.querySelector('.resumen');

  mostrarResumen.innerHTML = '';
  armarElementsResumen(mostrarResumen);
  const montoTotal = document.createElement('p');
  montoTotal.innerHTML =
    '<hr>' + document.querySelector('.itemCartTotal').innerHTML;
  mostrarResumen.appendChild(montoTotal);
};

//Manejador de eventos para los botones de Efectivo y Tarjeta

buttonEfectivo.addEventListener('click', () => {
  console.log('aca');
  if (Object.values(buttonTarjeta.classList).includes('btn-success')) {
    buttonTarjeta.classList.remove('btn-success');
    buttonTarjeta.classList.add('btn-secondary');
  }

  Object.values(buttonEfectivo.classList).includes('btn-success')
    ? (buttonEfectivo.classList.remove('btn-success'),
      buttonEfectivo.classList.add('btn-secondary'))
    : (buttonEfectivo.classList.remove('btn-secondary'),
      buttonEfectivo.classList.add('btn-success'),
      (document.querySelector('.method-pay').innerHTML = ''),
      (document.querySelector('.method-pay').innerHTML = `
      <div class="card card-body">
      <span>¿Con cuánto abonas?</span>
      <input id="montoEfectivo" type="number" class="form-control" id="recipient-name" placeholder="Con cuánto abonas:"><br>
      </div>`));
});

buttonTarjeta.addEventListener('click', () => {
  if (Object.values(buttonEfectivo.classList).includes('btn-success')) {
    buttonEfectivo.classList.remove('btn-success');
    buttonEfectivo.classList.add('btn-secondary');
    console.log('acatambien');
  }

  Object.values(buttonTarjeta.classList).includes('btn-success')
    ? (buttonTarjeta.classList.remove('btn-success'),
      buttonTarjeta.classList.add('btn-secondary'))
    : (buttonTarjeta.classList.remove('btn-secondary'),
      buttonTarjeta.classList.add('btn-success'),
      (document.querySelector('.method-pay').innerHTML = ''),
      (document.querySelector('.method-pay').innerHTML = `
      <div class="card card-body">
       <span>Encontrarás el link de pago junto a tu pedido en el mensaje de WhatsApp!</span>
      </div>`));
});

function validarDatosPersonales() {
  return (
    document.getElementById('Direccion').value != '' &&
    document.getElementById('Telefono').value != '' &&
    document.getElementById('Nombre').value != ''
  );
}

function validarMetodoDePago() {
  return (
    Object.values(buttonTarjeta.classList).includes('btn-success') ||
    Object.values(buttonEfectivo.classList).includes('btn-success')
  );
}

function armarStringResumen() {
  let resumenWsp = '';
  carrito.forEach((element) => {
    resumenWsp += element.cant + 'x' + ' ' + element.title + '%0A';
  });
  return (resumenWsp =
    'Hola!, ' +
    document.getElementById('Nombre').value +
    '. Gracias por probar Mk Rolex, mi primer página web. A continuacion veras el detalle del pedido. Si seleccionaste la opción de tarjeta veras que el link de Mercado Pago funciona correctamente *guiño guiño*' +
    '%0A %0A' +
    'A nombre de: ' +
    document.getElementById('Nombre').value +
    ' %0A' +
    'Dirección: ' +
    document.getElementById('Direccion').value +
    '%0A' +
    '%0A' +
    'Resumen de compra: %0A %0A' +
    resumenWsp +
    '%0A' +
    'Aclaraciones: %0A' +
    document.querySelector('#message-text').value +
    '%0A %0A' +
    document.querySelector('.itemCartTotal').innerHTML);
}

function realizarPedido() {
  let resumen = armarStringResumen();
  if (carrito.length != 0) {
    if (validarDatosPersonales() && validarMetodoDePago()) {
      if (Object.values(buttonTarjeta.classList).includes('btn-success')) {
        resumen +=
          '%0A' +
          'Ingresá para abonar(Tranqui, te pide ingresar el monto y confirmar gg): link.mercadopago.com.ar/michaelvasquez';
        document.querySelector(
          '.button-confirmar-pedido'
        ).innerHTML = `<a class="btn btn-success button-confirmar-pedido" href="https://wa.me/2213507949/?text=${resumen}">Confirmar pedido</a>`;
        localStorage.clear();
      } else {
        if (modalBody.querySelector('#montoEfectivo').value != '') {
          resumen +=
            '%0A' +
            'Abono en efectivo con: ' +
            '$' +
            modalBody.querySelector('#montoEfectivo').value;
          document.querySelector(
            '.button-confirmar-pedido'
          ).innerHTML = `<a class="btn btn-success button-confirmar-pedido" href="https://wa.me/2213507949/?text=${resumen}">Confirmar pedido</a>`;
          localStorage.clear();
        } else {
          alertasDanger('Por favor ingrese el monto con el que abonará!');
        }
      }
    } else {
      alertasDanger('Por favor complete todos los campos!');
    }
  }
}

window.onload = function () {
  const storage = JSON.parse(localStorage.getItem('carrito'));
  if (storage) {
    carrito = storage;
    renderCarrito();
  }
};

export { addToCarritoItem, armarResumen, realizarPedido };
