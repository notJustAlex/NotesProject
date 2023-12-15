import { useRef, useState, useEffect, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CSSTransition } from "react-transition-group";

import { setCredentials } from "../authSlice";
import { useLoginMutation } from "../authApiSlice";
import { setError, setLoading } from "../../statusHandler/statusHandlerSlice";
import useAuth from "../../../hooks/useAuth";

import "./login.css";

interface ILoginProps {
	setActiveMenu?: (menu: string) => void | undefined;
}

const Login = (props?: ILoginProps) => {
	const userRef = useRef<HTMLInputElement>(null);
	const errRef = useRef<HTMLInputElement>(null);

	const { id } = useAuth();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errMsg, setErrMsg] = useState("");

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [login, { isLoading }] = useLoginMutation();

	// Temporary solution to reduce the startup waiting time of a free server

	let count = 0;

	useEffect(() => {
		if (count < 1) {
			login({ username, password });
			count++;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// End of the temporary code

	useEffect(() => {
		userRef?.current?.focus();
	}, []);

	useEffect(() => {
		setErrMsg("");
	}, [username, password]);

	useEffect(() => {
		dispatch(setLoading(isLoading));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoading, errMsg]);

	useEffect(() => {
		if (id) {
			navigate(`/${username}/notes`);
			setUsername("");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			setErrMsg("");
			const { accessToken } = await login({ username, password }).unwrap();
			dispatch(setCredentials({ accessToken }));
			setPassword("");
		} catch (error: any) {
			if (!error.status) {
				setErrMsg("No Server Response");
			} else if (error.status === 400) {
				setErrMsg("Missing Username or Password");
			} else if (error.status === 401) {
				setErrMsg("Unauthorized");
			} else if (error.data?.message.startsWith("Too many login attempts")) {
				setErrMsg(error.data?.message);
			} else {
				dispatch(setError(true));
			}
			errRef?.current?.focus();
		}
	};

	return (
		<section className="login">
			<form className="singin_form" onSubmit={handleSubmit}>
				<input
					className="form_input"
					type="text"
					id="username"
					ref={userRef}
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
					placeholder="Username or Email"
				/>

				<input
					className="form_input"
					type="password"
					id="password"
					onChange={(e) => setPassword(e.target.value)}
					value={password}
					required
					placeholder="Password"
				/>

				<CSSTransition
					unmountOnExit
					timeout={200}
					in={errMsg !== ""}
					nodeRef={errRef}
				>
					<div className="err_message">{errMsg}</div>
				</CSSTransition>

				<button type="submit" className="singin_button">
					Log In
				</button>
			</form>
			<div className="link_wrapper">
				<Link to={`/login/identify`}>Forgot password?</Link>
			</div>
			<div className="divider"></div>
			<button
				type="button"
				className="create_account_button"
				onClick={() => props?.setActiveMenu && props?.setActiveMenu("singup")}
			>
				Create new account
			</button>
		</section>
	);
};

export default Login;
