import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectCurrentToken } from "../features/auth/authSlice";
import jwtDecode from "jwt-decode";

const useAuth = () => {
	const token: string | null = useSelector(selectCurrentToken);

	let id = "";

	if (token) {
		const decode: any = jwtDecode(token);
		const { id }: { id: string } = decode?.UserInfo;

		return { id };
	}

	return { id };
};

export default useAuth;
