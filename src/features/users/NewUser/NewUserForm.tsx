import { useState, useEffect, FormEvent, useRef } from "react";
import { useAddNewUserMutation } from "../usersApiSlice";
import { useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

import { useDispatch } from "react-redux";
import { setError, setLoading } from "../../statusHandler/statusHandlerSlice";

import { ReactComponent as ErrorIcon } from "../../../shared/icons/circle-exclamation.svg";

import "./newUserForm.css";

interface INewUserFormProps {
	setActiveMenu?: (menu: string) => void | undefined;
}

const USER_REGEX = /^[A-Za-z0-9_.,?!/-=]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,}$/;

const NewUserFrom = (props?: INewUserFormProps) => {
	const [addNewUser, { isLoading, isSuccess, isError, error }] =
		useAddNewUserMutation();

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [username, setUsername] = useState("");
	const [validUsername, setValidUsername] = useState(false);

	const [password, setPassword] = useState("");
	const [validPassword, setValidPassword] = useState(false);

	const [email, setEmail] = useState("");
	const [validEmail, setValidEmail] = useState(false);
	const [checkEmail, setCheckEmail] = useState("");
	const [validCheckEmail, setValidCheckEmail] = useState(false);

	const animationRef = useRef(null);

	useEffect(() => {
		dispatch(setError(isError));
		dispatch(setLoading(isLoading));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isError, isLoading]);

	useEffect(() => {
		setValidUsername(USER_REGEX.test(username));
	}, [username]);

	useEffect(() => {
		setValidPassword(PWD_REGEX.test(password));
	}, [password]);

	useEffect(() => {
		setValidEmail(EMAIL_REGEX.test(email));
	}, [email]);

	useEffect(() => {
		setValidCheckEmail(EMAIL_REGEX.test(checkEmail) && checkEmail === email);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [checkEmail]);

	useEffect(() => {
		if (isSuccess) {
			setUsername("");
			setPassword("");
			navigate(`/${email}`);
			setEmail("");
			setCheckEmail("");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSuccess, navigate]);

	const canSave =
		[validUsername, validPassword, validEmail, validCheckEmail].every(
			Boolean
		) && !isLoading;

	const onSaveUserClicked = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (canSave) {
			await addNewUser({ username, email: { name: email }, password });
		}
	};

	return (
		<section className="singup">
			<form className="singup_form" onSubmit={onSaveUserClicked}>
				<h2 className="form_title">Sing Up</h2>
				<h3 className="form_subtitle">It’s quick and easy.</h3>
				<div className="divider"></div>
				<div className="input_wrapper">
					<input
						className="form_input_username"
						name="username"
						type="username"
						placeholder="Username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					{((isError && error?.data?.message === "Duplicate username") ||
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
						className="form_input_email"
						name="email"
						type="email"
						placeholder="Email"
						autoComplete="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					{(!validEmail ||
						(isError && error?.data?.message === "Duplicate email")) &&
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

				<CSSTransition
					nodeRef={animationRef}
					in={validEmail}
					timeout={200}
					unmountOnExit
				>
					<div className="input_wrapper">
						<input
							ref={animationRef}
							className="form_input_check_email"
							name="checkEmail"
							type="text"
							data-type="text"
							placeholder="Re-enter email"
							autoComplete="nope"
							value={checkEmail}
							onChange={(e) => setCheckEmail(e.target.value)}
						/>
						{checkEmail !== "" && (email !== checkEmail || !validCheckEmail) ? (
							<div
								className="error_icon"
								title={
									email !== checkEmail
										? "Your emails do not match. Please try again."
										: "Your email is not valid. Please try again."
								}
							>
								<ErrorIcon />
							</div>
						) : null}
					</div>
				</CSSTransition>

				<div className="input_wrapper password_wrapper">
					<input
						className="form_input_password"
						name="password"
						aria-label="New password"
						type="password"
						autoComplete="new-password"
						aria-autocomplete="list"
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

				<button className="singup_button" type="submit">
					Sing Up
				</button>

				<div className="divider"></div>

				<button
					className="login_button"
					type="button"
					onClick={() => props?.setActiveMenu && props?.setActiveMenu("login")}
				>
					Log In
				</button>
			</form>
		</section>
	);
};

export default NewUserFrom;
