import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import Products from "./products";
import Login from "./login";
import Cart from "./cart";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";

const router = createBrowserRouter([
   {
     path: '/',
     element: <Layout />,
     children: [
        {
            path: "/products",
            element: <Products/>
        },
        {
            path: "/login",
            element: <Login/>
        },
        {
            path: "/cart",
            element: <ProtectedRoute><Cart/></ProtectedRoute>
        }
     ]
    
},
])

export default router;