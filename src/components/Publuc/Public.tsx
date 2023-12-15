import Login from "../../features/auth/Login/Login";
import { CSSTransition } from "react-transition-group";
import { useState, useEffect, useRef } from "react";
import NewUserFrom from "../../features/users/NewUser/NewUserForm";

import TypingAnimation from "./TypingAnimation";

import "./public.css";

const Public = () => {
	const fullText = "Your Ultimate Productivity Companion";

	const [activeMenu, setActiveMenu] = useState("login");
	const [menuHeight, setMenuHeight] = useState<number | null>(null);

	const animationRef = useRef<HTMLInputElement>(null);

	const welcomeContentRef = useRef<HTMLInputElement>(null);
	const logInRef = useRef<HTMLInputElement>(null);
	const singUpRef = useRef<HTMLInputElement>(null);

	function calcHeight(el: HTMLElement) {
		const height = el.offsetHeight;
		setMenuHeight(height);
	}

	useEffect(() => {
		//@ts-ignore
		setMenuHeight(welcomeContentRef?.current?.firstChild?.offsetHeight);
	}, []);

	return (
		<section className="welcome">
			<div className="welcome_text_wrapper">
				<h2 className="welcome_title">Notes</h2>
				<CSSTransition timeout={1000} classNames="fade" nodeRef={animationRef}>
					<div className="welcome_subtitle " ref={animationRef}>
						<TypingAnimation fullText={fullText} />
					</div>
				</CSSTransition>
			</div>
			<div
				className="welcome_content"
				style={{ height: menuHeight! }}
				ref={welcomeContentRef}
			>
				<div className="menu_content">
					<CSSTransition
						classNames="login-menu"
						nodeRef={logInRef}
						in={activeMenu === "login"}
						timeout={500}
						unmountOnExit
						onEnter={() => calcHeight(logInRef.current!)}
					>
						<div ref={logInRef}>
							<Login setActiveMenu={setActiveMenu} />
						</div>
					</CSSTransition>

					<CSSTransition
						classNames="singup-menu"
						nodeRef={singUpRef}
						in={activeMenu === "singup"}
						timeout={500}
						unmountOnExit
						onEnter={() => calcHeight(singUpRef.current!)}
					>
						<div ref={singUpRef}>
							<NewUserFrom setActiveMenu={setActiveMenu} />
						</div>
					</CSSTransition>
				</div>
			</div>
		</section>
	);
};

export default Public;
