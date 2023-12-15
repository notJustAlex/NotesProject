import React, { useState, useEffect, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { useDispatch } from "react-redux";
import {
	setEmailModal,
	setError,
	setLoading,
} from "../../features/statusHandler/statusHandlerSlice";
import { useSendLogoutMutation } from "../../features/auth/authApiSlice";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useGetUsersQuery } from "../../features/users/usersApiSlice";
import { useGetImagesQuery } from "../../features/imagesApi/imagesApiSlice";
import ThemeSwitcher from "./ThemeSwitcher/ThemeSwitcher";

import { ReactComponent as CogIcon } from "../../shared/icons/cog.svg";
import { ReactComponent as ChevronIcon } from "../../shared/icons/chevron.svg";
import { ReactComponent as ArrowIcon } from "../../shared/icons/arrow.svg";
import { ReactComponent as LogOutIcon } from "../../shared/icons/arrow-right-from-bracket.svg";
import { ReactComponent as MoonIcon } from "../../shared/icons/moon.svg";
import { ReactComponent as UserIcon } from "../../shared/icons/avatar.svg";
import { ReactComponent as CommentsIcon } from "../../shared/icons/comments.svg";

import "./dropdown.css";

interface INavItemProps {
	icon: React.ReactNode;
	children: React.ReactNode;
}

interface IDropdownItemProps {
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	children?: React.ReactNode;
	goToMenu?: string;
}

export function NavItem(props: INavItemProps) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<li className="nav-item">
				<ul className="icon-button" onClick={() => setOpen(!open)}>
					{props.icon}
				</ul>

				{open && props.children}
			</li>

			{open && (
				<div
					style={{
						position: "absolute",
						height: "100vh",
						width: "calc(100vw - 2%)",
						margin: "0 auto",
					}}
					onClick={() => setOpen(!open)}
				></div>
			)}
		</>
	);
}

export function DropdownMenu() {
	const dispatch = useDispatch();

	const [sendLogout, { isLoading, isSuccess, isError }] =
		useSendLogoutMutation();

	const { id } = useAuth();

	const { user } = useGetUsersQuery(undefined, {
		refetchOnMountOrArgChange: true,
		selectFromResult: ({ data }: any) => {
			const selectedUser = data?.ids?.find(
				(userId: string) => data?.entities[userId].id === id
			);

			return {
				user: selectedUser ? data?.entities[selectedUser] : null,
			};
		},
	});

	const { icon } = useGetImagesQuery(undefined, {
		refetchOnMountOrArgChange: true,
		selectFromResult: ({ data }: any) => {
			const findImg = data?.ids?.find((img: string) => data?.entities[img]);

			return {
				icon: findImg ? data?.entities[findImg].icon : null,
			};
		},
	});

	const navigate = useNavigate();

	useEffect(() => {
		if (isSuccess) navigate("/");
	}, [isSuccess, navigate]);

	useEffect(() => {
		dispatch(setLoading(isLoading));
		dispatch(setError(isError));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoading, isError]);

	const [activeMenu, setActiveMenu] = useState("main");
	const [menuHeight, setMenuHeight] = useState<number | null>(null);

	const dropdownRef = useRef<HTMLDivElement | null>(null);
	const mainRef = useRef<HTMLDivElement | null>(null);
	const settingsRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		//@ts-ignore
		setMenuHeight(dropdownRef?.current?.firstChild?.offsetHeight);
	}, []);

	function calcHeight(el: HTMLElement) {
		const height = el.offsetHeight;
		setMenuHeight(height);
	}

	function DropdownItem(props: IDropdownItemProps) {
		return (
			<ul
				className="menu-item"
				onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}
			>
				<span className="icon-button">{props.leftIcon}</span>
				{props.children}
				<span className="icon-right">{props.rightIcon}</span>
			</ul>
		);
	}

	return (
		<div
			className="dropdown"
			id="main_dropdown"
			style={{ height: menuHeight! }}
			ref={dropdownRef}
		>
			<CSSTransition
				in={activeMenu === "main"}
				timeout={500}
				classNames="menu-primary"
				unmountOnExit
				onEnter={() => calcHeight(mainRef.current!)}
				nodeRef={mainRef}
			>
				<div className="menu" ref={mainRef}>
					<Link to={`/${user?.username}/profile/${user?.id}`}>
						<DropdownItem
							leftIcon={
								icon ? (
									<img className="avatar" src={icon} alt="icon" />
								) : (
									<UserIcon />
								)
							}
						>
							<div>
								<div className="profile_username">{user?.username}</div>
								<div className="profile_title">See your profile</div>
							</div>
						</DropdownItem>
					</Link>

					<DropdownItem
						leftIcon={<CogIcon />}
						rightIcon={<ChevronIcon />}
						goToMenu="settings"
					>
						Settings
					</DropdownItem>

					<div onClick={() => dispatch(setEmailModal(true))}>
						<DropdownItem leftIcon={<CommentsIcon />}>
							Help & feedback
						</DropdownItem>
					</div>

					<div
						onClick={() => {
							navigate("/");
							sendLogout({});
						}}
					>
						<DropdownItem leftIcon={<LogOutIcon />}>Log Out</DropdownItem>
					</div>
				</div>
			</CSSTransition>

			<CSSTransition
				in={activeMenu === "settings"}
				timeout={500}
				classNames="menu-secondary"
				unmountOnExit
				onEnter={() => calcHeight(settingsRef.current!)}
				nodeRef={settingsRef}
			>
				<div className="menu" ref={settingsRef}>
					<DropdownItem goToMenu="main" leftIcon={<ArrowIcon />}>
						<h2>Main Page</h2>
					</DropdownItem>
					<DropdownItem leftIcon={<MoonIcon />} rightIcon={<ThemeSwitcher />}>
						Dark Mode
					</DropdownItem>
				</div>
			</CSSTransition>
		</div>
	);
}
