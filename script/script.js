const butomsAdd = document.querySelectorAll('.button');
const buttonBuy = document.querySelector('.button-buy');
const buttonRealizarPedido = document.querySelector('.button-realizar-pedido');

import { addToCarritoItem, armarResumen, realizarPedido } from './funciones.js';

//let carrito = [];
butomsAdd.forEach((element) => {
  element.addEventListener('click', addToCarritoItem);
});

buttonBuy.addEventListener('click', armarResumen);

buttonRealizarPedido.addEventListener('click', realizarPedido);
