import { servicesProducts } from "../services/product-services.js";

const productsContainer = document.querySelector("[data-product]");
const searchInput = document.querySelector("#searchInput");  // Campo de búsqueda

// Crea estructura HTML para ser renderizada dinámicamente con JS
function createCard({ name, price, image, id }) {
  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
    <div class="img-container">
      <img src="${image}" alt="${name}">
    </div>
    <div class="card-container--info">
      <p>${name}</p>
      <div class="card-container--value">
        <p>$ ${price}</p>
        <button class="delete-button" data-id="${id}">
          <img src="./assets/trashIcon.svg" alt="Eliminar">
        </button>
      </div>
    </div>
  `;

  // Asigna el evento de eliminación
  addDeleteEvent(card, id);

  return card;
}

// Asigna el evento de eliminar producto a la tarjeta
function addDeleteEvent(card, id) {
  const deleteButton = card.querySelector(".delete-button");
  deleteButton.addEventListener("click", async () => {
    try {
      await servicesProducts.deleteProduct(id);
      card.remove();
      console.log(`Producto con id ${id} eliminado`);
    } catch (error) {
      console.error(`Error al eliminar el producto con id ${id}:`, error);
    }
  });
}

// Renderiza los productos en el DOM
const renderProducts = async (products = []) => {
  // Si no hay productos, muestra un mensaje
  if (products.length === 0) {
    productsContainer.innerHTML = "<p>No hay productos disponibles</p>";
    return;
  }

  // Limpia los productos actuales
  productsContainer.innerHTML = "";

  products.forEach((product) => {
    const productCard = createCard(product);
    productsContainer.appendChild(productCard);
  });
};

// Filtra productos por nombre
const filterProducts = (products, searchTerm) => {
  return products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

// Manejo de búsqueda
searchInput.addEventListener("input", async (event) => {
  const searchTerm = event.target.value;

  try {
    const listProducts = await servicesProducts.productList();
    const filteredProducts = filterProducts(listProducts, searchTerm);
    renderProducts(filteredProducts);
  } catch (err) {
    console.error("Error al renderizar productos:", err);
  }
});

// Ejecuta la función de renderizado inicial
const init = async () => {
  try {
    const listProducts = await servicesProducts.productList();
    renderProducts(listProducts);
  } catch (err) {
    console.error("Error al obtener la lista de productos:", err);
  }
};

init();  // Carga los productos al inicio
