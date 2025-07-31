import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'
import MessageSkeleton from "../components/skeletons/MessageSkeleton"
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import {formatMessageTime} from "../lib/utils"

const ChatContainer = () => {

  const {messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages} = useChatStore();
  const {authUser} = useAuthStore()
  const messageEndRef = useRef();

  useEffect(()=>{
    getMessages(selectedUser?._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();

  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if(isMessagesLoading){
    return (
      <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader/>
        <MessageSkeleton/>
        <MessageInput/>
      </div>
    )
  }

  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      {/* Header component */}
      <ChatHeader/>

      {/* Here the messages will go */}
      <div className="flex flex-1 flex-col overflow-auto">
        {messages.map((message)=> (
          <div
           key={message._id}
           className={`chat ${message.senderId === authUser?._id ? "chat-end" : "chat-start"} my-1`}
           ref={messageEndRef}
          >
            {/* Profile Pic of sender and receiver msg */}
            <div className="chat-image avatar">
              <div className="size-10 rounded-full borde mx-2"> 
                <img
                 src={`${message.senderId === authUser?._id ? authUser?.profilePic || "./avatar.png" : selectedUser?.profilePic || "./avatar.png"}`}
                 alt="profile pic"
                />
              </div>
            </div>
          
            {/* Time at which message was send*/}
            <div className="chat-header mb-1">
              <time className="text-sm opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            {/* Actual message */}
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                 src={message.image}
                 alt="Attachment"
                 className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Here typing karnege messages */}
      <MessageInput/>
    </div>
  )
}

export default ChatContainer