import {create} from "zustand"
import toast from "react-hot-toast"
import { axiosInstance } from "../lib/axios"
import { useAuthStore } from "./useAuthStore"

export const useChatStore = create((set, get)=>({
    users:[],
    messages: [],
    selectedUser: false,
    isUserLoading: false,
    isMessagesLoading: false,

    getUsers: async()=>{
        set({isUserLoading: true})
        try{
            const res = await axiosInstance.get("/messages/users");
            set({users: res.data});
        }
        catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isUserLoading: false})
        }
    },

    getMessages: async(userId)=>{
        set({isMessagesLoading: true})
        try{
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages: res.data});
        }
        catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isMessagesLoading: false})
        }
    },

    //todo: optimize this one later
    setSelectedUser: async(selectedUser) => set({selectedUser}),

    sendMessage: async(messageData) =>{
        // Because messages isn't declared anywhere inside this function.
        //messages is stored inside Zustand, not as a variable in your function scope.
        // So you have to get it first using get():
        const {messages, selectedUser} = get(); // get current state
        try{
            const res = await axiosInstance.post(`/messages/send/${selectedUser?._id}`, messageData);
            set({messages: [... messages, res.data]})  // update messages list
        }
        catch(error){
            toast.error(error.response.data.message);
        }
    },

    subscribeToMessages: ()=>{
        const {selectedUser} = get();
        if(!selectedUser) return;
        
        const socket = useAuthStore.getState().socket;

        //todo: optimize this one later
        socket.on("newMessage", (newMessage)=>{
            if(newMessage.senderId !== selectedUser?._id) return;
            set({
                messages: [...get().messages, newMessage]
            })
        })
    },

    unsubscribeFromMessages: ()=>{
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    }

}))