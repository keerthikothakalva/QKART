import React from "react";
import Register from "./components/Register";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";

export const config = {
  endpoint: "http://qkart-frontend-apis.onrender.com/api/v1",
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/" component={Products} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
