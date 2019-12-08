$(document).ready(() => {
  Date.prototype.addHours = function(h) {
    this.setHours(this.getHours() + h);
    return this;
  };
  $("#successMsg").hide();
  const displayEmptyCart = sessionCart => {
    let source2 = cartComp2;
    let template = Handlebars.compile(source2);
    let html = template(sessionCart);
    $(".cart").html(html);

    let sourceTable = cartTableRow2;
    template = Handlebars.compile(sourceTable);
    html = template();
    $("#cartTable").html(html);
    $("#successMsg").hide();
  };

  const displayCart = sessionCart => {
    let source = cartComp;
    let template = Handlebars.compile(source);
    let html = template(sessionCart);
    $(".cart").html(html);

    let sourceTable = cartTableRow;
    template = Handlebars.compile(sourceTable);
    html = template(sessionCart);
    $("#cartTable").html(html);
    $("#successMsg").hide();

    addProductQty();
  };

  const rmProduct = () => {
    $(".remove-product").each(function() {
      $(this).on("click", () => {
        const id = $(this).attr("data-productId");
        const cart = new Cart(
          JSON.parse(sessionStorage.getItem("cart"))
            ? JSON.parse(sessionStorage.getItem("cart"))
            : { items: {} }
        );

        cart.remove(id);

        if (cart.totalPrice <= 0) {
          sessionStorage.removeItem("cart");
          sessionStorage.setItem("cart", JSON.stringify(cart));
          displayEmptyCart(JSON.parse(sessionStorage.getItem("cart")));
        } else if (cart.totalPrice > 0) {
          sessionStorage.setItem("cart", JSON.stringify(cart));
          displayCart(JSON.parse(sessionStorage.getItem("cart")));
          a();
        }
      });
    });
  };

  const a = () => {
    rmProduct();
  };

  const addProduct = () => {
    $(".add-product").each(function() {
      $(this).on("click", () => {
        if (JSON.parse(sessionStorage.getItem("cart")) === null) {
          var expires = new Date().addHours(1);
          var shoppingCart = {
            expiresAt: expires
          };
          sessionStorage.setItem("cart", JSON.stringify(shoppingCart));
        } else {
          var currentDate = new Date().toISOString();
          var sessionObject = JSON.parse(sessionStorage.getItem("cart"));
          var expirationDate = sessionObject.expiresAt;

          if (currentDate < expirationDate) {
            var id = $(this).attr("data-productId");

            var Url = "http://localhost:3000/api/get-product/" + id;
            $.ajax({
              url: Url,
              type: "GET",
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              success: function(result) {
                var product = result[0];

                var cart = new Cart(
                  JSON.parse(sessionStorage.getItem("cart"))
                    ? JSON.parse(sessionStorage.getItem("cart"))
                    : { items: {} }
                );
                if (!cart) {
                  console.log("error......");
                } else if (id === product.id) {
                  cart.add(product, product.id);
                  cart.expiresAt = sessionObject.expiresAt;
                  sessionStorage.setItem("cart", JSON.stringify(cart));
                  displayCart(JSON.parse(sessionStorage.getItem("cart")));
                  rmProduct();
                }
              },
              error: function(error) {
                console.log(error, error.responseText);
              }
            });
          } else {
            sessionStorage.removeItem("cart");
            console.log(
              "local expired",
              JSON.parse(sessionStorage.getItem("cart"))
            );

            window.location.href = "http://localhost:3001";
          }
        }
      });
    });
  };

  const addProductQty = () => {
    $(".product-qty ").each(function() {
      console.log("each item");
      $(this).on("change", e => {
        var currentDate = new Date().toISOString();
        var sessionObject = JSON.parse(sessionStorage.getItem("cart"));
        var expirationDate = sessionObject.expiresAt;

        if (currentDate < expirationDate) {
          var id = $(this).attr("data-productId");
          var qty = $(this).val();
          
          $("#successMsg").click();
          
          var Url = "http://localhost:3000/api/get-product/" + id;
          $.ajax({
            url: Url,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(result) {
              var product = result[0];

              var cart = new Cart(
                JSON.parse(sessionStorage.getItem("cart"))
                  ? JSON.parse(sessionStorage.getItem("cart"))
                  : { items: {} }
              );
              if (!cart) {
                console.log("error......");
              } else if (id === product.id) {
                cart.remove(id); // Remove product from cart
                for (i = 0; i < parseInt(qty); i++) {
                  cart.add(product, product.id);
                }
                cart.expiresAt = sessionObject.expiresAt;
                sessionStorage.setItem("cart", JSON.stringify(cart));
                displayCart(JSON.parse(sessionStorage.getItem("cart")));
                rmProduct();
              }
            },
            error: function(error) {
              console.log(error, error.responseText);
            }
          });
        } else {
          sessionStorage.removeItem("cart");
          console.log(
            "local expired",
            JSON.parse(sessionStorage.getItem("cart"))
          );

          window.location.href = "http://localhost:3001";
        }
      });
    });
  };

  addProduct();
  rmProduct();

  if (sessionStorage.getItem("cart") === null) {
    var expires = new Date().addHours(1);
    var shoppingCart = {
      expiresAt: expires
    };
    sessionStorage.setItem("cart", JSON.stringify(shoppingCart));
    console.log("cart created");
    displayEmptyCart(shoppingCart);
  } else {
    const sessionCart = JSON.parse(sessionStorage.getItem("cart"));

    if (sessionCart.totalPrice <= 0 || sessionCart.totalPrice == undefined) {
      displayEmptyCart(sessionCart);
    } else if (sessionCart.totalPrice > 0) {
      sessionStorage.setItem("cart", JSON.stringify(sessionCart));

      displayCart(sessionCart);
      a();
    }
  }
});

const Cart = function Cart(oldCart) {
  this.items = oldCart.items || {};
  this.totalQty = parseFloat(oldCart.totalQty) || 0;
  this.totalPrice = parseFloat(oldCart.totalPrice) || 0;

  this.add = function(item, id) {
    var storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = {
        item: item,
        qty: 0,
        price: 0
      };
    }
    storedItem.qty++;
    storedItem.price =
      parseFloat(storedItem.item.price) * parseInt(storedItem.qty);
    this.totalQty++;
    this.totalPrice += parseFloat(storedItem.item.price);
  };

  this.sub = function(id) {
    this.items[id].qty--;
    this.items[id].price -= this.items[id].item.price;
    this.totalQty--;
    this.totalPrice -= this.items[id].item.price;

    if (this.items[id].qty <= 0) {
      delete this.items[id];
    }
  };
  this.update = function(item, id, qnty) {
    var storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = {
        item: item,
        qty: 0,
        price: 0
      };
    }
    storedItem.qty + qnty;
    storedItem.price = storedItem.item.price * parseInt(storedItem.qty);
    this.totalQty++;
    this.totalPrice += storedItem.item.price;
  };
  this.remove = function(id) {
    this.totalQty -= this.items[id].qty;
    this.totalPrice -= this.items[id].price;
    delete this.items[id];
  };

  this.generateArray = function(req) {
    var arr = [];
    for (var id in this.items) {
      arr.push(this.items[id]);
    }
    console.log(arr);
    return arr;
  };
};

const cartComp = `
    <a href="cart.html"></a>
    <i class="icon-bag"></i><span class="count">{{totalQty}}</span>
    <span class="subtotal"><span>$</span>{{totalPrice}}</span>
    <div class="toolbar-dropdown">
        {{#each items}}
            <div class="dropdown-product-item"><span class="dropdown-product-remove"><i data-productId="{{item.id}}" class="icon-cross remove-product"></i></span><a class="dropdown-product-thumb" href="shop-single.html"><img src="img/cart-dropdown/01.jpg" alt="Product"></a>
                <div class="dropdown-product-info">
                    <a class="dropdown-product-title" href="shop-single.html">{{item.title}}</a>
                    <span class="dropdown-product-details">{{qty}} x <span>$</span>{{item.price}}</span>
                </div>
            </div>
        {{/each}}


        <div class="toolbar-dropdown-group">
            <div class="column"><span class="text-lg">Total:</span></div>
            <div class="column text-right"><span class="text-lg text-medium"><span>$</span>{{totalPrice}}&nbsp;</span>
            </div>
        </div>
        <div class="toolbar-dropdown-group">
            <div class="column"><a class="btn btn-sm btn-block btn-secondary" href="cart.html">View
                    Cart</a></div>
            <div class="column"><a id="checkout" class="btn btn-sm btn-block btn-success"
                    >Checkout</a></div>
        </div>
    </div>
`;

const cartComp2 = `
    <a href="cart.html"></a>
    <i class="icon-bag"></i><span class="count">0</span>
    <span class="subtotal">$0.00</span>
    <div class="toolbar-dropdown">

      <div class="dropdown-product-item"><span class="dropdown-product-remove"><i class="icon-cross"></i></span>
        <div class="dropdown-product-info"><a class="dropdown-product-title" href="shop-single.html">No products selected.</a><span class="dropdown-product-details">$0.00</span></div>
      </div>
      
      
      <div class="toolbar-dropdown-group">
        <div class="column"><span class="text-lg">Total:</span></div>
        <div class="column text-right"><span class="text-lg text-medium">$0.00&nbsp;</span></div>
      </div>
      <div class="toolbar-dropdown-group">
        <div class="column"><a class="btn btn-sm btn-block btn-secondary" href="cart.html">View Cart</a></div>
        <div class="column"><a class="btn btn-sm btn-block btn-success">Checkout</a></div>
      </div>
    </div>
`;

const cartTableRow = `
    {{#each items}}
    <tr>
      <td>
        <div class="product-item"><a class="product-thumb" href="shop-single.html"><img src="img/shop/cart/01.jpg" alt="Product"></a>
          <div class="product-info">
            <h4 class="product-title"><a href="shop-single.html">Unionbay Park</a></h4><span><em>Size:</em> 10.5</span><span><em>Color:</em> Dark Blue</span>
          </div>
        </div>
      </td>
      <td class="text-center">
        <div class="count-input">
          <select class="form-control product-qty" data-productId="{{item.id}}">          
            <option>{{qty}}</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </select>
        </div>
      </td>
      <td class="text-center text-lg text-medium"><span>$</span>{{price}}</td>
      <td class="text-center text-lg text-medium">$18.00</td>
      <td class="text-center"><a class="remove-from-cart" href="#" data-toggle="tooltip" title="Remove item"><i data-productId="{{item.id}}" class="icon-cross remove-product"></i></a></td>
    </tr>
  {{/each}}
  
`;

const cartTableRow2 = `
    <tr>
      <td></td>
      <td class="text-center">
         <div class="alert alert-info alert-dismissible fade show text-center" style="margin-bottom: 30px;"><span class="alert-close" data-dismiss="alert"></span><img class="d-inline align-center" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTIuMDAzIDUxMi4wMDMiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMi4wMDMgNTEyLjAwMzsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiPgo8Zz4KCTxnPgoJCTxnPgoJCQk8cGF0aCBkPSJNMjU2LjAwMSw2NGMtNzAuNTkyLDAtMTI4LDU3LjQwOC0xMjgsMTI4czU3LjQwOCwxMjgsMTI4LDEyOHMxMjgtNTcuNDA4LDEyOC0xMjhTMzI2LjU5Myw2NCwyNTYuMDAxLDY0eiAgICAgIE0yNTYuMDAxLDI5OC42NjdjLTU4LjgxNiwwLTEwNi42NjctNDcuODUxLTEwNi42NjctMTA2LjY2N1MxOTcuMTg1LDg1LjMzMywyNTYuMDAxLDg1LjMzM1MzNjIuNjY4LDEzMy4xODQsMzYyLjY2OCwxOTIgICAgIFMzMTQuODE3LDI5OC42NjcsMjU2LjAwMSwyOTguNjY3eiIgZmlsbD0iIzUwYzZlOSIvPgoJCQk8cGF0aCBkPSJNMzg1LjY0NCwzMzMuMjA1YzM4LjIyOS0zNS4xMzYsNjIuMzU3LTg1LjMzMyw2Mi4zNTctMTQxLjIwNWMwLTEwNS44NTYtODYuMTIzLTE5Mi0xOTItMTkycy0xOTIsODYuMTQ0LTE5MiwxOTIgICAgIGMwLDU1Ljg1MSwyNC4xMjgsMTA2LjA2OSw2Mi4zMzYsMTQxLjE4NEw2NC42ODQsNDk3LjZjLTEuNTM2LDQuMTE3LTAuNDA1LDguNzI1LDIuODM3LDExLjY2OSAgICAgYzIuMDI3LDEuNzkyLDQuNTY1LDIuNzMxLDcuMTQ3LDIuNzMxYzEuNjIxLDAsMy4yNDMtMC4zNjMsNC43NzktMS4xMDlsNzkuNzg3LTM5Ljg5M2w1OC44NTksMzkuMjMyICAgICBjMi42ODgsMS43OTIsNi4xMDEsMi4yNCw5LjE5NSwxLjI4YzMuMDkzLTEuMDAzLDUuNTY4LTMuMzQ5LDYuNjk5LTYuNGwyMy4yOTYtNjIuMTQ0bDIwLjU4Nyw2MS43MzkgICAgIGMxLjA2NywzLjE1NywzLjU0MSw1LjYzMiw2LjY3Nyw2LjcyYzMuMTM2LDEuMDY3LDYuNTkyLDAuNjQsOS4zNjUtMS4yMTZsNTguODU5LTM5LjIzMmw3OS43ODcsMzkuODkzICAgICBjMS41MzYsMC43NjgsMy4xNTcsMS4xMzEsNC43NzksMS4xMzFjMi41ODEsMCw1LjEyLTAuOTM5LDcuMTI1LTIuNzUyYzMuMjY0LTIuOTIzLDQuMzczLTcuNTUyLDIuODM3LTExLjY2OUwzODUuNjQ0LDMzMy4yMDV6ICAgICAgTTI0Ni4wMTcsNDEyLjI2N2wtMjcuMjg1LDcyLjc0N2wtNTIuODIxLTM1LjJjLTMuMi0yLjExMi03LjMxNy0yLjM4OS0xMC42ODgtMC42NjFMOTQuMTg4LDQ3OS42OGw0OS41NzktMTMyLjIyNCAgICAgYzI2Ljg1OSwxOS40MzUsNTguNzk1LDMyLjIxMyw5My41NDcsMzUuNjA1TDI0Ni43LDQxMS4yQzI0Ni40ODcsNDExLjU2MywyNDYuMTY3LDQxMS44NCwyNDYuMDE3LDQxMi4yNjd6IE0yNTYuMDAxLDM2Mi42NjcgICAgIEMxNjEuOSwzNjIuNjY3LDg1LjMzNSwyODYuMTAxLDg1LjMzNSwxOTJTMTYxLjksMjEuMzMzLDI1Ni4wMDEsMjEuMzMzUzQyNi42NjgsOTcuODk5LDQyNi42NjgsMTkyICAgICBTMzUwLjEwMywzNjIuNjY3LDI1Ni4wMDEsMzYyLjY2N3ogTTM1Ni43NTksNDQ5LjEzMWMtMy40MTMtMS43MjgtNy41MDktMS40NzItMTAuNjg4LDAuNjYxbC01Mi4zNzMsMzQuOTIzbC0zMy42NDMtMTAwLjkyOCAgICAgYzQwLjM0MS0wLjg1Myw3Ny41ODktMTQuMTg3LDEwOC4xNi0zNi4zMzFsNDkuNTc5LDEzMi4yMDNMMzU2Ljc1OSw0NDkuMTMxeiIgZmlsbD0iIzUwYzZlOSIvPgoJCTwvZz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K" width="18" height="18" alt="Medal icon">&nbsp;&nbsp;With this purchase you will earn <strong>290</strong> Reward Points.</div>
      </td>
    </tr>
`;
