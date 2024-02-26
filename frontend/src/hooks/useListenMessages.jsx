import { MessagesSquare } from 'lucide-react';
import toast from "react-hot-toast";

import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import { axiosAPI } from "../utils/http-common";

import notificationSound from "../assets/sounds/notification.mp3";
import { useAuthContext } from "../context/AuthContext";
import { getRandomEmoji } from '../utils/emojis';

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { messages, setMessages, selectedConversation } = useConversation();
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

			if (authUser._id === newMessage.receiverId && newMessage.senderId === selectedConversation._id) {
				setMessages([...messages, newMessage]);
			} else {
				const findSender = async () => {
					const res = await axiosAPI.get(`/api/users/${newMessage.senderId}`);
					console.log("Sender = ", res.data);
					toast(
						<span>
							<b>{`${res.data.fullName}`}</b>: {newMessage.message}
						</span>, {
						duration: 4000,
						position: 'top-center',
						icon: <MessagesSquare />,
						ariaProps: {
							role: 'status',
							'aria-live': 'polite',
						},
					});
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
