import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Products from "./components/Products";

export const config = {
  endpoint: "https://qkart-frontend-apis.onrender.com/api/v1",
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          {/* Order matters — more specific routes first */}
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/" component={Products} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
