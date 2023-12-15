import { useNavigate, useParams } from "react-router-dom";
import { useSendMailMutation } from "../mailerApiSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setError, setLoading } from "../../statusHandler/statusHandlerSlice";

import { verificetionLetter } from "../letterSources/verificetionLetter";

import "./emailVerification.css";

const EmailVerification = () => {
	const { email } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { username } = useParams();

	const [sendMail, { isLoading, isError }] = useSendMailMutation();

	const [verificationCode, setVerificationCode] = useState<string>();
	const [code, setCode] = useState("");

	const [isSending, setIsSending] = useState(false);

	useEffect(() => {
		dispatch(setLoading(isLoading));
		dispatch(setError(isError));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoading, isError]);

	useEffect(() => {
		if (!verificationCode) {
			const generateCode = () => {
				let newCode = "";
				for (let i = 0; i < 5; i++) {
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
				subject: `${verificationCode} is your Notes App confirmation code`,
				structure: verificetionLetter(username, email, verificationCode),
			};

			await sendMail(mail);

			setTimeout(() => {
				setIsSending(false);
			}, 60000);
		}
	};

	return (
		<section className="verification_section">
			<div className="verification_form">
				<h2>Enter the code from your email</h2>
				<div className="divider"></div>
				<div className="verification_descr">
					Let us know this email belongs to you. Enter the code in the email
					sent to <span>{email}</span>
				</div>
				<input
					onChange={(e) => setCode(e.target.value)}
					autoComplete="nope"
					className="input"
					maxLength={5}
				/>
				<div className="verification_link" onClick={() => onSendMail()}>
					Send email again
				</div>
				<div className="divider"></div>
				<div className="verification_buttons">
					<div>
						<button type="button" onClick={() => navigate("/")}>
							Update contact info
						</button>
						<button
							className="continue"
							type="button"
							disabled={code !== verificationCode}
							onClick={() => navigate(`/${username}/notes`)}
						>
							Continue
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default EmailVerification;
