import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ForgotPassword from "./Pages/ForgotPassword";
import Massage from "./Pages/Massage";
import Setting from "./Pages/Setting";
import Pages from "./Pages/Pages";
import LogPages from "./Pages/LogPages";
import Home from "./Pages/Home";
import Notifiactions from "./Pages/Notifiactions";
import BothGroups from "./Pages/BothGroups";
import Profile from "./Pages/Profile";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<LogPages />}></Route>
        <Route path="/forgotpassword" element={<ForgotPassword />}></Route>
        <Route path="/pages" element={<Pages />}>
          <Route path="home" element={<Home />}></Route>
          <Route path="Groups" element={<BothGroups />}></Route>
          <Route path="massage" element={<Massage />}></Route>
          <Route path="notifications" element={<Notifiactions />}></Route>
          <Route path="settings" element={<Setting />}></Route>
          <Route path="Profile" element={<Profile />}></Route>
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
