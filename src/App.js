import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import {Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";

export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    <switch>
    <div className="App">
      <Route path="/register" component={<register/>}/>
      <Route path="/login" component={<login/>}/>
      <Route path="/" component={<products/>}/>
          
    </div>
    </switch>
  
  );
}

export default App;
