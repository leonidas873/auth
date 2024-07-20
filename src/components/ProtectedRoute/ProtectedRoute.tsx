import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";

export default function ProtectedRoute({children}:{children: React.ReactNode}){
    const {isLoggedIn} = useAppSelector(state=>state.user);

    if(isLoggedIn){
        return children
    } else {
       return <Navigate to="/login" replace />
    }
}