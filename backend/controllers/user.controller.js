import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

		res.status(200).json(filteredUsers);
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getUserById = async (req, res) => {
	try {
		const id = req.params.id;

		const retrivedUser = await User.find({ _id: id }).select("-password");

		if (!retrivedUser[0]) {
			res.status(404).json("User not found");
		}

		res.status(200).json(retrivedUser[0]);
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
}