import { FormEvent, useState, useEffect } from "react";
import { useUpdateUserMutation } from "../../users/usersApiSlice";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../auth/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../auth/authSlice";
import { IUser } from "../../../shared/interfaces/user.interface";
import { setError, setLoading } from "../../statusHandler/statusHandlerSlice";

const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

interface IChangePassword {
	user: IUser;
}

const ChangePassword = ({ user }: IChangePassword) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [updateUser, { isLoading, isSuccess, isError }] =
		useUpdateUserMutation();

	useEffect(() => {
		dispatch(setLoading(isLoading));
		dispatch(setError(isError));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoading, isError]);

	const [login] = useLoginMutation();

	const [password, setPassword] = useState("");

	const [onError, setOnError] = useState(false);

	useEffect(() => {
		if (isSuccess) {
			setPassword("");
			navigate(`/${user?.username}/notes`);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSuccess]);

	const onSubmit = async (e: FormEvent<HTMLElement>) => {
		e.preventDefault();

		if (!PWD_REGEX.test(password)) {
			setOnError(true);
			return;
		}

		await updateUser({ ...user, password });
		const { accessToken } = await login({
			username: user?.username,
			password,
		}).unwrap();
		dispatch(setCredentials({ accessToken }));
	};

	return (
		<form className="accses_form" onSubmit={onSubmit}>
			<h2 className="title">Choose a new password</h2>

			<div className="divider"></div>

			<div className="wrapper">
				{onError && (
					<div className="error">
						<p className="error_descr">
							Password must contain 4-12 characters.
						</p>
					</div>
				)}
				<p className="descr">
					Create a new password that is at least 6 characters long. A strong
					password is combination of letters, numbers, and punctuation marks.
				</p>
				<input
					placeholder="New Password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
			</div>

			<div className="divider"></div>

			<div className="buttons">
				<div>
					<button className="submit" type="submit">
						Continue
					</button>
				</div>
			</div>
		</form>
	);
};

export default ChangePassword;
