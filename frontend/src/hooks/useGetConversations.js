import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { axiosAPI } from "../utils/http-common";

const useGetConversations = () => {
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
				console.log("/api/users = ", data);
				if (data.error) {
					throw new Error(data.error);
				}
				setConversations(data);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		getConversations();
	}, []);

	return { loading, conversations };
};
export default useGetConversations;
