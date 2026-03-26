import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks";

export const config = {
  endpoint: "http://13.235.83.176:8082/api/v1"
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>

          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/thanks" component={Thanks} /> 

          
          <Route exact path="/" component={Products} />

        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
