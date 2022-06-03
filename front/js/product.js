// Déclaration des constantes

const str = window.location.href;
const url = new URL(str);
const id = url.searchParams.get("id");

// Récupération des id des produits

fetch(`http://localhost:3000/api/products/${id}`)
  .then((response) => response.json())
  .then((res) => pickUpCouch(res))
  .catch((error) => {
    alert("Impossible de contacter l'API");
  });

// On attribue à chaque produit via son id les différents paramètres
// Qu'on envoie ensuite aux fonctions de créations des différents éléments html

function pickUpCouch(couch) {
  const altTxt = couch.altTxt;
  const colors = couch.colors;
  const description = couch.description;
  const imageUrl = couch.imageUrl;
  const name = couch.name;
  const price = couch.price;
  const _id = couch._id;
  makeImage(imageUrl, altTxt);
  makeTitle(name);
  makePrice(price);
  makeDescription(description);
  makeColors(colors);
}

// Fonctions de création des différents éléments html

function makeImage(imageUrl, altTxt) {
  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = altTxt;
  const parent = document.querySelector(".item__img");
  parent.appendChild(image);
}

function makeTitle(name) {
  const h1 = (document.querySelector("#title").textContent = name);
}

function makePrice(price) {
  const span = (document.querySelector("#price").textContent = price);
}

function makeDescription(description) {
  const p = (document.querySelector("#description").textContent = description);
}

function makeColors(colors) {
  const select = document.querySelector("#colors");
  colors.forEach((color) => {
    const option = document.createElement("option");
    option.value = color;
    option.textContent = color;
    select.appendChild(option);
  });
}

const button = document.querySelector("#addToCart");
if (button != null) {
  //Ecoute et messages d'alerte

  button.addEventListener("click", (event) => {
    const color = document.querySelector("#colors").value;
    const quantity = document.querySelector("#quantity").value;
    if (!color) {
      alert("Please select a color");
      return;
    }
    if (quantity < 1 || quantity > 100) {
      alert("Please select a valid quantity");
      return;
    }

    //Construction de l'objet product

    const product = {
      id: id,
      color: color,
      quantity: new Number(quantity),
    };
    let cartEmptyArray = [];

    //On récupère le cart depuis le local Storage
    const cart = JSON.parse(localStorage.getItem("cart"));
    if (cart && cart.length) {
      cartEmptyArray = cart;
      // On vérifie si le produit ajouté existe déjà dans le local Storage
      const matchProduct = cart.find((product) => {
        if (product.id === id && product.color === color) {
          return product;
        }
      });
      // On ajoute la quantité
      if (matchProduct != null) {
        matchProduct.quantity += new Number(quantity);
      } else {
        cartEmptyArray.push(product);
      }
    } else {
      cartEmptyArray.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cartEmptyArray));

    window.location.href = "./cart.html";
  });
}
