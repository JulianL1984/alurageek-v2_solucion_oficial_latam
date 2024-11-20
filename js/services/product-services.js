const BASE_URL = "http://localhost:3001/products";

const productList = async () => {
  try {
    const response = await fetch(BASE_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener la lista de productos:", error);
  }
};

const createProduct = async (name, price, image) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, price, image }),
    });

    // Verificamos si la respuesta es exitosa
    if (!response.ok) {
      throw new Error('Error al crear el producto');
    }

    const data = await response.json();
    console.log("Producto creado con éxito:", data);
    return data; // Devolvemos el producto creado
  } catch (error) {
    console.error("Error en la solicitud POST:", error);
  }
};

const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Verificamos si la eliminación fue exitosa
    if (!response.ok) {
      throw new Error('Error al eliminar el producto');
    }

    console.log(`Producto con id ${id} eliminado exitosamente`);
  } catch (error) {
    console.error("Error en la solicitud DELETE:", error);
  }
};

export const servicesProducts = {
  productList,
  createProduct,
  deleteProduct,
};
