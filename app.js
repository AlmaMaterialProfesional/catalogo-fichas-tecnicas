const state = {
  products: [],
};

const grid = document.getElementById("grid");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("category-filter");
const emptyMessage = document.getElementById("empty-message");

const DIACRITICS_PATTERN = new RegExp(
  "[" + String.fromCharCode(0x0300) + "-" + String.fromCharCode(0x036f) + "]",
  "g"
);

function normalize(text) {
  return (text || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(DIACRITICS_PATTERN, "");
}

function renderCard(product) {
  const card = document.createElement("article");
  card.className = "card";

  const imageWrap = document.createElement("div");
  imageWrap.className = "card-image";
  if (product.image) {
    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.title || "";
    img.loading = "lazy";
    imageWrap.appendChild(img);
  } else {
    const placeholder = document.createElement("span");
    placeholder.className = "placeholder";
    placeholder.textContent = "Sin imagen";
    imageWrap.appendChild(placeholder);
  }

  const body = document.createElement("div");
  body.className = "card-body";

  const title = document.createElement("h2");
  title.className = "card-title";
  title.textContent = product.title || "Sin nombre";
  body.appendChild(title);

  if (product.code) {
    const code = document.createElement("span");
    code.className = "card-code";
    code.textContent = product.code;
    body.appendChild(code);
  }

  if (product.category) {
    const category = document.createElement("span");
    category.className = "card-category";
    category.textContent = product.category;
    body.appendChild(category);
  }

  const link = document.createElement(product.pdf ? "a" : "span");
  link.className = "card-link" + (product.pdf ? "" : " disabled");
  link.textContent = product.pdf ? "Ver ficha técnica" : "Ficha no disponible";
  if (product.pdf) {
    link.href = product.pdf;
    link.target = "_blank";
    link.rel = "noopener";
  }
  body.appendChild(link);

  card.appendChild(imageWrap);
  card.appendChild(body);
  return card;
}

function populateCategories(products) {
  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "es"));

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function applyFilters() {
  const query = normalize(searchInput.value);
  const category = categoryFilter.value;

  const filtered = state.products.filter((product) => {
    const matchesQuery =
      !query ||
      normalize(product.title).includes(query) ||
      normalize(product.code).includes(query);
    const matchesCategory = !category || product.category === category;
    return matchesQuery && matchesCategory;
  });

  grid.innerHTML = "";
  filtered.forEach((product) => grid.appendChild(renderCard(product)));
  emptyMessage.hidden = filtered.length !== 0;
}

async function init() {
  try {
    const response = await fetch("content/products.json", { cache: "no-store" });
    const data = await response.json();
    state.products = Array.isArray(data.products) ? data.products : [];
  } catch (err) {
    state.products = [];
  }

  populateCategories(state.products);
  applyFilters();
}

searchInput.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);

init();
