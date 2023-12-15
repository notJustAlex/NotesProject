import { useNavigate } from "react-router-dom";
import { useState, useEffect, FormEvent } from "react";
import { useLoginMutation } from "../../auth/authApiSlice";
import { setCredentials } from "../../auth/authSlice";
import { useDispatch } from "react-redux";
import useAuth from "../../../hooks/useAuth";
import FindAccount from "./FindAccount";
import { IUser } from "../../../shared/interfaces/user.interface";
import ConfirmationAccount from "./ConfirmationAccount";
import ChangePassword from "./ChangePassword";

import "./restoreAccount.css";

const RestoreAccount = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { id } = useAuth();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const [user, setUser] = useState<IUser | Object>();
	const [verifyid, setVerifyid] = useState(false);

	const [login] = useLoginMutation();

	useEffect(() => {
		if (id) {
			navigate(`/${username}/notes`);
			setUsername("");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const { accessToken } = await login({ username, password }).unwrap();
			dispatch(setCredentials({ accessToken }));
			setPassword("");
		} catch (error: any) {
			navigate("/");
		}
	};

	const isUser = (value: any): value is IUser => !!value?.email?.name;

	return (
		<section className="identify">
			<form className="identify_login" onSubmit={onSubmit}>
				<h2 className="title">NotesApp</h2>
				<div className="wrapper">
					<input
						placeholder="Email or username"
						type="text"
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
					<input
						placeholder="Password"
						type="password"
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					<button type="submit">Log In</button>
				</div>
			</form>

			{!isUser(user) ? (
				<FindAccount setUser={setUser} user={user} />
			) : !verifyid ? (
				<ConfirmationAccount setVerifyid={setVerifyid} user={user} />
			) : (
				<ChangePassword user={user} />
			)}
		</section>
	);
};

export default RestoreAccount;
