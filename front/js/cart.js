// Déclaration des variables

let cart = [];
let totalPrice = 0;
let totalQuantity = 0;

// Récupère les items du panier et les fusionne avec les paramètres objet des items,

if (localStorage.cart != null) {
  cart = JSON.parse(localStorage.cart);
}
cart.forEach((product, index) => {
  fetch(`http://localhost:3000/api/products/${product.id}`)
    .then((response) => response.json())
    .then((res) => {
      product = {
        ...product,
        ...res,
      };
      makeArticle(product);
      if (index === cart.length - 1) {
        handleDelete();
        changeQuantity();
      }
      // Calcul du prix total et de la quantité totale
      totalPrice += product.price * product.quantity;
      document.getElementById("totalPrice").innerHTML = totalPrice;
      totalQuantity += product.quantity;
      document.getElementById("totalQuantity").innerHTML = totalQuantity;
    })
    .catch((error) => {
      alert("Impossible de contacter l'API");
    });
});

// Templating des articles du panier

function makeArticle(product) {
  const section = document.querySelector("#cart__items");
  section.innerHTML += `
  <article class="cart__item" data-id="${product.id}" data-color="${product.color}">
                <div class="cart__item__img">
                  <img src="${product.imageUrl}" alt="${product.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${product.color}</p>
                    <p>${product.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>
  `;
}

// Fonction Supprimer un item du panier

function handleDelete() {
  const deleteItemsButton = document.querySelectorAll(".deleteItem");
  deleteItemsButton.forEach((button) => {
    button.addEventListener("click", () => {
      const articleParent = button.closest("article");
      const id = articleParent.dataset.id;
      const color = articleParent.dataset.color;
      const productIndex = cart.findIndex((product) => {
        if (product.id === id && product.color === color) {
          return product;
        }
      });
      cart.splice(productIndex, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      window.location.reload();
    });
  });
}

// Fonction s'occupant du changement de la quantité

function changeQuantity() {
  let quantityInput = document.querySelectorAll(".itemQuantity");
  for (let k = 0; k < quantityInput.length; k++) {
    quantityInput[k].addEventListener("change", (event) => {
      event.preventDefault();
      // Selection de l'élément à modifier en fonction de son id ET sa couleur
      const articleParent = quantityInput[k].closest("article");
      const id = articleParent.dataset.id;
      const color = articleParent.dataset.color;
      const matchProduct = cart.find((product) => {
        if (product.id === id && product.color === color) {
          return product;
        }
      });
      matchProduct.quantity = new Number(event.target.value);
      localStorage.setItem("cart", JSON.stringify(cart));

      if (event.target.value <= 0) {
        const productIndex = cart.findIndex((product) => {
          if (product.id === id && product.color === color) {
            return product;
          }
        });
        cart.splice(productIndex, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        window.location.reload();
      }
      // refresh rapide
      location.reload();
    });
  }
}

// Formulaire
function RegexForm() {
  // Constantes des inputs

  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const addressInput = document.getElementById("address");
  const cityInput = document.getElementById("city");
  const emailInput = document.getElementById("email");

  //Constantes Regex

  let nameRegExp = new RegExp("^([^0-9]*)$");
  let addressRegExp = new RegExp(
    "^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+"
  );
  let emailRegExp = new RegExp(
    "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$"
  );

  //Ecoute et messages d'alerte
  firstNameInput.addEventListener("input", (event) => {
    const msgErreur = document.getElementById("firstNameErrorMsg");
    if (event.target.value.match(nameRegExp)) {
      msgErreur.innerHTML = "";
    } else {
      msgErreur.innerHTML = "Veuillez insérer uniquement des lettres";
    }
  });

  lastNameInput.addEventListener("input", (event) => {
    const msgErreur = document.getElementById("lastNameErrorMsg");
    if (event.target.value.match(nameRegExp)) {
      msgErreur.innerHTML = "";
    } else {
      msgErreur.innerHTML = "Veuillez insérer uniquement des lettres";
    }
  });

  addressInput.addEventListener("input", (event) => {
    const msgErreur = document.getElementById("addressErrorMsg");
    if (event.target.value.match(addressRegExp)) {
      msgErreur.innerHTML = "";
    } else {
      msgErreur.innerHTML = "Veuillez entrer une adresse valide";
    }
  });

  cityInput.addEventListener("input", (event) => {
    const msgErreur = document.getElementById("cityErrorMsg");
    if (event.target.value.match(nameRegExp)) {
      msgErreur.innerHTML = "";
    } else {
      msgErreur.innerHTML = "Veuillez entrer le nom d'une ville";
    }
  });

  emailInput.addEventListener("input", (event) => {
    const msgErreur = document.getElementById("emailErrorMsg");
    if (event.target.value.match(emailRegExp)) {
      msgErreur.innerHTML = "";
    } else {
      msgErreur.innerHTML = "Veuillez entrer une adresse email valide";
    }
  });
}
RegexForm();

// Envoi du panier vers le Local Storage

function sendToLocalStorage() {
  const form = document.querySelector(".cart__order__form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    //Récupération des coordonnées du formulaire client
    let inputFirstName = document.getElementById("firstName");
    let inputLastName = document.getElementById("lastName");
    let inputAdress = document.getElementById("address");
    let inputCity = document.getElementById("city");
    let inputMail = document.getElementById("email");

    //Construction d'un array depuis le local storage
    let idProducts = [];
    for (let i = 0; i < cart.length; i++) {
      idProducts.push(cart[i].id);
    }

    const order = {
      contact: {
        firstName: inputFirstName.value,
        lastName: inputLastName.value,
        address: inputAdress.value,
        city: inputCity.value,
        email: inputMail.value,
      },
      products: idProducts,
    };

    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    })
      .then((response) => response.json())
      .then((data) => {
        window.location.href = "./confirmation.html?orderId=" + data.orderId;
      })
      .catch((error) => {
        alert("Impossible de contacter l'API");
      });
  });
}
sendToLocalStorage();
