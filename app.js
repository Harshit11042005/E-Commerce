/* =========================================================
   FreshBasket Storefront
   ========================================================= */

const PRODUCTS_KEY = "fb_products";
const CART_KEY = "fb_cart";


/* =========================================================
   CATEGORY EMOJIS
   ========================================================= */

const CATEGORY_EMOJI = {

  "Spices": "🌶️",

  "Grains & Pulses": "🌾",

  "Dairy & Eggs": "🥛",

  "Fruits & Vegetables": "🥬",

  "Baking": "🍞",

  "Oils & Condiments": "🫒"

};


/* =========================================================
   SEED PRODUCTS
   ========================================================= */

function seedProducts() {

  return [

    {
      id: "p1",
      name: "Organic Turmeric Powder — Stone-Ground, Single-Origin, High Curcumin Content",
      price: 4.99,
      unit: "250g pack",
      category: "Spices",
      stock: 60,
      image: "",
      desc: "Stone-ground, single-origin turmeric with rich curcumin."
    },

    {
      id: "p2",
      name: "Premium Aged Basmati Rice, Extra-Long Grain, Naturally Aged 2 Years",
      price: 12.50,
      unit: "1 kg",
      category: "Grains & Pulses",
      stock: 40,
      image: "",
      desc: "Extra-long grain, naturally aged 2 years for aroma."
    },

    {
      id: "p3",
      name: "Farm Fresh Free-Range Eggs, Collected Daily, Pack of 12",
      price: 3.20,
      unit: "12 ct",
      category: "Dairy & Eggs",
      stock: 120,
      image: "",
      desc: "Free-range eggs collected daily from local farms."
    },

    {
      id: "p4",
      name: "Organic Heirloom Tomatoes, Vine-Ripened, Sweet and Juicy",
      price: 2.80,
      unit: "1 kg",
      category: "Fruits & Vegetables",
      stock: 25,
      image: "",
      desc: "Vine-ripened, sweet and juicy — perfect for salads."
    },

    {
      id: "p5",
      name: "Unbleached All-Purpose Flour, Finely Milled for Breads and Cakes",
      price: 2.40,
      unit: "1 kg",
      category: "Baking",
      stock: 80,
      image: "",
      desc: "Unbleached, finely milled flour for breads and cakes."
    },

    {
      id: "p6",
      name: "Extra Virgin Olive Oil, Cold-Pressed First Harvest, Peppery & Bright",
      price: 9.90,
      unit: "1 L",
      category: "Oils & Condiments",
      stock: 30,
      image: "",
      desc: "Cold-pressed, first harvest — peppery and bright."
    },

    {
      id: "p7",
      name: "Premium Green Cardamom Whole Pods, Intensely Aromatic, Grade A",
      price: 14.00,
      unit: "250g pack",
      category: "Spices",
      stock: 8,
      image: "",
      desc: "Premium whole pods, intensely aromatic."
    },

    {
      id: "p8",
      name: "Red Lentils (Masoor Dal), Quick-Cooking, Protein-Rich, Split",
      price: 5.60,
      unit: "1 kg",
      category: "Grains & Pulses",
      stock: 55,
      image: "",
      desc: "Quick-cooking, protein-rich split lentils."
    }

  ];

}


/* =========================================================
   PRODUCT STORAGE
   ========================================================= */

function getProducts() {

  const data = localStorage.getItem(PRODUCTS_KEY);

  if (data === null) {

    const seeded = seedProducts();

    localStorage.setItem(
      PRODUCTS_KEY,
      JSON.stringify(seeded)
    );

    return seeded;

  }

  try {

    return JSON.parse(data);

  } catch (error) {

    const seeded = seedProducts();

    localStorage.setItem(
      PRODUCTS_KEY,
      JSON.stringify(seeded)
    );

    return seeded;

  }

}


/* =========================================================
   CART STORAGE
   ========================================================= */

function getCart() {

  try {

    return JSON.parse(
      localStorage.getItem(CART_KEY) || "[]"
    );

  } catch (error) {

    return [];

  }

}


function saveCart(cart) {

  localStorage.setItem(
    CART_KEY,
    JSON.stringify(cart)
  );

}


/* =========================================================
   PRICE FORMAT
   ========================================================= */

function fmt(n) {

  return "$" + Number(n).toFixed(2);

}


/* =========================================================
   RATINGS
   ========================================================= */

function ratingOf(product) {

  let h = 0;

  for (const ch of product.id) {

    h =
      (h * 31 + ch.charCodeAt(0)) %
      997;

  }

  return (
    3.6 + (h % 14) / 10
  ).toFixed(1);

}


function starsOf(rating) {

  const full = Math.round(rating);

  return (
    "★".repeat(full) +
    "☆".repeat(5 - full)
  );

}


/* =========================================================
   DOM REFERENCES
   ========================================================= */

const grid =
  document.getElementById("product-grid");

const emptyMsg =
  document.getElementById("empty-msg");

const searchInput =
  document.getElementById("search-input");

const categoryFilter =
  document.getElementById("category-filter");

const resultsBar =
  document.getElementById("results-bar");


let products = getProducts();


/* =========================================================
   CATEGORY FILTER
   ========================================================= */

function renderCategories() {

  const cats = [
    ...new Set(
      products.map(product => product.category)
    )
  ];

  cats.forEach(category => {

    const option =
      document.createElement("option");

    option.value = category;
    option.textContent = category;

    categoryFilter.appendChild(option);

  });

}


/* =========================================================
   PRICE PARTS
   ========================================================= */

function priceParts(price) {

  const [
    whole,
    fraction
  ] =
    Number(price)
      .toFixed(2)
      .split(".");

  return {
    whole,
    fraction
  };

}


/* =========================================================
   RENDER PRODUCTS
   ========================================================= */

function renderProducts() {

  const q =
    searchInput.value
      .trim()
      .toLowerCase();

  const cat =
    categoryFilter.value;


  const filtered =
    products.filter(product => {

      const matchQ =
        product.name
          .toLowerCase()
          .includes(q)

        ||

        (product.desc || "")
          .toLowerCase()
          .includes(q);


      const matchC =
        cat === "all" ||
        product.category === cat;


      return matchQ && matchC;

    });


  resultsBar.innerHTML =
    `<strong>${filtered.length} result${filtered.length !== 1 ? "s" : ""}</strong>` +

    (
      q
        ? ` for "<strong>${q}</strong>"`
        : ""
    ) +

    (
      cat !== "all"
        ? ` in <strong>${cat}</strong>`
        : ""
    );


  grid.innerHTML = "";

  emptyMsg.hidden =
    filtered.length > 0;


  filtered.forEach(product => {

    const card =
      document.createElement("div");

    card.className =
      "product-card";


    const {
      whole,
      fraction
    } =
      priceParts(product.price);


    const rating =
      ratingOf(product);


    const out =
      product.stock <= 0;


    const low =
      !out &&
      product.stock <= 10;


    const bestSeller =
      product.stock >= 50;


    let badges = "";


    if (bestSeller) {

      badges +=
        `<span class="badge-bestseller">Best Seller</span>`;

    }


    if (low) {

      badges +=
        `<span class="badge-lowstock">Only ${product.stock} left!</span>`;

    }


    const imgHtml =
      product.image

        ?

        `<img
          src="${product.image}"
          alt="${product.name}"
          onerror="this.outerHTML='<div class=product-emoji>${CATEGORY_EMOJI[product.category] || "🥗"}</div>'"
        >`

        :

        `<div class="product-emoji">
          ${CATEGORY_EMOJI[product.category] || "🥗"}
        </div>`;


    card.innerHTML = `

      ${badges}

      <div class="product-img">
        ${imgHtml}
      </div>

      <div
        class="product-title"
        title="${product.name}"
      >
        ${product.name}
      </div>

      <div class="rating-row">

        <span class="stars">
          ${starsOf(rating)}
        </span>

        <span class="rating-count">
          ${(
            ratingOf(product) * 137 % 9000 + 400
          )
            .toFixed(0)
            .replace(
              /\B(?=(\d{3})+(?!\d))/g,
              ","
            )}
        </span>

      </div>

      <div class="price-row">

        <span class="price-currency">
          $
        </span>

        <span class="price-whole">
          ${whole}
        </span>

        <span class="price-fraction">
          ${fraction}
        </span>

        <span class="price-unit">
          (${product.unit})
        </span>

      </div>

      <div
        class="stock-line ${
          out
            ? "out"
            : low
              ? "low"
              : ""
        }"
      >

        ${
          out
            ? "Currently unavailable"
            : low
              ? `Hurry — only ${product.stock} left in stock!`
              : "In stock"
        }

      </div>


      <button
        class="btn-addcart"
        ${out ? "disabled" : ""}
        type="button"
      >
        ${
          out
            ? "Out of Stock"
            : "Add to Cart"
        }
      </button>


      ${
        out
          ? ""
          : `<button
              class="btn-buynow"
              type="button"
            >
              Buy Now
            </button>`
      }

    `;


    card
      .querySelector(".btn-addcart")
      .addEventListener(
        "click",
        () => addToCart(product.id)
      );


    const buyBtn =
      card.querySelector(".btn-buynow");


    if (buyBtn) {

      buyBtn.addEventListener(
        "click",
        () => addToCart(product.id, true)
      );

    }


    grid.appendChild(card);

  });

}


/* =========================================================
   CART DOM
   ========================================================= */

const cartBtn =
  document.getElementById("cart-btn");

const cartDrawer =
  document.getElementById("cart-drawer");

const cartOverlay =
  document.getElementById("cart-overlay");

const cartItemsEl =
  document.getElementById("cart-items");

const cartTotalEl =
  document.getElementById("cart-total");

const cartCountEl =
  document.getElementById("cart-count");


/* =========================================================
   ADD TO CART
   ========================================================= */

function addToCart(
  id,
  goCheckout = false
) {

  const cart =
    getCart();


  const item =
    cart.find(
      cartItem => cartItem.id === id
    );


  const product =
    products.find(
      product => product.id === id
    );


  if (
    !product ||
    product.stock <= 0
  ) {

    return;

  }


  if (item) {

    if (
      item.qty <
      product.stock
    ) {

      item.qty += 1;

    } else {

      alert(
        `Only ${product.stock} item${
          product.stock === 1
            ? ""
            : "s"
        } available in stock.`
      );

    }

  } else {

    cart.push({
      id,
      qty: 1
    });

  }


  saveCart(cart);

  renderCart();


  if (goCheckout) {

    openCart();

  }

}


/* =========================================================
   RENDER CART
   ========================================================= */

function renderCart() {

  let cart =
    getCart();


  let changed =
    false;


  /* Remove deleted/out-of-stock products */

  cart =
    cart.filter(item => {

      const product =
        products.find(
          p => p.id === item.id
        );


      if (
        !product ||
        product.stock <= 0
      ) {

        changed = true;

        return false;

      }


      const safeQty =
        Math.min(
          Math.max(
            Number(item.qty) || 1,
            1
          ),
          product.stock
        );


      if (
        safeQty !== item.qty
      ) {

        item.qty =
          safeQty;

        changed =
          true;

      }


      return true;

    });


  if (changed) {

    saveCart(cart);

  }


  const totalQty =
    cart.reduce(
      (sum, item) =>
        sum + item.qty,
      0
    );


  cartCountEl.textContent =
    totalQty;


  cartItemsEl.innerHTML =
    "";


  let total =
    0;


  if (cart.length === 0) {

    cartItemsEl.innerHTML =
      `<p class="empty-msg">
        Your FreshBasket Cart is empty.
      </p>`;

  }


  cart.forEach(item => {

    const product =
      products.find(
        p => p.id === item.id
      );


    if (!product) {

      return;

    }


    total +=
      product.price *
      item.qty;


    const qtyOpts =
      Array.from(
        {
          length:
            Math.min(
              10,
              product.stock
            )
        },
        (_, i) =>

          `<option
            value="${i + 1}"
            ${
              i + 1 === item.qty
                ? "selected"
                : ""
            }
          >
            Qty: ${i + 1}
          </option>`

      ).join("");


    const row =
      document.createElement("div");


    row.className =
      "cart-item";


    row.innerHTML = `

      <div class="cart-item-thumb">
        ${
          product.image
            ? "🖼️"
            : (
                CATEGORY_EMOJI[
                  product.category
                ] || "🥗"
              )
        }
      </div>


      <div class="cart-item-info">

        <div class="cart-item-name">
          ${product.name}
        </div>

        <span class="instock-note">
          In stock: ${product.stock}
        </span>

        <div class="cart-item-price">
          ${fmt(product.price)}
        </div>


        <div
          class="qty-controls"
          style="margin-top:6px"
        >

          <select class="qty-select">
            ${qtyOpts}
          </select>

          <button
            class="remove-link"
            type="button"
          >
            Delete
          </button>

        </div>

      </div>

    `;


    row
      .querySelector(".qty-select")
      .addEventListener(
        "change",
        event =>

          setQty(
            item.id,
            parseInt(
              event.target.value,
              10
            )
          )
      );


    row
      .querySelector(".remove-link")
      .addEventListener(
        "click",
        () => removeFromCart(item.id)
      );


    cartItemsEl.appendChild(row);

  });


  cartTotalEl.textContent =
    fmt(total);

}


/* =========================================================
   CHANGE QUANTITY
   ========================================================= */

function setQty(
  id,
  qty
) {

  let cart =
    getCart();


  const item =
    cart.find(
      cartItem =>
        cartItem.id === id
    );


  if (!item) {

    return;

  }


  item.qty =
    qty;


  if (
    item.qty <= 0
  ) {

    cart =
      cart.filter(
        cartItem =>
          cartItem.id !== id
      );

  }


  saveCart(cart);

  renderCart();

}


/* =========================================================
   REMOVE FROM CART
   ========================================================= */

function removeFromCart(id) {

  saveCart(
    getCart().filter(
      item => item.id !== id
    )
  );


  renderCart();

}


/* =========================================================
   OPEN / CLOSE CART
   ========================================================= */

function openCart() {

  cartDrawer.hidden =
    false;

  cartOverlay.hidden =
    false;

}


function closeCart() {

  cartDrawer.hidden =
    true;

  cartOverlay.hidden =
    true;

}


/* =========================================================
   CART EVENTS
   ========================================================= */

cartBtn.addEventListener(
  "click",
  openCart
);


document
  .getElementById("close-cart")
  .addEventListener(
    "click",
    closeCart
  );


cartOverlay.addEventListener(
  "click",
  closeCart
);


/* =========================================================
   CHECKOUT
   ========================================================= */

document
  .getElementById("checkout-btn")
  .addEventListener(
    "click",
    () => {

      const cart =
        getCart();


      if (
        cart.length === 0
      ) {

        return;

      }


      cart.forEach(item => {

        const product =
          products.find(
            p => p.id === item.id
          );


        if (product) {

          product.stock =
            Math.max(
              0,
              product.stock -
                item.qty
            );

        }

      });


      localStorage.setItem(
        PRODUCTS_KEY,
        JSON.stringify(products)
      );


      saveCart([]);


      renderCart();

      renderProducts();

      closeCart();


      alert(
        "✅ Order placed! Thank you for shopping at FreshBasket."
      );

    }
  );


/* =========================================================
   SEARCH & FILTERS
   ========================================================= */

searchInput.addEventListener(
  "input",
  renderProducts
);


categoryFilter.addEventListener(
  "change",
  renderProducts
);


document
  .getElementById("search-form")
  .addEventListener(
    "submit",
    event => {
      event.preventDefault();
    }
  );


/* =========================================================
   CATEGORY NAVIGATION
   ========================================================= */

document
  .querySelectorAll("[data-category]")
  .forEach(link => {

    link.addEventListener(
      "click",
      event => {

        event.preventDefault();


        const category =
          link.dataset.category;


        categoryFilter.value =
          category;


        searchInput.value =
          "";


        renderProducts();


        document
          .getElementById(
            "product-grid"
          )
          .scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

      }
    );

  });


/* =========================================================
   TODAY'S DEALS
   ========================================================= */

document
  .getElementById("subnav-deals")
  .addEventListener(
    "click",
    event => {

      event.preventDefault();


      products =
        [...products].sort(
          (a, b) =>
            a.price - b.price
        );


      renderProducts();

    }
  );


/* =========================================================
   BACK TO TOP
   ========================================================= */

document
  .getElementById("back-to-top")
  .addEventListener(
    "click",
    () => {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }
  );


/* =========================================================
   STORAGE SYNC
   ========================================================= */

window.addEventListener(
  "storage",
  event => {

    if (
      event.key ===
      PRODUCTS_KEY
    ) {

      products =
        getProducts();


      categoryFilter.innerHTML =
        `<option value="all">All</option>`;


      renderCategories();

      renderProducts();

      renderCart();

    }


    if (
      event.key ===
      CART_KEY
    ) {

      renderCart();

    }

  }
);


/* =========================================================
   INITIALIZE
   ========================================================= */

renderCategories();

renderProducts();

renderCart();