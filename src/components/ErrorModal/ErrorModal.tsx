import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { IAppState } from "../../shared/interfaces/appState.interface";

import "./errorModal.css";
import { useSelector } from "react-redux";

const ErrorModal = () => {
	const isError = useSelector(
		(state: IAppState) => state.statusHandler.isError
	);

	const navigate = useNavigate();

	const modalRef = useRef(null);

	return (
		<CSSTransition
			timeout={300}
			unmountOnExit
			in={isError}
			nodeRef={modalRef}
			classNames="error-modal"
		>
			<>
				<div className="modal_blur"></div>
				<div className="error_modal">
					<h3>Oops! Something Went Wrong...</h3>
					<p>We're working on it and we'll get it fixed as soon as we can.</p>
					<button onClick={() => navigate(0)}>Try Again</button>
				</div>
			</>
		</CSSTransition>
	);
};

export default ErrorModal;
