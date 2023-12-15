import { useSelector, useDispatch } from "react-redux";
import { IAppState } from "../../shared/interfaces/appState.interface";
import { CSSTransition } from "react-transition-group";
import { useRef, useState, useEffect, MouseEvent } from "react";
import {
	setEmailModal,
	setError,
	setLoading,
} from "../../features/statusHandler/statusHandlerSlice";
import { useSendMailMutation } from "../../features/mailer/mailerApiSlice";
import { useParams } from "react-router-dom";
import { useGetUsersQuery } from "../../features/users/usersApiSlice";
import feedbackLetter from "../../features/mailer/letterSources/feedbackLetter";

import { ReactComponent as CaretDropdownIcon } from "../../shared/icons/caret.svg";

import "./emailModal.css";

const EmailModal = () => {
	const dispatch = useDispatch();
	const { username } = useParams();

	const [subject, setSubject] = useState("");
	const [text, setText] = useState("");

	const isEmailModal = useSelector(
		(state: IAppState) => state.statusHandler.isEmailModal
	);

	const modalRef = useRef(null);

	const { email }: { email: string } = useGetUsersQuery(undefined, {
		refetchOnMountOrArgChange: true,
		selectFromResult: ({ data }: any) => {
			const selectedUser = data?.ids?.find(
				(userId: string) => data?.entities[userId].username === username
			);

			return {
				email: selectedUser ? data?.entities[selectedUser]?.email?.name : null,
			};
		},
	});

	const [sendMail, { isLoading, isError, isSuccess }] = useSendMailMutation();

	useEffect(() => {
		dispatch(setLoading(isLoading));
		dispatch(setError(isError));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoading, isError]);

	useEffect(() => {
		if (isSuccess || !isEmailModal) {
			setText("");
			setSubject("");

			if (isSuccess)
				return () => {
					dispatch(setEmailModal(!isEmailModal));
				};
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSuccess, isEmailModal]);

	const filterOptions: { [key: number]: { title: string; subtitle: string } } =
		{
			0: {
				title: "Help us improve NotesApp",
				subtitle: "Give feedback about your NotesApp experience.",
			},
			1: {
				title: "Something went wrong",
				subtitle: "Let us know about a broken feature.",
			},
		};

	const renderDropdownContent = () => {
		const buttons = Object.getOwnPropertyNames(filterOptions).map((key) => {
			const option = filterOptions[+key];
			return (
				<button
					type="button"
					value={option?.title}
					key={option.title}
					onClick={() => setSubject(option.title)}
				>
					{option.title}
					<span>{option.subtitle}</span>
				</button>
			);
		});

		return buttons;
	};

	const onSendMail = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (subject !== "" && text) {
			const mail = {
				recipient: "notesapp9@gmail.com",
				subject: subject,
				structure: text,
			};
			const replyMail = {
				recipient: email,
				subject:
					"We've received your message and are actively addressing the issue.",
				structure: feedbackLetter(username, email),
			};

			await sendMail(mail);
			await sendMail(replyMail);
		}
	};

	return (
		<CSSTransition
			in={isEmailModal}
			timeout={0}
			unmountOnExit
			nodeRef={modalRef}
		>
			<>
				<div
					className="modal_blur"
					onClick={() => dispatch(setEmailModal(!isEmailModal))}
				></div>
				<div className="email_modal" ref={modalRef}>
					<div className="title">Help Us Improve NotesApp</div>
					<div className="divider"></div>

					<div className="dropdown_wrapper">
						<span className="dropdown_title">How can we improve?</span>
						<div className="dropdown">
							<div className="wrapper">
								<button className="dropdown_button" type="button">
									<div>
										{subject !== "" && <span>Choose an area</span>}
										{subject === "" ? (
											<span style={{ fontSize: "16px", opacity: "1" }}>
												Choose an area
											</span>
										) : (
											subject
										)}
									</div>
								</button>
								<CSSTransition timeout={200}>
									<CaretDropdownIcon />
								</CSSTransition>
							</div>
							<div className="dropdown_content">{renderDropdownContent()}</div>
						</div>
					</div>

					<div className="text_wrapper">
						<span>Details</span>
						<textarea
							placeholder="Please include as much info as possible..."
							value={text}
							onChange={(e) => setText(e.target.value)}
						></textarea>
					</div>

					<div className="descr">
						Let us know if you have ideas that can help make our products
						better.
					</div>

					<div className="buttons">
						<button
							type="button"
							className="cancel"
							onClick={() => dispatch(setEmailModal(!isEmailModal))}
						>
							Cancel
						</button>
						<button
							type="submit"
							className="submit"
							onClick={onSendMail}
							disabled={!text || subject === "Choose an area"}
						>
							Submit
						</button>
					</div>
				</div>
			</>
		</CSSTransition>
	);
};

export default EmailModal;
