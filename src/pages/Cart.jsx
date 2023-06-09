import React, { useEffect, useState } from "react";
import { imgCart } from "../assets";
import { notifyError, notifyWarning } from "../utilities/notify";

export default function Cart() {
  const [carts, setCarts] = useState([]);

  useEffect(() => {
    const localStorageData = JSON.parse(localStorage.getItem("shoppingCart"));
    if (localStorageData) setCarts(localStorageData);
  }, []);

  const changeCartQty = (change, title) => {
    const matchingCart = carts.find((cart) => cart.title === title);
    let cartQty = matchingCart.quantity;

    if (change === "plus") cartQty++;
    if (change === "minus") cartQty--;

    if (cartQty < 1) return;

    matchingCart.quantity = cartQty;

    const newCarts = [
      ...[matchingCart],
      ...carts.filter((cart) => cart.title !== title),
    ];

    const newCartsQty = newCarts
      .map((cart) => cart.quantity)
      .reduce((a, b) => a + b, 0);

    if (newCartsQty > 9) {
      notifyError("Sorry! You can not add items more than 9.");
      return;
    }

    setCarts(newCarts);
    localStorage.setItem("shoppingCart", JSON.stringify(newCarts));
    PubSub.publish("valueChanged", newCartsQty);
  };

  const removeCart = (title) => {
    const newCarts = carts.filter((cart) => cart.title !== title);
    setCarts(newCarts);
    localStorage.setItem("shoppingCart", JSON.stringify(newCarts));
    PubSub.publish(
      "valueChanged",
      newCarts.map((item) => item.quantity).reduce((a, b) => a + b, 0)
    );
    notifyWarning(title + " is removed from cart!");
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
      <img src={imgCart} alt="cartImg" className="w-full h-56 object-cover" />
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-10 px-4 my-12">
        <div className="lg:col-span-4">
          <h2 className="text-2xl font-semibold my-4">Shopping Cart</h2>
          <div>
            {carts.length === 0 ? (
              <p className="text-red-600 my-6 font-medium text-lg">
                You did not add any item in the cart..
              </p>
            ) : (
              carts.map((cart, i) => (
                <div
                  key={i}
                  className="flex flex-col md:flex-row gap-x-4 border p-2 pr-4 rounded-sm items-center justify-between my-6"
                >
                  <div className="flex flex-col md:flex-row flex-shrink-0 w-44 h-52 items-center gap-2">
                    <span
                      className="text-xl cursor-pointer"
                      onClick={() => removeCart(cart.title)}
                    >
                      <ion-icon name="close-outline"></ion-icon>
                    </span>
                    <img
                      src={cart.image}
                      alt=""
                      className="w-full h-44 object-cover"
                    />
                  </div>
                  <h3 className="text-lg flex-shrink">{cart.title}</h3>
                  <p className="text-lg font-medium">${cart.price}</p>
                  <div className="flex gap-4">
                    <div className="border-[2px] py-1 px-2 flex gap-3 items-center">
                      <p className="pr-2">Quantity</p>
                      <button
                        className="border w-6 h-4 flex items-center justify-center font-semibold hover:bg-black hover:text-gray-100 active:bg-gray-800 duration-200"
                        onClick={() => changeCartQty("minus", cart.title)}
                      >
                        <ion-icon name="remove-outline"></ion-icon>
                      </button>
                      <p>{cart.quantity}</p>
                      <button
                        className="border w-6 h-4 flex items-center justify-center font-semibold hover:bg-black hover:text-gray-100 active:bg-gray-800 duration-200"
                        onClick={() => changeCartQty("plus", cart.title)}
                      >
                        <ion-icon name="add-outline"></ion-icon>
                      </button>
                    </div>
                  </div>
                  <p className="text-lg font-medium">
                    ${cart.price * cart.quantity}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2 p-6 flex flex-col gap-4 w-full h-fit bg-gray-100 rounded-sm sticky top-20">
          <h2 className="text-2xl font-semibold my-4">Cart Totals</h2>
          <div className="flex gap-4">
            <p>Subtotal</p>
            <p className="font-semibold">
              $
              {carts
                .map((cart) => cart.price * cart.quantity)
                .reduce((a, b) => a + b, 0)
                .toFixed(2)}
            </p>
          </div>

          <div className="flex gap-4">
            <p>Shipping</p>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Architecto, veritatis accusantium. Atque, ut.
            </p>
          </div>

          <div className="h-[2px] bg-gray-300 rounded-md"></div>

          <div className="flex text-lg justify-between font-semibold">
            <p>Total</p>
            <p>
              $
              {carts
                .map((cart) => cart.price * cart.quantity)
                .reduce((a, b) => a + b, 0)
                .toFixed(2)}
            </p>
          </div>

          <button className="bg-black text-gray-100 font-semibold py-2 active:bg-gray-800">
            proceed to checkout
          </button>
        </div>
      </div>
    </div>
  );
}
