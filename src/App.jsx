import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Registration from "./Pages/Registration";
import { ToastContainer } from "react-toastify";
import ForgotPassword from "./Pages/ForgotPassword";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/" element={<Registration />}></Route>
        <Route path="/forgotpassword" element={<ForgotPassword />}></Route>
      </>
    )
  );

  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
