import { useState, useEffect } from "react";

const TypingAnimation = ({ fullText }: { fullText: string }) => {
	const [text, setText] = useState("");

	const startAnimation = () => {
		let currentIndex = 0;
		const typingInterval = setInterval(() => {
			if (currentIndex <= fullText.length) {
				setText(fullText.slice(0, currentIndex));
				currentIndex++;
			} else {
				clearInterval(typingInterval);
			}
		}, 65);
	};

	useEffect(() => {
		setText("");
		setTimeout(() => {
			startAnimation();
		}, 1500);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			{text}
			{text.length !== fullText.length && <span></span>}
		</>
	);
};

export default TypingAnimation;
