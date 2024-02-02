"use strict";
// Load The elements
let itemForm = document.querySelector('#item-form');
let itemName = document.querySelector('#item-name');
let itemImage = document.querySelector('#item-image');
let itemDesc = document.querySelector('#item-desc');
let itemPrice = document.querySelector('#item-price');
let formToggle = document.querySelector('#form-toggle');
let productCards = document.querySelector('.product-cards');
// Load the error divs
let itemNameError = document.querySelector('.itemNameError');
let itemImageError = document.querySelector('.itemImageError');
let itemDescError = document.querySelector('.itemDescError');
let itemPriceError = document.querySelector('.itemPriceError');
// Handle form toggling
formToggle.addEventListener('click', () => {
    if (itemForm.style.display == "none") {
        itemForm.style.display = "flex";
        formToggle.style.backgroundColor = "red";
        formToggle.textContent = "Close";
    }
    else {
        itemForm.style.display = "none";
        formToggle.style.backgroundColor = "#36454F";
        formToggle.textContent = "New Item";
    }
});
// Initialize an empty items array of type item(interface) to store new items and also items existing from the local storage
let itemsArr = [];
// Get the localstorage when the page loads
window.onload = () => {
    let items = localStorage.getItem("puddleItems");
    items = JSON.parse(items);
    // Check if the local storage exists and populate the items array
    if (items) {
        items.forEach((item) => {
            itemsArr.push(item);
            createCards(items);
        });
    }
    else {
        return;
    }
};
// Handle item creation form
itemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Reset the error div on each submission
    itemNameError.textContent = "";
    itemImageError.textContent = "";
    itemDescError.textContent = "";
    itemPriceError.textContent = "";
    // Verify the form input
    let item = verifyInput(itemName.value, itemImage.value, itemDesc.value, parseFloat(itemPrice.value));
    // If the input is valid store it to the local storage
    if (item) {
        itemsArr.push(item);
        localStorage.setItem("puddleItems", JSON.stringify(itemsArr));
        createCards(itemsArr);
    }
    else {
        return;
    }
});
// Function to verify input
function verifyInput(itemName, itemImage, itemDesc, itemPrice) {
    let itemObject = {
        itemName,
        itemImage,
        itemDesc,
        itemPrice,
    };
    if (itemName.trim() != "") {
        itemObject.itemName = itemName;
    }
    else {
        itemNameError.textContent = "Item name required";
        return false;
    }
    if (itemImage.trim() != "") {
        itemObject.itemImage = itemImage;
    }
    else {
        itemImageError.textContent = "Item image required";
        return false;
    }
    if (itemDesc.trim() != "") {
        itemObject.itemDesc = itemDesc;
    }
    else {
        itemDescError.textContent = "Item description required";
        return false;
    }
    if (itemPrice) {
        itemObject.itemPrice = itemPrice;
    }
    else {
        itemPriceError.textContent = "Item name required";
        return false;
    }
    // If all the data is valid return an item object
    return itemObject;
}
// Create the Item cards
function createCards(item) {
    productCards.textContent = "";
    if (item.length >= 1) {
        item.forEach((el, index) => {
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
            let delBtn = document.createElement('button');
            delBtn.className = 'delete';
            delBtn.textContent = "Delete";
            delBtn.addEventListener('click', () => {
                deleteItem(index);
            });
            cardDetails.appendChild(cardName);
            cardDetails.appendChild(cardDesc);
            cardDetails.appendChild(cardPrice);
            card.appendChild(cardImg);
            card.appendChild(cardDetails);
            card.appendChild(delBtn);
            productCards.appendChild(card);
        });
    }
    else {
        productCards.textContent = "No Items available";
    }
}
function deleteItem(index) {
    itemsArr.splice(index, 1);
    localStorage.setItem("puddleItems", JSON.stringify(itemsArr));
    createCards(itemsArr);
}
