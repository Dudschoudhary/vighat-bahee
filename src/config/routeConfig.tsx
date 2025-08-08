// src/router/index.js or router.js
import { createBrowserRouter } from "react-router-dom";
import Login from "../components/Login";
import VigatBahee from "../components/VigatBahee";

// Define the routes

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    children: [
      {
        path: "bahee",
        element: <VigatBahee/>
      },
    ]
  }
]);

export default router;
