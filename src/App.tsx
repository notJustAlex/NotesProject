import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Publuc/Public";
import NotesList from "./features/notes/NotesList";
import Prefetch from "./features/auth/Prefetch";
import EditUser from "./features/users/EditUser/EditUser";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import EmailVerification from "./features/mailer/EmailVerification/EmailVerification";
import RestoreAccount from "./features/mailer/RestoreAccount/RestoreAccount";

import useTitle from "./hooks/useTitle";
import { useTheme } from "./hooks/useTheme";
import useAuth from "./hooks/useAuth";

function App() {
	useTheme();
	useTitle("Notes");
	useAuth();

	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Public />} />

				<Route path="/login/identify" element={<RestoreAccount />} />

				<Route element={<PersistLogin />}>
					<Route path=":email" element={<EmailVerification />} />

					<Route element={<RequireAuth />}>
						<Route element={<Prefetch />}>
							<Route path=":username">
								<Route path="profile/:id" element={<EditUser />} />

								<Route path="notes">
									<Route index element={<NotesList />} />
								</Route>
							</Route>
						</Route>
					</Route>
				</Route>
			</Route>
		</Routes>
	);
}

export default App;
