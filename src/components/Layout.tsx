import { Outlet } from "react-router-dom";
import Spinner from "./Spinner/Spinner";
import ErrorModal from "./ErrorModal/ErrorModal";
import EmailModal from "./EmailModal/EmailModal";
import NewNote from "../features/notes/NewNote/NewNote";
import EditNote from "../features/notes/EditNote/EditNote";

const Layout = () => {
	return (
		<>
			<Spinner />
			<ErrorModal />
			<EmailModal />

			<NewNote />
			<EditNote />

			<Outlet />
		</>
	);
};

export default Layout;
