import Register from "./components/Register";
import ipConfig from "./ipConfig.json";

export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    <Router>
    <div className="App">
          <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
          
    </div>
    </Router>
  
  );
}

export default App;
<Routes>
          {/* Redirect root path to /register */}
          <Route path="/" element={<Navigate to="/register" replace />} />

          {/* Route for Register page */}
          <Route path="/register" element={<Register />} />

          {/* Fallback route for 404 */}
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>