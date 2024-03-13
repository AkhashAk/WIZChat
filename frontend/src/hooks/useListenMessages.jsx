import { MessagesSquare } from 'lucide-react';
import toast from "react-hot-toast";

import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import { axiosAPI } from "../utils/http-common";

import notificationSound from "../assets/sounds/notification.mp3";
import { useAuthContext } from "../context/AuthContext";
import useGetConversations from './useGetConversations';

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { messages, setMessages, selectedConversation } = useConversation();
	const { conversations, setConversations } = useGetConversations();
	const { authUser } = useAuthContext();

	useEffect(() => {
		console.log("useListenMessages useEffect called");
		socket?.on("newMessage", (newMessage) => {
			console.log("New message received:", newMessage);
			console.log("Auth user = ", authUser);
			newMessage.shouldShake = true;
			const sound = new Audio(notificationSound);
			sound.play();

			console.log("selectedConversation = ", selectedConversation);
			console.log(authUser._id, newMessage.receiverId);
			console.log("authUser._id === newMessage.receiverId = ", authUser._id === newMessage.receiverId);

			if (authUser._id === newMessage.receiverId && newMessage.senderId === selectedConversation?._id) {
				setMessages([...messages, newMessage]);
			} else {
				const findSender = async () => {
					try {
						const { data: sender } = await axiosAPI.get(`/api/users/${newMessage.senderId}`);
						console.log("Sender = ", sender);
						toast.custom((t) => (
							<div
								className={`${t.visible ? 'custom-enter 1s ease' : 'custom-exit 1s ease'
									} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
							>
								<div className="flex-1 w-0 p-4">
									<div className="flex items-start">
										<div className="flex-shrink-0 pt-0.5">
											<img
												className="h-10 w-10 rounded-full"
												src={sender.profilePic}
												alt="sender's profile picture"
											/>
										</div>
										<div className="ml-3 flex-1">
											<p className="text-sm font-medium text-gray-900">
												{sender.fullName}
											</p>
											<p className="mt-1 text-sm text-gray-500">
												{newMessage.message}
											</p>
										</div>
									</div>
								</div>
								<div className="flex border-l border-gray-200">
									<button
										onClick={() => toast.dismiss(t.id)}
										className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
									>
										Dismiss
									</button>
								</div>
							</div>),
							{
								duration: 4000,
								ariaProps: {
									role: 'status',
									'aria-live': 'polite',
								},
							});

						const response = await axiosAPI.post(`/api/users/${newMessage.senderId}`);
						console.log("msg = ", response);

						// const { data: loggedInUser } = await axiosAPI.get(`/api/users/${authUser._id}`);
						// console.log("loggedInUser = ", loggedInUser);

						// data.forEach(sideBarUser => {
						// 	sideBarUser.noOfNewMessages = loggedInUser.noOfNewMessagesFromOthers[sideBarUser.username];
						// });

						console.log(conversations);
						setConversations(response.data);
					} catch (error) {
						console.log(error);
						toast.error(error);
					}
				}
				findSender();
			}
		});

		return () => {
			console.log("Cleanup useEffect");
			socket?.off("newMessage");
		}
	}, [socket, setMessages, messages]);
};
export default useListenMessages;
