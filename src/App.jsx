import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
} from "react-router-dom";
import Login from "./Pages/Login";
import Registration from "./Pages/Registration";
import { ToastContainer } from "react-toastify";
import ForgotPassword from "./Pages/ForgotPassword";
import Massage from "./Pages/Massage";
import Setting from "./Pages/Setting";
import Pages from "./Pages/Pages";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/" element={<Registration />}></Route>
        <Route path="/forgotpassword" element={<ForgotPassword />}></Route>
        <Route path="/pages" element={<Pages />}>
          <Route path="massage" element={<Massage />}></Route>
          <Route path="setting" element={<Setting />}></Route>
        </Route>
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
