// Récupération des produits

fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((data) => {
    return addProducts(data);
  })
  .catch((error) => {
    alert("Impossible de contacter l'API");
  });

// On attribue à chaque produit ses caractéristiques grâce aux données

function addProducts(data) {
  for (let i = 0; i < data.length; i++) {
    const product = data[i];
    const id = product._id;
    const imageUrl = product.imageUrl;
    const altTxt = product.altTxt;
    const name = product.name;
    const description = product.description;
    const h3 = makeH3(name);
    const p = makeParagraph(description);
    const image = makeImage(imageUrl, altTxt);
    const anchor = makeAnchor(id);
    const article = makeArticle();
    article.appendChild(image);
    article.appendChild(h3);
    article.appendChild(p);
    appendChildren(anchor, article);
  }
}

// Fonctions de création des différents éléments

function appendChildren(anchor, article) {
  const items = document.querySelector("#items");
  if (items != null) {
    items.appendChild(anchor);
    anchor.appendChild(article);
  }
}

function makeAnchor(id) {
  const anchor = document.createElement("a");
  anchor.href = "./product.html?id=" + id;
  return anchor;
}

function makeImage(imageUrl, altTxt) {
  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = altTxt;
  return image;
}

function makeArticle() {
  return document.createElement("article");
}

function makeH3(name) {
  const h3 = document.createElement("h3");
  h3.textContent = name;
  h3.classList.add("productName");
  return h3;
}
function makeParagraph(description) {
  const p = document.createElement("p");
  p.textContent = description;
  p.classList.add("productDescription");
  return p;
}
