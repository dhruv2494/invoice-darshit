import React from "react";
import RouteContainer from "./router/RouteContainer";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import Toast styles

function App() {
  return (
    <Provider store={store}>
      <RouteContainer />
      {/* ToastContainer is now globally set up here */}
      <ToastContainer position="top-right" autoClose={3000} />
    </Provider>
  );
}

export default App;
