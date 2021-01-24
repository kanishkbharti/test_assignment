import React, { useState } from "react";
import DataTable from "./Table";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import Basket from "./Basket";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const onAdd = (product) => {
    const exist = cartItems.find((x) => x.id === product.id);
    if (exist) {
      setCartItems(
        cartItems.map((x) =>
          x.id === product.id ? { ...exist, qty: exist.qty + 1 } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, qty: 1 }]);
    }
  };
  const onRemove = (product) => {
    const exist = cartItems.find((x) => x.id === product.id);
    if (exist.qty === 1) {
      setCartItems(cartItems.filter((x) => x.id !== product.id));
    } else {
      setCartItems(
        cartItems.map((x) =>
          x.id === product.id ? { ...exist, qty: exist.qty - 1 } : x
        )
      );
    }
  };

  return (
    <Router>
      <Switch>
        <Route
          path="/"
          exact
          render={() => <DataTable cartItems={cartItems} onAdd={onAdd} />}
        />
        <Route
          path="/cart"
          exact
          render={() => (
            <Basket cartItems={cartItems} onAdd={onAdd} onRemove={onRemove} />
          )}
        />
      </Switch>
    </Router>
  );
}

export default App;
