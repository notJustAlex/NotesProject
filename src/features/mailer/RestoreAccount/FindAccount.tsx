import { useGetUsersQuery } from "../../users/usersApiSlice";
import { IUser } from "../../../shared/interfaces/user.interface";
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

interface IFindAccount {
	user: IUser | {} | undefined;
	setUser: (arg: IUser | {}) => void;
}

const FindAccount = ({ user, setUser }: IFindAccount) => {
	const navigate = useNavigate();

	const [data, setData] = useState("");

	const { users } = useGetUsersQuery(undefined, {
		selectFromResult: ({ data }: any) => ({
			users: data?.ids.map((id: any) => data?.entities[id]),
		}),
	});

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const user: IUser | undefined = users?.find(
			(user: IUser) => user.username === data || user?.email?.name === data
		);

		user ? setUser(user) : setUser({});
	};

	return (
		<form className="identify_form" onSubmit={onSubmit}>
			<h2 className="title">Find your account</h2>
			<div className="divider"></div>

			<div className="wrapper">
				{user && Object.keys(user).length === 0 && (
					<div className="error">
						<p className="error_title">No Search Results</p>
						<p className="error_descr">
							Your search did not return any results. Please try again with
							other information.
						</p>
					</div>
				)}

				<p className="descr">
					Please enter your email or mobile number to search for your account.
				</p>
				<input
					onChange={(e) => setData(e.target.value)}
					type="text"
					placeholder="Email or username"
				/>
			</div>
			<div className="divider"></div>
			<div className="buttons">
				<button type="button" onClick={() => navigate("/")}>
					Cancel
				</button>
				<button className="submit" type="submit">
					Search
				</button>
			</div>
		</form>
	);
};

export default FindAccount;
