"use strict";
// Load the elements
let product_cards = document.querySelector('.product-cards');
let cartToggle = document.querySelector('#cart-toggle');
let cartView = document.querySelector('.cart-view');
let toggleOrderView = document.querySelector('.orders-view');
let orderToggle = document.querySelector('#order-toggle');
let cartItems = document.querySelector('.cart-items');
let badge = document.querySelector('.badge');
let totalDiv = document.querySelector('.total');
let checkoutBtn = document.querySelector('.checkout');
let orderView = document.querySelector('.order-items');
badge.textContent = "0";
totalDiv.textContent = "0";
let cart = [];
let items_arr = [];
let orders = [];
// Handle cart toggling
cartToggle.addEventListener('click', () => {
    if (cartView.style.display == "none" && toggleOrderView.style.display == "block") {
        cartView.style.display = "block";
        toggleOrderView.style.display = "none";
        cartToggle.style.backgroundColor = "red";
        orderToggle.style.backgroundColor = "#36454F";
    }
    else if (toggleOrderView.style.display == "none" && cartView.style.display == "none") {
        cartView.style.display = "block";
        cartToggle.style.backgroundColor = "red";
    }
    else {
        cartView.style.display = "none";
        cartToggle.style.backgroundColor = "#36454F";
        badge.textContent = '0';
    }
});
// Handle orders toggling
orderToggle.addEventListener('click', () => {
    if (toggleOrderView.style.display == "none" && cartView.style.display == "block") {
        toggleOrderView.style.display = 'block';
        cartView.style.display = 'none';
        cartToggle.style.backgroundColor = "#36454F";
        orderToggle.style.backgroundColor = "red";
    }
    else if (toggleOrderView.style.display == "none" && cartView.style.display == "none") {
        toggleOrderView.style.display = "block";
        orderToggle.style.backgroundColor = "red";
    }
    else {
        toggleOrderView.style.display = 'none';
        orderToggle.style.backgroundColor = "#36454F";
    }
});
// Get the localstorage when the page loads
window.onload = () => {
    let items = save.getItems();
    // Check if the local storage exists and populate the items array
    if (items) {
        items.forEach((item) => {
            items_arr.push(item);
            create_cards();
        });
    }
    else {
        return;
    }
    let storedCart = save.getCart();
    if (storedCart) {
        storedCart.forEach((el) => {
            cart.push(el);
            displayCart();
        });
    }
    else {
        displayCart();
    }
    let storedOrders = save.getOrders();
    if (storedOrders) {
        storedOrders.forEach((order) => {
            orders.push(order);
        });
        handleOrder();
    }
    else {
        orderView.textContent = "You have no orders";
    }
    doMath();
};
// Create a card for each item
function create_cards() {
    product_cards.textContent = "";
    if (items_arr.length >= 1) {
        items_arr.forEach((el, index) => {
            let card = document.createElement('div');
            card.className = 'card';
            let cardImg = document.createElement('img');
            cardImg.setAttribute('src', el.itemImage);
            let cardDetails = document.createElement('div');
            cardDetails.className = 'card-details';
            let cardName = document.createElement('h2');
            cardName.className = 'card-name';
            cardName.textContent = el.itemName;
            let cardDesc = document.createElement('p');
            cardDesc.className = 'card-desc';
            cardDesc.textContent = el.itemDesc;
            let cardPrice = document.createElement('h4');
            cardPrice.className = 'card-price';
            cardPrice.textContent = `ksh ${el.itemPrice}`;
            let cartBtn = document.createElement('button');
            cartBtn.className = 'cart-btn';
            cartBtn.textContent = "Add to cart";
            cartBtn.addEventListener('click', () => {
                let cartitem = {
                    cartName: el.itemName,
                    cartImage: el.itemImage,
                    cartPrice: el.itemPrice
                };
                cart.push(cartitem);
                // cartTotal(el.itemPrice);
                doMath();
                save.saveCart();
                displayCart();
            });
            cardDetails.appendChild(cardName);
            cardDetails.appendChild(cardDesc);
            cardDetails.appendChild(cardPrice);
            card.appendChild(cardImg);
            card.appendChild(cardDetails);
            card.appendChild(cartBtn);
            product_cards.appendChild(card);
        });
    }
    else {
        product_cards.textContent = "No Items available";
    }
}
// Display the items in the cart
function displayCart() {
    if (cart.length >= 1) {
        cartItems.textContent = "";
        let count = 0;
        cart.forEach((el, index) => {
            count += 1;
            badge.textContent = `${count}`;
            let cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            let cartName = document.createElement('div');
            cartName.className = 'cart-name';
            cartName.textContent = `${el.cartName}`;
            let cartImg = document.createElement('img');
            cartImg.className = 'cart-img';
            cartImg.setAttribute('src', el.cartImage);
            let cartPrice = document.createElement('div');
            cartPrice.className = 'cart-price';
            cartPrice.textContent = `Ksh ${el.cartPrice}`;
            let delItem = document.createElement('button');
            delItem.className = 'del-item';
            delItem.textContent = "Delete";
            delItem.addEventListener('click', () => {
                delCartItem(index);
            });
            cartItem.appendChild(cartName);
            cartItem.appendChild(cartImg);
            cartItem.appendChild(cartPrice);
            cartItem.appendChild(delItem);
            cartItems.appendChild(cartItem);
        });
    }
    else {
        cartItems.textContent = "Cart is empty";
    }
}
// Delete an item in the cart when the delete button is clicked
function delCartItem(index) {
    cart.splice(index, 1);
    save.saveCart();
    displayCart();
    doMath();
}
// Create an order
checkoutBtn.addEventListener('click', () => {
    if (cart.length >= 1) {
        let newOrder = {
            order: cart,
            status: "pending",
        };
        orders.push(newOrder);
        save.saveOrder();
        cart = [];
        doMath();
        save.saveCart();
        displayCart();
        handleOrder();
        alert("Your order is being processed");
    }
    else {
        cartItems.textContent = "Please add Items to your Cart";
    }
});
// Calculate the cart price and the cart badge counter
function doMath() {
    let initPrice = 0;
    let count = 0;
    cart.forEach((item) => {
        initPrice += item.cartPrice;
        count += 1;
    });
    totalDiv.textContent = `${initPrice}`;
    badge.textContent = `${count}`;
}
let orderCart = [];
// Handle Order
function handleOrder() {
    orderView.textContent = "";
    console.log(orders);
    orders.forEach((el, index) => {
        orderCart.push(el.order);
        let orderDiv = document.createElement('div');
        orderDiv.className = "order-div";
        let orderNo = document.createElement('h4');
        orderNo.textContent = `Order no:${index + 1}`;
        let status = document.createElement('p');
        status.textContent = el.status;
        status.className = 'status';
        orderCart.forEach((items) => {
            orderDiv.textContent = "";
            orderDiv.appendChild(orderNo);
            items.forEach((item) => {
                let cartname = document.createElement('p');
                cartname.textContent = item.cartName;
                orderDiv.appendChild(cartname);
            });
        });
        orderDiv.appendChild(status);
        orderView.appendChild(orderDiv);
    });
}
// Classes to handle saving and retrieval of data to and from the local storage
class localData {
    getCart() {
        let data = localStorage.getItem("puddleTsCart");
        return JSON.parse(data);
    }
    getItems() {
        let data = localStorage.getItem("puddleItems");
        return JSON.parse(data);
    }
    getOrders() {
        let data = localStorage.getItem("puddleTsOrders");
        return JSON.parse(data);
    }
}
class localSaves extends localData {
    saveCart() {
        return localStorage.setItem("puddleTsCart", JSON.stringify(cart));
    }
    saveOrder() {
        return localStorage.setItem("puddleTsOrders", JSON.stringify(orders));
    }
}
// A new instance of the classes
let save = new localSaves;
