import { servicesProducts } from "../services/product-services.js";

const productsContainer = document.querySelector("[data-product]");
const form = document.querySelector("[data-form]");
const searchInput = document.querySelector("#searchInput");  // Aquí está el input de búsqueda

// Crea la estructura HTML para ser renderizada dinámicamente con JS
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
  productsContainer.innerHTML = ""; // Limpiamos los productos previos

  try {
    const listProducts = products.length > 0 ? products : await servicesProducts.productList();
    listProducts.forEach((product) => {
      const productCard = createCard(product);
      productsContainer.appendChild(productCard);
    });
  } catch (err) {
    console.error("Error al renderizar productos:", err);
  }
};

// Manejo del evento de envío del formulario para agregar productos
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.querySelector("[data-name]").value;
  const price = document.querySelector("[data-price]").value;
  const image = document.querySelector("[data-image]").value;

  if (name === "" || price === "" || image === "") {
    alert("Por favor, complete todos los campos");
  } else {
    try {
      // Enviar la solicitud para crear un nuevo producto
      const newProduct = await servicesProducts.createProduct(name, price, image);
      console.log("Producto creado:", newProduct);

      // Crear la tarjeta del nuevo producto y agregarla al contenedor
      const newCard = createCard(newProduct);
      productsContainer.appendChild(newCard);
    } catch (error) {
      console.error("Error al crear el producto:", error);
    }

    // Reiniciar el formulario
    form.reset();
  }
});

// Función de búsqueda
const searchProducts = async () => {
  const searchQuery = searchInput.value.toLowerCase(); // Convertimos a minúsculas para que no importe si el usuario escribe en mayúsculas o minúsculas

  try {
    const listProducts = await servicesProducts.productList();
    const filteredProducts = listProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery) // Filtramos los productos que contengan la palabra del input
    );

    // Renderizamos los productos filtrados
    renderProducts(filteredProducts);
  } catch (err) {
    console.error("Error al buscar productos:", err);
  }
};

// Agregar el evento al input de búsqueda
searchInput.addEventListener("input", searchProducts); // Usamos 'input' en lugar de 'click' para que busque mientras el usuario escribe

// Ejecuta la función de renderizado inicial
renderProducts();
