import { Params, useParams } from "react-router-dom";
import EditUserForm from "./EditUserForm";
import { useGetUsersQuery } from "../usersApiSlice";

const EditUser = () => {
	const { id }: Params<string> = useParams();

	const { user } = useGetUsersQuery(undefined, {
		selectFromResult: ({ data }: any) => ({
			user: data?.entities[id!],
		}),
	});

	if (!user) return <p>Loading...</p>;

	return <EditUserForm user={user} />;
};

export default EditUser;
