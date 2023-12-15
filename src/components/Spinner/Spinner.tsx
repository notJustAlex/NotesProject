import { CSSTransition } from "react-transition-group";
import { useRef } from "react";
import { useSelector } from "react-redux";

import ClipLoader from "react-spinners/ClipLoader";

import "./spinner.css";
import { IAppState } from "../../shared/interfaces/appState.interface";

const Spinner = () => {
	const isLoading = useSelector(
		(state: IAppState) => state.statusHandler.isLoading
	);

	const spinnerRef = useRef(null);

	return (
		<CSSTransition
			timeout={500}
			unmountOnExit
			in={isLoading}
			nodeRef={spinnerRef}
			classNames="spinner"
		>
			<div className="spinner_wrapper" ref={spinnerRef}>
				<ClipLoader color="#0866FF" size={32} />
			</div>
		</CSSTransition>
	);
};

export default Spinner;
