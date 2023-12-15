import { useNavigate } from "react-router-dom";
import { useSendMailMutation } from "../mailerApiSlice";
import { useState, useEffect, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { setError, setLoading } from "../../statusHandler/statusHandlerSlice";
import restoreAccountLetter from "../letterSources/restoreAccountLetter";
import { IUser } from "../../../shared/interfaces/user.interface";

const CODE_REGEX = /^[0-9]{6}$/;

interface IConfirmationAccount {
	user: IUser;
	setVerifyid: (arg: boolean) => void;
}

const ConfirmationAccount = ({ user, setVerifyid }: IConfirmationAccount) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const email = user?.email?.name;

	const [sendMail, { isLoading, isError }] = useSendMailMutation();

	const [verificationCode, setVerificationCode] = useState<string>();
	const [code, setCode] = useState("");
	const [isSending, setIsSending] = useState(false);

	const [onError, setOnError] = useState(false);

	useEffect(() => {
		dispatch(setLoading(isLoading));
		dispatch(setError(isError));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoading, isError]);

	useEffect(() => {
		if (!verificationCode) {
			const generateCode = () => {
				let newCode = "";
				for (let i = 0; i < 6; i++) {
					const digit = Math.floor(Math.random() * 10);
					newCode += digit.toString();
				}
				setVerificationCode(newCode);
			};

			generateCode();
		}

		onSendMail();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [verificationCode]);

	const onSendMail = async () => {
		if (email && verificationCode && !isSending) {
			setIsSending(true);

			const mail = {
				recipient: email,
				subject: `${verificationCode} is your NotesApp account recovery code`,
				structure: restoreAccountLetter(user.username, email, verificationCode),
			};

			await sendMail(mail);

			setTimeout(() => {
				setIsSending(false);
			}, 60000);
		}
	};

	const onSubmit = (e: FormEvent<HTMLElement>) => {
		e.preventDefault();

		!CODE_REGEX.test(code) || code !== verificationCode
			? setOnError(true)
			: setVerifyid(true);
	};

	return (
		<form className="confirmation_form" onSubmit={onSubmit}>
			<h2 className="title">Enter security code</h2>

			<div className="divider"></div>

			<div className="wrapper">
				{onError && (
					<div className="error">
						<p className="error_descr">
							The number you entered doesn’t match your code. Please try again.
						</p>
					</div>
				)}

				<p className="descr">
					Please check your email for a message with your code. Your code is 6
					numbers long.
				</p>
				<div className="input_wrapper">
					<input
						type="text"
						placeholder="Enter code"
						onChange={(e) => setCode(e.target.value)}
					/>
					<div>
						We sent your code to: <span>{email}</span>
					</div>
				</div>
			</div>

			<div className="divider"></div>

			<div className="buttons">
				<div className="link" onClick={() => onSendMail()}>
					Didn't get a code?
				</div>
				<div>
					<button type="button" onClick={() => navigate("/")}>
						Cancel
					</button>
					<button className="submit" type="submit">
						Continue
					</button>
				</div>
			</div>
		</form>
	);
};

export default ConfirmationAccount;
