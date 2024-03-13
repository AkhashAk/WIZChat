import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { axiosAPI } from "../utils/http-common";
import { useAuthContext } from "../context/AuthContext";

const useGetConversations = () => {
	const { authUser } = useAuthContext();
	const [loading, setLoading] = useState(false);
	const [conversations, setConversations] = useState([]);

	useEffect(() => {
		const getConversations = async () => {
			setLoading(true);
			try {
				const res = await axiosAPI.get("/api/users", {
					headers: {
						"Content-Type": "application/json"
					}
				});
				const data = res.data;
				// console.log("/api/users = ", data);
				if (data.error) {
					throw new Error(data.error);
				}

				const { data: loggedInUser } = await axiosAPI.get(`/api/users/${authUser._id}`);

				// console.log("loggedInUser = ", loggedInUser);

				data.forEach(sideBarUser => {
					sideBarUser.noOfNewMessages = loggedInUser.noOfNewMessagesFromOthers[sideBarUser.username];
				});

				// console.log("data users = ", data);

				setConversations(data);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		getConversations();
	}, []);

	return { loading, conversations, setConversations };
};
export default useGetConversations;
