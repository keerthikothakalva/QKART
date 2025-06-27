import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";

export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};
//dummy
function App() {
  return (
    <div className="App">
       <BrowserRouter> 
<Switch>
        <Route path="/register" component={Register } />
        <Route path="/login" component={Login } />
        <Route path="/" component={Products } />
      </Switch>
 </BrowserRouter> 
    </div>
  );
}

export default App;
