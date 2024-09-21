(() => {
  //selector
  const filteredInputElm = document.querySelector("#filter");
  const nameInputElm = document.querySelector(".nameInput");
  const priceInputElm = document.querySelector(".priceInput");
  const msgElm = document.querySelector(".msg");
  const collectionElm = document.querySelector(".collection");
  const form = document.querySelector("form");
  const submitBtnElm = document.querySelector(".submit-btn button");

  let products = localStorage.getItem("storedProducts")
    ? JSON.parse(localStorage.getItem("storedProducts"))
    : [];

  // console.log(collectionElm);

  function receivedInputs() {
    const name = nameInputElm.value;
    const price = priceInputElm.value;
    return { name, price };
  }

  function clearMessage() {
    msgElm.textContent = "";
  }

  function showMessage(msg, action = "success") {
    const textMsg = `<div class='alert alert-${action}' role='alert'>${msg}</div>`;
    msgElm.insertAdjacentHTML("afterbegin", textMsg);
    setTimeout(() => {
      clearMessage();
    }, 2000);
  }

  function validateInputs(name, price) {
    let isValid = true;
    // check input is empty
    if (name === "" || price === "") {
      isValid = false;
      showMessage("please provide necessary info", "danger");
    }
    if (Number(price) !== Number(price)) {
      isValid = false;
      showMessage("please provide price as a number", "danger");
    }
    return isValid;
  }

  function reseteInput() {
    nameInputElm.value = "";
    priceInputElm.value = "";
  }

  function addProduct(name, price) {
    const product = {
      id: products.length + 1,
      name: name,
      price: price,
    };
    //   memory data store
    products.push(product);
    return product;
  }

  function showProductToUI(productInfo) {
    const notFoundMsgElm = document.querySelector(".not-found-product");
    if (notFoundMsgElm) {
      notFoundMsgElm.remove();
    }
    const { id, name, price } = productInfo;
    const elm = `  <li
                  class="list-group-item collection-item d-flex flex-row justify-content-between" data-productId = ${id}
                >
                  <div class="product-info">
                    <strong>${name}</strong>- <span class="price">$${price}</span>
                  </div>
                  <div class="action-btn">
                    <i class="fa fa-pencil-alt edit-product float-right me-2"></i>
                    <i class="fa fa-trash-alt delete-product float-right"></i>
                  </div>
                </li>
              `;
    collectionElm.insertAdjacentHTML("afterbegin", elm);
    showMessage("Product Added Successfully!", "success");
  }

  function addProductToStorage(product) {
    let products;
    if (localStorage.getItem("storedProducts")) {
      products = JSON.parse(localStorage.getItem("storedProducts"));
      // update and add new product
      products.push(product);
    } else {
      products = [];
      products.push(product);
    }
    localStorage.setItem("storedProducts", JSON.stringify(products));
  }

  function updateProduct(receivedProduct, storageProducts = products) {
    const updatedProducts = storageProducts.map((product) => {
      if (product.id === receivedProduct.id) {
        return {
          ...product,
          name: receivedProduct.name,
          price: receivedProduct.price,
        };
      } else {
        return product;
      }
    });
    return updatedProducts;
    console.log(updatedProducts);
  }
  function clearEditForm() {
    submitBtnElm.classList.remove("update-btn");
    submitBtnElm.classList.remove("btn-secondary");
    submitBtnElm.textContent = "Submit";
    submitBtnElm.removeAttribute("[date-id");
  }
  function updateProductsToStorage(product) {
    //long way
    //find existing product from localStorage
    let products;
    products = JSON.parse(localStorage.getItem("storedProducts"));
    //update products with new product update
    products = updateProduct(product, products);

    //save back to localStorage
    localStorage.setItem("storedProducts", JSON.stringify(products));
    //alternative way
    // localStorage.setItem('storeProducts', JSON.stringify(products))
  }
  function handleFormSubmit(e) {
    // prevent browser reloading
    e.preventDefault();
    // recieving input

    const { name, price } = receivedInputs();
    // validate inputs
    const isValid = validateInputs(name, price);
    if (!isValid) return;
    // reset input
    reseteInput();
    // update product
    if (submitBtnElm.classList.contains("update-product")) {
      const id = Number(submitBtnElm.dataset.id);
      // update data to the memory
      const product = {
        id,
        name,
        price,
      };
      const updatedProducts = updateProduct(product);
      // memory store
      products = updatedProducts;

      // DOM update
      showAllProductsToUI(products);

      // local storage
      updateProductsToStorage(product);
      // clear the edit state
      clearEditForm();
    } else {
      const product = addProduct(name, price);
      // add data to local storage
      addProductToStorage(product);
      //   add product info to UI
      showProductToUI(product);
      //   console.log(product);
      //   console.log(name, price);
    }
  }

  function getProductId(e) {
    const liElm = e.target.parentElement.parentElement;
    const id = liElm.getAttribute("data-productid");
    return id;
  }
  function removeItem(id) {
    id = Number(id);
    products = products.filter((product) => product.id !== id);
    console.log(products);
  }

  function removeItemFromUI(id) {
    document.querySelector(`[data-productid='${id}']`).remove();
    showMessage("Item deleted successfully", "warning");
  }
  function removeProductsFromLocalStorage(id) {
    id = Number(id);
    let products;
    products = JSON.parse(localStorage.getItem("storedProducts"));
    console.log(products);
    products = products.filter((product) => product.id !== id);
    localStorage.setItem("storedProducts", JSON.stringify(products));
  }
  function findProduct(id) {
    id = Number(id);
    const foundProduct = products.find((product) => product.id === id);
    return foundProduct;
  }
  function populateEditForm(product) {
    nameInputElm.value = product.name;
    priceInputElm.value = product.price;
    // change the button submit
    submitBtnElm.textContent = "Update Product";
    submitBtnElm.classList.add("btn-secondary");
    submitBtnElm.classList.add("update-product");
    submitBtnElm.setAttribute("data-id", product.id);
  }
  function handleManipulateProduct(e) {
    // get the product id
    const id = getProductId(e);
    if (e.target.classList.contains("delete-product")) {
      // remove item from data store
      removeItem(id);
      // remove from local storage
      removeProductsFromLocalStorage(id);
      console.log(products);
      // remove item from ui
      removeItemFromUI(id);
      // console.log(id);
    } else if (e.target.classList.contains("edit-product")) {
      // finding the id
      const foundProduct = findProduct(id);
      // populate existing product in edit state
      populateEditForm(foundProduct);
      // update existing product

      console.log(foundProduct);
    }
  }

  function showAllProductsToUI(products) {
    // clear existing content from collectionElm/Ul
    collectionElm.textContent = "";
    // console.log(products);
    // Looping
    let liElm;
    liElm =
      products?.length === 0
        ? "<li class=' d-flex flex-row justify-content-between not-found-product'>No products to show</li>"
        : "";
    // sorting products
    products.sort((a, b) => b.id - a.id);
    products.forEach((product) => {
      const { id, name, price } = product;
      liElm += `<li
                class="list-group-item collection-item d-flex flex-row justify-content-between"
                data-productId="${id}"
              >
                <div class="product-info">
                  <strong>${name}</strong>- <span class="price">$${price}</span>
                </div>
                <div class="action-btn">
                  <i class="fa fa-pencil-alt edit-product me-2"></i>
                  <i class="fa fa-trash-alt delete-product"></i>
                </div>
              </li>`;
    });
    collectionElm.insertAdjacentHTML("afterbegin", liElm);
  }
  function handleFilter(e) {
    console.log("Trigger", e.target.value);
    const text = e.target.value;
    //filter the list
    const filteredProducts = products.filter((product) =>
      product.name.includes(text.toLowerCase())
    );

    showAllProductsToUI(filteredProducts);
  }
  function init() {
    form.addEventListener("submit", handleFormSubmit);

    collectionElm.addEventListener("click", handleManipulateProduct);
    filteredInputElm.addEventListener("keyup", handleFilter);
    document.addEventListener("DOMContentLoaded", () => {
      showAllProductsToUI(products);
    });
  }
  init();
})();
