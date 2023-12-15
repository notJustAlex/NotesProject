import { Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";
import { useDispatch } from "react-redux";
import { setError, setLoading } from "../statusHandler/statusHandlerSlice";

const PersistLogin = () => {
	const dispatch = useDispatch();

	const token = useSelector(selectCurrentToken);
	const effectRan = useRef(false);

	const [trueSuccess, setTrueSuccess] = useState(false);

	const [refresh, { isUninitialized, isLoading, isSuccess, isError }] =
		useRefreshMutation();

	useEffect(() => {
		if (effectRan.current === true || process.env.NODE_ENV !== "development") {
			const verifyRefreshToken = async () => {
				try {
					await refresh({});
					setTrueSuccess(true);
				} catch (err) {
					console.error(err);
				}
			};

			if (!token) verifyRefreshToken();
		}

		return () => {
			effectRan.current = true;
		};

		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		dispatch(setLoading(isLoading));
		dispatch(setError(isError));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoading, isError]);

	if (isSuccess && trueSuccess) {
		return <Outlet />;
	} else if (token && isUninitialized) {
		return <Outlet />;
	} else {
		return null;
	}
};

export default PersistLogin;
