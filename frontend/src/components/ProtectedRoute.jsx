import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-slate-600">
                    Loading...
                </p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />; // when user is isAuthenticated there in the app.js there is route in that outlet say render that nested(child compontent eg: <AI/>)
};

export default ProtectedRoute;