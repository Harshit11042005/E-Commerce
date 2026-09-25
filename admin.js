/* =========================================================
   FreshBasket Owner Dashboard
   ========================================================= */

const PRODUCTS_KEY =
  "fb_products";


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

  const data =
    localStorage.getItem(
      PRODUCTS_KEY
    );


  if (data === null) {

    const seeded =
      seedProducts();


    localStorage.setItem(
      PRODUCTS_KEY,
      JSON.stringify(seeded)
    );


    return seeded;

  }


  try {

    return JSON.parse(data);

  } catch (error) {

    const seeded =
      seedProducts();


    localStorage.setItem(
      PRODUCTS_KEY,
      JSON.stringify(seeded)
    );


    return seeded;

  }

}


function saveProducts(list) {

  localStorage.setItem(
    PRODUCTS_KEY,
    JSON.stringify(list)
  );

}


function fmt(n) {

  return "$" +
    Number(n).toFixed(2);

}


function uid() {

  return (
    "p" +
    Date.now() +
    Math.random()
      .toString(36)
      .slice(2, 6)
  );

}


/* =========================================================
   DOM REFERENCES
   ========================================================= */

const form =
  document.getElementById(
    "product-form"
  );


const formTitle =
  document.getElementById(
    "form-title"
  );


const saveBtn =
  document.getElementById(
    "save-btn"
  );


const cancelEditBtn =
  document.getElementById(
    "cancel-edit"
  );


const listEl =
  document.getElementById(
    "admin-list"
  );


const emptyEl =
  document.getElementById(
    "admin-empty"
  );


const countEl =
  document.getElementById(
    "prod-count"
  );


const toast =
  document.getElementById(
    "toast"
  );


const f = {

  id:
    document.getElementById(
      "p-id"
    ),

  name:
    document.getElementById(
      "p-name"
    ),

  price:
    document.getElementById(
      "p-price"
    ),

  unit:
    document.getElementById(
      "p-unit"
    ),

  category:
    document.getElementById(
      "p-category"
    ),

  stock:
    document.getElementById(
      "p-stock"
    ),

  image:
    document.getElementById(
      "p-image"
    ),

  desc:
    document.getElementById(
      "p-desc"
    )

};


let products =
  getProducts();


/* =========================================================
   RENDER ADMIN PRODUCT LIST
   ========================================================= */

function renderList() {

  listEl.innerHTML =
    "";


  emptyEl.hidden =
    products.length > 0;


  countEl.textContent =
    products.length;


  products.forEach(product => {

    const row =
      document.createElement("div");


    row.className =
      "admin-item";


    const stockWarn =
      product.stock <= 10
        ? `style="color:#c62828;font-weight:700"`
        : "";


    row.innerHTML = `

      ${
        product.image

          ?

          `<img
            class="thumb"
            src="${product.image}"
            alt="${product.name}"
            onerror="this.outerHTML='<div class=thumb>${CATEGORY_EMOJI[product.category] || "🥗"}</div>'"
          >`

          :

          `<div class="thumb">
            ${
              CATEGORY_EMOJI[
                product.category
              ] || "🥗"
            }
          </div>`
      }


      <div class="admin-item-info">

        <div class="admin-item-name">
          ${product.name}
        </div>


        <div class="admin-item-meta">

          ${product.category}

          ·

          ${fmt(product.price)}

          /

          ${product.unit}

          ·

          <span ${stockWarn}>
            ${product.stock} in stock
          </span>

        </div>

      </div>


      <div class="admin-item-actions">

        <button
          class="btn btn-ghost"
          data-a="edit"
          type="button"
        >
          ✏️ Edit
        </button>


        <button
          class="btn btn-danger"
          data-a="del"
          type="button"
        >
          🗑️ Delete
        </button>

      </div>

    `;


    row
      .querySelector(
        '[data-a="edit"]'
      )
      .addEventListener(
        "click",
        () =>
          startEdit(product.id)
      );


    row
      .querySelector(
        '[data-a="del"]'
      )
      .addEventListener(
        "click",
        () =>
          removeProduct(product.id)
      );


    listEl.appendChild(row);

  });

}


/* =========================================================
   ADD / EDIT PRODUCT
   ========================================================= */

form.addEventListener(
  "submit",
  event => {

    event.preventDefault();


    const editingId =
      f.id.value;


    const product = {

      id:
        editingId ||
        uid(),

      name:
        f.name.value.trim(),

      price:
        parseFloat(
          f.price.value
        ),

      unit:
        f.unit.value,

      category:
        f.category.value,

      stock:
        parseInt(
          f.stock.value,
          10
        ),

      image:
        f.image.value.trim(),

      desc:
        f.desc.value.trim()

    };


    if (
      !product.name ||
      Number.isNaN(product.price) ||
      Number.isNaN(product.stock)
    ) {

      return;

    }


    if (editingId) {

      const index =
        products.findIndex(
          p => p.id === editingId
        );


      if (index > -1) {

        products[index] =
          product;

      }


      showToast(
        `✏️ "${product.name}" updated!`
      );

    } else {

      products.push(
        product
      );


      showToast(
        `✅ "${product.name}" added to your store!`
      );

    }


    saveProducts(
      products
    );


    resetForm();

    renderList();

  }
);


/* =========================================================
   EDIT PRODUCT
   ========================================================= */

function startEdit(id) {

  const product =
    products.find(
      p => p.id === id
    );


  if (!product) {

    return;

  }


  f.id.value =
    product.id;


  f.name.value =
    product.name;


  f.price.value =
    product.price;


  f.unit.value =
    product.unit;


  f.category.value =
    product.category;


  f.stock.value =
    product.stock;


  f.image.value =
    product.image;


  f.desc.value =
    product.desc;


  formTitle.textContent =
    "✏️ Edit Ingredient";


  saveBtn.textContent =
    "Save Changes";


  cancelEditBtn.hidden =
    false;


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =========================================================
   RESET FORM
   ========================================================= */

function resetForm() {

  form.reset();


  f.id.value =
    "";


  formTitle.textContent =
    "➕ Add New Ingredient";


  saveBtn.textContent =
    "Add Ingredient";


  cancelEditBtn.hidden =
    true;

}


cancelEditBtn.addEventListener(
  "click",
  resetForm
);


/* =========================================================
   DELETE PRODUCT
   ========================================================= */

function removeProduct(id) {

  const product =
    products.find(
      p => p.id === id
    );


  if (!product) {

    return;

  }


  if (
    !confirm(
      `Delete "${product.name}" from your store?`
    )
  ) {

    return;

  }


  products =
    products.filter(
      p => p.id !== id
    );


  saveProducts(
    products
  );


  renderList();


  showToast(
    `🗑️ "${product.name}" deleted.`
  );

}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer;


function showToast(message) {

  toast.textContent =
    message;


  toast.hidden =
    false;


  clearTimeout(
    toastTimer
  );


  toastTimer =
    setTimeout(
      () =>
        toast.hidden =
          true,
      2600
    );

}


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


      renderList();

    }

  }
);


/* =========================================================
   INITIALIZE
   ========================================================= */

renderList();