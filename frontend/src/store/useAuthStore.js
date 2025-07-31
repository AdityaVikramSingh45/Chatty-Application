import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import axios from "axios"
import toast from "react-hot-toast";
import {io} from "socket.io-client"
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:4000" : "/"

export const useAuthStore = create((set, get)=>({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isLoggingOut: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,

    // checkAuth: async () => {
    //   try {
    //     console.log("Inside checkAuth");
    //     const res = await axios.get("http://localhost:4000/api/auth/check", {withCredentials: true});
    //     console.log("res inside checkAuth", res);
    //     set({ authUser: res.data });
    //   } catch (error) {
    //     console.log("Error in checkAuth", error);
    //     set({ authUser: null });
    //   } finally {
    //     set({ isCheckingAuth: false });
    //   }
    // },

    checkAuth: async () => {
        try {
          console.log("Inside checkAuth");
          const res = await axiosInstance.get("/auth/check");
          console.log("res inside checkAuth", res);
          set({ authUser: res.data });
          get().connectSocket();
        } catch (error) {
          console.log("Error in checkAuth", error);
          set({ authUser: null });
        } finally {
          set({ isCheckingAuth: false });
        }
      },

      signup: async(data)=>{
        set({isSigningUp: true})
        try{
          const res = await axiosInstance.post("/auth/signup", data);
          console.log("res inside signup", res);
          set({authUser: res.data});
          get().connectSocket();
          toast.success("Account Created successfully")
        }
        catch(error){
          toast.error(error.response.data.message);
        }finally{
          set({isSigningUp: false})
        }
      },

      login: async(data)=>{
        set({isLoggingIn: true})
        try{
          const res = await axiosInstance.post("/auth/login", data);
          console.log("res inside login", res);
          set({authUser: res.data});
          // This is Zustand's way of calling a method from inside the same store.
          get().connectSocket();
          toast.success("Logged in successfully")
        }
        catch(error){
          toast.error(error.response.data.message);
        }finally{
          set({isLoggingIn: false})
        }
      },

      logout: async()=>{
        set({isLoggingOut: true})
        try{
          const res = await axiosInstance.post("/auth/logout");
          console.log("res LOGOUt", res)
          set({authUser: null});
          toast.success("Logged out successfully")
          get().disconnectSocket();
        }
        catch(error){
          toast.error(error.response.data.message)
        }
        finally{
          set({isLoggingOut: false})
        }
      },

      updateProfile: async(data)=>{
        set({isUpdatingProfile: true})
        try{
          const res = await axiosInstance.put("/auth/update-profile", data);
          set({authUser: res.data});
          toast.success("Profile Updated successfully");
        }
        catch(error){
          console.log("Error in updateProfile", error);
          toast.error(error.response?.data?.message)
        }finally{
          set({isUpdatingProfile: false})
        }
      },

      connectSocket: () => {
        const {authUser} = get();

        if(!authUser || get().socket?.connected){
          console.log("Main problem");
          return;
        }
        const socket = io(BASE_URL, {
          query: {
            userId: authUser?._id
          }
        });
        
        socket.on("connect", () => {
          console.log("Socket connected:", socket.id);
        });

        socket.connect();
        set({socket: socket})

        socket.on("getOnlineUsers", (userIds) => {
          set({onlineUsers: userIds});
        })
      },

      disconnectSocket: () => {
        console.log("here in disconnectSocket");
        console.log("get().socket?.connected", get().socket?.connected);
        console.log("get().socket.disconnect", get().socket.disconnect());
        console.log("socket in disconnect", socket)
        if(get().socket?.connected){
          get().socket.disconnect();
          // set({ socket: null });
        }
      },

}))