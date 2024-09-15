import { checkAuthentication } from "@/context/auth";
import { SignIn } from "@/pages/auth";
import { Outlet, Navigate } from "react-router-dom"
import Cookies from "universal-cookie"

const PrivateRoutes = () => {
    const cookies = new Cookies();
    let accessToken = cookies.get("token");
    // console.log(accessToken);
    return (
        checkAuthentication() ? <Outlet /> : <Navigate to="/auth/sign-in"  replace />
    )

}

export default PrivateRoutes