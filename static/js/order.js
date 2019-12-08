const apiUrl = "http://localhost:3000/api";

async function add(cart) {
  axios
    .post(`${apiUrl}/new-order`, cart)
    .then(response => {
      const addedUser = response.data;
      console.log(`POST: user is added`, addedUser);
    })
    .catch(error => console.error(error));
}

const saveOrder = () => {
  var cart = JSON.parse(sessionStorage.getItem("cart"));
  var items = cart.items;
  var strItems = JSON.stringify(items);
  cart.str_items = strItems;
  cart.client_id = "vew423d31";
  cart.order_date = "2019-23-11T10:14:00.000Z";

  add(cart);

};

$(document).ready(function() {
  console.log("checkout...")
  $("#checkout").on("click", () => {
    console.log("clicked.....");
    saveOrder();
  });
});
