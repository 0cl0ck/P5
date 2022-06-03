const str = window.location.href;
const url = new URL(str);
const id = url.searchParams.get("orderId");

const displayOrderId = document.getElementById("orderId");
displayOrderId.innerText = id;

localStorage.clear();
