import { useTheme } from "../../../hooks/useTheme";

import { ReactComponent as SunIcon } from "../../../shared/icons/sun.svg";
import { ReactComponent as MoonIcon } from "../../../shared/icons/moon.svg";

import "./themeSwitcher.css";

const ThemeSwitcher = () => {
	const { theme, setTheme } = useTheme();

	return (
		<div
			id="theme_switcher"
			onClick={() => setTheme(() => (theme === "light" ? "dark" : "light"))}
		>
			<SunIcon id="icon_sun" />
			<MoonIcon id="icon_moon" />
		</div>
	);
};

export default ThemeSwitcher;
