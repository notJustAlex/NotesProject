import { useState, useEffect, FormEvent, useRef } from "react";
import { useDeleteUserMutation, useUpdateUserMutation } from "../usersApiSlice";
import { IUser } from "../../../shared/interfaces/user.interface";
import { useDispatch } from "react-redux";
import { setError, setLoading } from "../../statusHandler/statusHandlerSlice";
import UserInfo from "./EditFormFeatures/UserInfo";
import { CSSTransition } from "react-transition-group";
import { useNavigate } from "react-router-dom";

import { ReactComponent as ArrowIcon } from "../../../shared/icons/arrow-right-from-bracket.svg";
import { ReactComponent as ErrorIcon } from "../../../shared/icons/circle-exclamation.svg";

import "./editUser.css";

const USER_REGEX = /^[A-Za-z0-9_.,?!/-=]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,}$/;

interface IEditUserProps {
	user: IUser;
}

const EditUserForm = ({ user }: IEditUserProps) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [username, setUsername] = useState(user.username || "");
	const [validUsername, setValidUsername] = useState(false);

	const [password, setPassword] = useState("");
	const [validPassword, setValidPassword] = useState(false);

	const [verifyPass, setVerifyPass] = useState("");
	const [verifyValidPassword, setVerifyValidPassword] = useState(false);

	const [confirmDeleteStage, setConfirmDeleteStage] = useState(0);

	const [email, setEmail] = useState(user.email?.name || "");
	const [validEmail, setValidEmail] = useState(false);

	const [activeFilter, setActiveFilter] = useState("About");
	const navButtons = ["Profile"];

	const profileRef = useRef(null);

	const [updateUser, { isLoading, isSuccess, isError, error }] =
		useUpdateUserMutation();

	const [
		deleteUser,
		{ isSuccess: isDelSuccess, isLoading: isDelLoading, isError: isDelError },
	] = useDeleteUserMutation();

	useEffect(() => {
		setValidUsername(USER_REGEX.test(username));
	}, [username]);

	useEffect(() => {
		setValidPassword(PWD_REGEX.test(password));
		setVerifyValidPassword(password === verifyPass);
	}, [password, verifyPass]);

	useEffect(() => {
		setValidEmail(EMAIL_REGEX.test(email));
	}, [email]);

	useEffect(() => {
		dispatch(setError(isDelError));
		dispatch(setLoading(isLoading || isDelLoading));

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoading, isDelError, isDelLoading]);

	useEffect(() => {
		navigate(`/${username}/profile/${user?.id}`);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSuccess, isDelSuccess]);

	useEffect(() => {
		setActiveFilter("Profile");
	}, []);

	useEffect(() => {
		if (confirmDeleteStage === 2)
			setTimeout(() => {
				deleteUser({ id: user.id });
			}, 3000);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [confirmDeleteStage]);

	const renderFilters = () => {
		return navButtons.map((button: string) => {
			const btnClass =
				activeFilter !== button ? "nav_button" : "nav_button active";

			return (
				<button
					className={btnClass}
					key={button}
					id={`${button}`}
					onClick={() => setActiveFilter(button)}
					type="button"
				>
					{button}
				</button>
			);
		});
	};

	const canSave =
		[
			validUsername,
			validEmail,
			user.username !== username || user?.email?.name !== email,
		].every(Boolean) && !isLoading;

	const onSaveUserClicked = async (e: FormEvent<HTMLElement>) => {
		e.preventDefault();
		if (canSave) {
			if (validPassword && verifyValidPassword) {
				await updateUser({
					id: user.id,
					username,
					password,
					email: { name: email },
				});
			} else {
				await updateUser({
					id: user.id,
					username,
					email: { name: email },
				});
			}
		}
	};

	return (
		<section className="edit_user">
			<div className="edit_user_wrapper">
				<div className="form_bg"></div>
				<div className="header">
					<div className="background">
						<ArrowIcon onClick={() => navigate(`/${user.username}/notes`)} />
					</div>
					<UserInfo user={user} />
				</div>
				<div className="divider"></div>
				<div className="nav_menu">{renderFilters()}</div>

				<CSSTransition
					in={activeFilter === "Profile"}
					timeout={0}
					unmountOnExit
					nodeRef={profileRef}
				>
					<>
						<div className="wrapper" ref={profileRef}>
							<div className="profile_wrapper">
								<div className="info">
									<h2>About</h2>
									<div>Username</div>
									<div>Email</div>
									<div>New password</div>
									<div></div>
								</div>
								<div className="form_wrapper">
									<div className="input_wrapper">
										<input
											type="text"
											value={username}
											onChange={(e) => setUsername(e.target.value)}
											placeholder="Username"
										/>
										{((isError &&
											error?.data?.message === "Duplicate username") ||
											!validUsername) &&
										username !== "" ? (
											<div
												className="error_icon"
												title={
													validUsername
														? error?.data?.message
														: "Username must contain 3-20 letters"
												}
											>
												<ErrorIcon />
											</div>
										) : null}
									</div>
									<div className="input_wrapper">
										<input
											type="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											placeholder="Email"
										/>
										{(!validEmail ||
											(isError &&
												error?.data?.message === "Duplicate email")) &&
										email !== "" ? (
											<div
												className="error_icon"
												title={
													error?.data?.message === "Duplicate email"
														? error?.data?.message
														: "Your email is not valid. Please try again."
												}
											>
												<ErrorIcon />
											</div>
										) : null}
									</div>
									<div className="input_wrapper password_wrapper">
										<input
											type="password"
											id="password"
											data-type="password"
											placeholder="Password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
										/>
										{password !== "" && !validPassword ? (
											<div
												className="error_icon"
												title="Password must contain 4-12 characters."
											>
												<ErrorIcon />
											</div>
										) : null}
									</div>
									<div className="input_wrapper password_wrapper">
										<input
											type="password"
											id="re-password"
											data-type="password"
											placeholder="Re-enter password"
											value={verifyPass}
											onChange={(e) => setVerifyPass(e.target.value)}
										/>
										{(verifyPass !== "" && !verifyValidPassword) ||
										(verifyPass !== "" && password !== verifyPass) ? (
											<div
												className="error_icon"
												title={
													password !== verifyPass
														? "Passwords do not match."
														: "Password must contain 4-12 characters."
												}
											>
												<ErrorIcon />
											</div>
										) : null}
									</div>
								</div>
								<div className="buttons">
									<button
										type="button"
										className="cancel_button"
										onClick={() => {
											setUsername(user?.username);
											setEmail(user?.email?.name || "");
											setPassword("");
											setVerifyPass("");
										}}
									>
										Cancel
									</button>
									<button
										type="submit"
										disabled={
											!canSave && (password === "" || !verifyValidPassword)
										}
										className="submit_button"
										onClick={onSaveUserClicked}
									>
										Submit
									</button>
								</div>
							</div>
						</div>

						<div className="wrapper">
							<div className="delete_account_wrapper">
								{confirmDeleteStage === 0 ? (
									<>
										<div className="title">Delete your account?</div>
										<button
											onClick={() =>
												setConfirmDeleteStage(confirmDeleteStage + 1)
											}
										>
											Delete Account
										</button>
									</>
								) : confirmDeleteStage === 1 ? (
									<>
										<div className="text">
											<div className="title">Are you sure??</div>
											<div className="subtitle">
												If it was a mistake, just leave it.
											</div>
										</div>
										<button
											onClick={() =>
												setConfirmDeleteStage(confirmDeleteStage + 1)
											}
										>
											Delete Account
										</button>
									</>
								) : (
									<>
										<div className="title">Fine... Hope see you soon!</div>
									</>
								)}
							</div>
						</div>
					</>
				</CSSTransition>
			</div>
		</section>
	);
};

export default EditUserForm;
