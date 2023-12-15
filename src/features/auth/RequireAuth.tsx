import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = () => {
	const location = useLocation();
	const { id } = useAuth();

	return id ? (
		<Outlet />
	) : (
		<Navigate to="/" state={{ from: location }} replace />
	);
};

export default RequireAuth;
