'use strict';

function request(protocol, url, body, headers, returnResponce) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(protocol, url);

    if (headers) {
      headers.forEach(function(value, key) {
        xhr.setRequestHeader(key, value);
      });
    }

    xhr.onload = function() {
      if (xhr.status == 200) {
          if (protocol === 'GET' || returnResponce === true) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            resolve(xhr.getResponseHeader('Authorization'));
          }

      } else {
          reject(Error(xhr.statusText));
      }
    };
    xhr.onerror = function() { reject(Error('Network Error')); };
    xhr.send(body);
  });
}

let options = {
  'http': 'http://',
  'https': 'https://',
  'host': 'yoursite.demandware.net',
  'site': 'SiteGenesis',
  'version': 'v17_2',
  'clientId': 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  'categories': 'categories/root?levels=1',
  'productSearchExpand': '&expand=images,prices,availability,variations&count=20'
}

let mockData = {
  billingAddress: {
    'first_name': 'John',
    'last_name': 'Smith',
    'city': 'Boston',
    'country_code': 'US',
    'state_code': 'MA'
  },
  customer: {
    'email': 'test001@test.com'
  },
  shipping : {
    'shipping_method': {
      'id': '001'
    }
  },
  paymentInstrument: {
    'amount' : 1.0,
    'payment_card' : {
       'number': '411111111111111',
       'security_code': '121',
       'holder': 'John Smith',
       'card_type': 'Visa',
       'expiration_month': 1,
       'expiration_year': 2021
    },
    'payment_method_id' : "CREDIT_CARD"
  }
};

let baseUrl = options.http + options.host + /s/ + options.site + '/dw/shop/' + options.version + '/';
let baseUrlSecure = options.https + options.host + /s/ + options.site + '/dw/shop/' + options.version + '/';

let searchForm = document.forms.search;
let searchField = document.querySelector('input[name=search-text]');
let button = document.querySelector('input[name=search-button]');
let menuWrapper = document.querySelector('.wrapper');
let main = document.querySelector('.main');
let basketButton = document.querySelector('button[name=basket-button]');

let authToken;
let basket;
let order;

function consoleRes(res) {
  console.log(res);
}

button.addEventListener('click', searchProducts);
button.addEventListener('keydown', (e) => {
  if (e.which === 13) {
    searchProducts();
  }
});
basketButton.addEventListener('click', renderBasket);

function init() {
  request('GET', baseUrl +'categories/root?levels=1' + '&client_id=' + options.clientId)
    .then(renderMenu)
      .then(initBasket);
}

function renderMenu(res) {
  let menu = document.createElement('ul');
  let li = document.createElement('li');
  let a = document.createElement('a');

  menu.classList.add('main-menu');
  res.categories.forEach(renderMenuItem);

  li.classList.add('menu-item');
  a.classList.add('menu-link');
  a.innerHTML = 'Order Tracker';
  a.addEventListener('click', renderOrderTracker);

  li.appendChild(a);
  menu.appendChild(li);
  menuWrapper.insertBefore(menu, searchForm);

  function renderMenuItem(category) {
    let li = document.createElement('li');
    let a = document.createElement('a');
    li.classList.add('menu-item');
    a.classList.add('menu-link');
    a.innerHTML = category.name;
    a.dataset.href = baseUrl + 'product_search?q='+ encodeURIComponent(category.name) + options.productSearchExpand + '&client_id=' + options.clientId;
    a.addEventListener('click', searchProducts);
    li.appendChild(a);
    menu.appendChild(li);
  }
}

function renderOrderTracker() {
  clearMain();
  renderBreadcrumbs('ORDERTRACKER');

  let form = document.createElement('form');
  let input = document.createElement('input');
  let searchButton = document.createElement('input');
  form.name = 'searchOrder';
  input.type = 'text';
  searchButton.type = 'submit';
  searchButton.innerHTML = 'Search';
  searchButton.classList.add('searchorder');

  form.appendChild(input);
  form.appendChild(searchButton);
  main.appendChild(form);
}

function searchProducts(e) {
  e.preventDefault();
  if (e.target.dataset.href) {
    request('GET', e.target.dataset.href)
      .then(renderProducts);
    return;
  } else {
    request('GET', baseUrl + 'product_search?q='+ searchField.value + options.productSearchExpand + '&client_id=' + options.clientId)
      .then(renderProducts); // TODO we need to assign new request() to 'load more' if res.count = max (25 - 200). Maybe we need to use --> pagination
  }
}

function clearMain() {
  if (main.childNodes.length > 0) {
    for (let i=0; i = main.childNodes.length; i++) {
      main.removeChild(main.childNodes[0]);
    }
  }
}

function renderBreadcrumbs(pageType, res) {
  let breadcrumbs = document.createElement('h2');
  let text;

  switch (pageType) {
    case 'SEARCH':
      text = 'Search results for "' + res.query + '" get ' + res.count + ' products';
      break;
    case 'BASKET':
      text = 'Your basket contains ' + basketButton.innerHTML + ':';
      break;
    case 'ORDER':
      text = 'Your order details:';
      break;
    case 'ORDERTRACKER':
      text = 'Enter order number in the field below:';
  }

  breadcrumbs.classList.add('breadcrumbs');
  breadcrumbs.innerHTML = text;
  main.appendChild(breadcrumbs);
}

function renderProducts(res) {
  clearMain();
  renderBreadcrumbs('SEARCH', res);

  if (res.count === 0) {
    return;
  }

  let products = document.createElement('section');
  products.classList.add('products');
  res.hits.forEach(fillProducts);

  main.appendChild(products);

// TODO here will be a function that creates a 'load more' button and assigns new request() to it starting from previous count

  function fillProducts(product) {
    let productTile = document.createElement('div');
    let productName = document.createElement('p');
    let productImage = document.createElement('img');
    let productPrice = document.createElement('p');

    productTile.classList.add('producttile');
    productName.classList.add('product-name');
    productImage.classList.add('product-image');
    productPrice.classList.add('product-price');

    productTile.dataset.href = product.link;
    productTile.dataset.productId = product.product_id;
    productName.innerHTML = product.product_name;
    productImage.src = product.image.link;
    productPrice.innerHTML = product.price + ' ' + product.currency;

    productTile.appendChild(productName);
    productTile.appendChild(productImage);
    productTile.appendChild(productPrice);
    productTile.addEventListener('click', displayProduct);

    products.appendChild(productTile);
  }
}

function displayProduct(e) {
  e.preventDefault();
  let productFull = e.currentTarget;
  let addToBasketButton = document.createElement('button');

  addToBasketButton.type = 'button';
  addToBasketButton.dataset.productId = productFull.dataset.productId;
  addToBasketButton.innerHTML = 'Add to Basket';
  addToBasketButton.addEventListener('click', addToBasket);
  getProductLink(addToBasketButton);

  productFull.appendChild(addToBasketButton);
  productFull.classList.remove('producttile');
  productFull.classList.add('product-full');
  productFull.removeEventListener('click', displayProduct);

  clearMain();
  main.appendChild(productFull);
}

function getProductLink(element) {
  let url = baseUrl +'products/' + element.dataset.productId +'?client_id=' + options.clientId + options.productSearchExpand;
  request('GET', url)
    .then(function(res) {
      if (res.variants) {
        element.dataset.productId = res.variants[0].product_id;
      }
    });
}

function initBasket() {
  authenticate()
    .then(createBasket)
      .then(getBasket)
        .then(setBillingAddress)
          .then(setShippingMethod)
            .then(setPaymentMethod)
              .then(colorBasket);
}

function authenticate() {
  let url = baseUrlSecure +'customers/auth' + '?client_id=' + options.clientId;
  let body = JSON.stringify({
    type: "guest"
  });
  let headers = new Map();
  headers.set('Content-type', 'application/json');
  return request('POST', url, body, headers);
}

function refreshAuthentication() {
  let url = baseUrlSecure +'customers/auth' + '?client_id=' + options.clientId;
  let body = JSON.stringify({
    type: "refresh"
  });
  let headers = new Map();
  headers.set('Content-type', 'application/json');
  headers.set('Authorization', authToken);
  return request('POST', url, body, headers);
}

function createBasket(token) {
  authToken = token;
  window.setTimeout(refreshAuthentication, 1740000);
  let url = baseUrlSecure +'baskets';
  let body = JSON.stringify({
    customer_info: mockData.customer
  });
  let headers = new Map();
  headers.set('Content-type', 'application/json');
  headers.set('Authorization', token);
  return request('POST', url, body, headers, true);
}

function getBasket(res) {
  basket = res;
}

function colorBasket() {
  basketButton.innerHTML = '0 items';
  basketButton.classList.add('active');
}

function setBillingAddress() {
  let url = baseUrlSecure +'baskets/' + basket.basket_id + '/billing_address?use_as_shipping=true';
  let body = JSON.stringify(mockData.billingAddress);
  let headers = new Map();
  headers.set('Content-type', 'application/json');
  headers.set('Authorization', authToken);
  request('PUT', url, body, headers, true)
}

function setShippingMethod() {
  let url = baseUrlSecure +'baskets/' + basket.basket_id + '/shipments/' + basket.shipments[0].shipment_id;
  let body = JSON.stringify(mockData.shipping);
  let headers = new Map();
  headers.set('Content-type', 'application/json');
  headers.set('Authorization', authToken);
  request('PATCH', url, body, headers, true)
}

function setPaymentMethod() {
  let url = baseUrlSecure +'baskets/' + basket.basket_id + '/payment_instruments';
  let body = JSON.stringify(mockData.paymentInstrument);
  let headers = new Map();
  headers.set('Content-type', 'application/json');
  headers.set('Authorization', authToken);
  request('POST', url, body, headers, true)
}

function addToBasket() {
  let url = baseUrlSecure +'baskets/' + basket.basket_id + '/items';
  let body = JSON.stringify([{
    product_id: this.dataset.productId,
    quantity: 1.00
  }]);
  let headers = new Map();
  headers.set('Content-type', 'application/json');
  headers.set('Authorization', authToken);
  request('POST', url, body, headers, true)
    .then(updateBasketTotals);
}

function updateBasketTotals(res) {
  let count = 0;
  if (res.product_items) {
    res.product_items.forEach(function(item) {
      count += item.quantity;
    });
  }
  basket = res;
  basketButton.innerHTML = count + ' items';
}

function renderBasket() {
  clearMain();
  renderBreadcrumbs('BASKET');

  if (!basket.product_items) {
    return;
  }

  let products = document.createElement('section');
  products.classList.add('products');
  basket.product_items.forEach(renderProduct);

  let basketTotals = document.createElement('h2');
  let checkoutButton = document.createElement('button');
  basketTotals.classList.add('ordertotals');
  basketTotals.innerHTML = 'Total products sum: ' + basket.product_total + ' ' + basket.currency + '<br/>Order total: ' + basket.order_total + ' ' + basket.currency;
  checkoutButton.classList.add('createorder');
  checkoutButton.innerHTML = 'Create an order';
  checkoutButton.addEventListener('click', processOrder);

  main.appendChild(products);
  main.appendChild(basketTotals);
  main.appendChild(checkoutButton);

  function renderProduct(product) {
    let productTile = document.createElement('div');
    let productName = document.createElement('p');
    let productQuantity = document.createElement('p');
    let productPrice = document.createElement('p');
    let removeButton = document.createElement('button');

    productTile.classList.add('producttile');
    productName.classList.add('product-name');
    productQuantity.classList.add('product-quantity');
    productPrice.classList.add('product-price');

    productName.innerHTML = product.product_name;
    productQuantity.innerHTML = 'You have ' + product.quantity + ' items';
    productPrice.innerHTML = 'Total price ' + product.price + ' ' + basket.currency;
    removeButton.innerHTML = 'Remove item';
    removeButton.dataset.itemId = product.item_id;

    productTile.appendChild(productName);
    productTile.appendChild(productQuantity);
    productTile.appendChild(productPrice);
    productTile.appendChild(removeButton);
    removeButton.addEventListener('click', removeProduct);

    products.appendChild(productTile);
  }
}

function removeProduct() {
  let url = baseUrlSecure +'baskets/' + basket.basket_id + '/items/' + this.dataset.itemId;
  let body = null;
  let headers = new Map();
  headers.set('Content-type', 'application/json');
  headers.set('Authorization', authToken);
  request('DELETE', url, body, headers, true)
    .then(updateBasketTotals)
      .then(renderBasket);
}

function processOrder() {
  createOrder()
    .then(renderOrderDetails);
}

function createOrder() {
  let url = baseUrlSecure +'orders';
  let body = JSON.stringify({
    'basket_id': basket.basket_id
  });
  let headers = new Map();
  headers.set('Content-type', 'application/json');
  headers.set('Authorization', authToken);
  return request('POST', url, body, headers, true)
}

function renderOrderDetails(res) {
  order = res;

  let orderTotals = document.createElement('h2');
  let products = document.createElement('section');
  orderTotals.classList.add('ordertotals');
  orderTotals.innerHTML = 'Order No: ' + res.order_no + '<br/>Order total: ' + res.order_total + ' ' + res.currency + '<br/>Sipping cost: ' + res.shipping_total + ' ' + res.currency;
  products.classList.add('products');
  res.product_items.forEach(renderProduct);

  clearMain();
  renderBreadcrumbs('ORDER');
  main.appendChild(orderTotals);
  main.appendChild(products);

  function renderProduct(product) {
    let productTile = document.createElement('div');
    let productName = document.createElement('p');
    let productQuantity = document.createElement('p');
    let productPrice = document.createElement('p');

    productTile.classList.add('producttile');
    productName.classList.add('product-name');
    productQuantity.classList.add('product-quantity');
    productPrice.classList.add('product-price');

    productName.innerHTML = product.product_name;
    productQuantity.innerHTML = 'You have ' + product.quantity + ' items';
    productPrice.innerHTML = 'Total price ' + product.price + ' ' + basket.currency;

    productTile.appendChild(productName);
    productTile.appendChild(productQuantity);
    productTile.appendChild(productPrice);

    products.appendChild(productTile);
  }
}

init();

setTimeout(function(){
  consoleRes(basket.basket_id);
  consoleRes(authToken);
}, 3000);

