"use strict";

/**
 * add event on element
 */

const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
};

/**
 * navbar toggle
 */

const navToggler = document.querySelector("[data-nav-toggler]");
const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  navToggler.classList.toggle("active");
};

addEventOnElem(navToggler, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  navToggler.classList.remove("active");
};

addEventOnElem(navbarLinks, "click", closeNavbar);

/**
 * active header when window scroll down to 100px
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const activeElemOnScroll = function () {
  if (window.scrollY > 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
};

addEventOnElem(window, "scroll", activeElemOnScroll);

const products = {
  products: [
    {
      id: "BpgOhubtfuAaQHLoZzOU",
      name: "Coucou Can Kaleng Adult Cat Halcyon Chicken 400 gr",
      image: "https://foodbuy-id.s3.ap-southeast-3.amazonaws.com/products/primary/800/1705559574_65a8c61639798_324.png",
      desc: "Coucou Can Kaleng Adult Cat Halcyon Chicken 400 gr",
      price: 25000,
      stock: 20,
      storeName: "Saheb Official Store",
      storeId: "saheb",
    },
    {
      id: "Data produk lainnya",
      name: "",
      image: "",
      desc: "",
      price: 0,
      stock: 0,
      storeName: "",
      storeId: "",
    },
  ],
  totalItems: 50,
  totalPages: 3,
};

const product = {
  id: "4eVkzBbSMRoK36piFYa7",
  name: "Meo Can Adult Pilchard in Prawn Jelly 400 gr",
  image: "https://foodbuy-id.s3.ap-southeast-3.amazonaws.com/products/primary/1707383429_65c49a8534a03_324.png",
  desc: "Meo Can Adult Pilchard in Prawn Jelly 400 gr, Makanan kucing sehat untuk anabul",
  price: 25000,
  stock: 7,
  storeName: "Saheb Official Store",
  storeId: "saheb",
};

const searchProducts = {
  id: "7PSWII978WmMgLWxzHbS",
  name: "Harness Anjing Besar",
  image: "https://firebasestorage.googleapis.com/v0/b/saheb-2d8c9.appspot.com/o/products%2Fharness%20anjing%20besar.jpeg?alt=media&token=14da0f49-a98c-4fe7-a70f-5afef4b98127",
  desc: "Harness Anjing Besar",
  price: 200000,
  stock: 2,
  storeName: "Saheb Official Store",
  storeId: "saheb",
  score: 12.864436254522488,
  terms: ["harness"],
  queryTerms: ["harness"],
  match: {
    harness: ["name", "desc"],
  },
};

const storeData = {
  id: "saheb",
  location: "Makassar, Sulawesi Selatan",
  name: "Saheb Official Store",
  profilePicture: "https://firebasestorage.googleapis.com/v0/b/saheb-2d8c9.appspot.com/o/storeProfilePicture%2Fsaheb%203.png?alt=media&token=bc425d5b-dd7a-43a8-b16c-a472d9fae187",
};

const storeProducts = {
  products: [
    {
      id: "5fodPwP1p7CWiPtvfXIL",
      name: "Lightning Dog Food Beef Flavor 800 gr",
      desc: "Lightning Dog Food Beef Flavor 800 gr",
      image: "https://foodbuy-id.s3.ap-southeast-3.amazonaws.com/products/primary/1707381753_65c493f9be2e7_324.png",
      price: 20000,
      stock: 7,
      storeId: "saheb",
      storeName: "Saheb Official Store",
    },
    {
      id: "AL6YODlKJfmNJSrCqeJ6",
      name: "CatDog Shampoo & Conditioner Anjing Kucing 2 in 1 - 250 mL",
      desc: "CatDog Shampoo & Conditioner Anjing Kucing 2 in 1 - 250 mL",
      image: "https://foodbuy-id.s3.ap-southeast-3.amazonaws.com/products/primary/1699949592_65532c18158ca_324.png",
      price: 40000,
      stock: 10,
      storeId: "saheb",
      storeName: "Saheb Official Store",
    },
  ],
  totalItems: 43,
  totalPages: 3,
};

const searchStoreProducts = [
  {
    id: "xQGkZGyf6Ha64Ghbry76",
    score: 5.51736568198994,
    terms: ["pedigree"],
    queryTerms: ["pedigree"],
    match: {
      pedigree: ["name", "desc"],
    },
    name: "Pedigree Dentastix Puppy 56 gr",
    price: 25000,
    stock: 10,
    desc: "Pedigree Dentastix Puppy 56 gr",
    image: "https://foodbuy-id.s3.ap-southeast-3.amazonaws.com/products/primary/1693375355_64eedb7b3097b_324.png",
    storeName: "Saheb Official Store",
    storeId: "saheb",
  },
  {
    id: "GED10Y3mTOj2qAc4AReH",
    score: 5.321606089405034,
    terms: ["pedigree"],
    queryTerms: ["pedigree"],
    match: {
      pedigree: ["name", "desc"],
    },
    name: "Pedigree Pro Puppy 1.3 kg",
    price: 150000,
    stock: 4,
    desc: "Pedigree Pro Puppy 1.3 kg",
    image: "https://foodbuy-id.s3.ap-southeast-3.amazonaws.com/products/primary/1707381847_65c494576a2f8_324.png",
    storeName: "Saheb Official Store",
    storeId: "saheb",
  },
];

const formatJson = (data) => JSON.stringify(data, null, 2);

const toggleDisplay = (buttonId, jsonId, data) => {
  document.getElementById(buttonId).addEventListener("click", () => {
    const jsonDataElement = document.getElementById(jsonId);
    if (jsonDataElement.style.display === "none" || jsonDataElement.style.display === "") {
      jsonDataElement.innerHTML = `<pre>${formatJson(data)}</pre>`;
      jsonDataElement.style.display = "block";
    } else {
      jsonDataElement.style.display = "none";
    }
  });
};

toggleDisplay("btn-products", "json-products", products);
toggleDisplay("btn-product-by-id", "json-product-by-id", product);
toggleDisplay("btn-product-by-search", "json-product-by-search", searchProducts);
toggleDisplay("btn-store", "json-store", storeData);
toggleDisplay("btn-store-products", "json-store-products", storeProducts);
toggleDisplay("btn-store-products-search", "json-store-products-search", searchStoreProducts);
