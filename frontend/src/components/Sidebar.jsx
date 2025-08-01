import React, { useEffect, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import SidebarSkeleton from './skeletons/SidebarSkeleton';
import { User } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Sidebar = () => {
  const {getUsers, users, selectedUser, setSelectedUser, isUsersLoading} = useChatStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const {onlineUsers} = useAuthStore()

  useEffect(()=>{
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly ? users.filter(user => onlineUsers.includes(user._id)) : users;
  
  if(isUsersLoading) return <SidebarSkeleton/>

  return (
    <aside className='h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200'>
      <div className='border-b border-base-300 w-full p-5'>
        <div className='flex items-center gap-2'>
          <User className='size-6'/>
          <span className='font-medium hidden lg:block'>Contacts</span>
        </div>
        {/* Online filter toggle */}

        <div className="mt-4 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>

      </div>

      {/* It display the all users */}
      <div className='overflow-y-auto w-full py-1'>
        {filteredUsers?.map((user)=>(
          <button
           key={user?._id}
           onClick={() => setSelectedUser(user)}
           className={
            `w-full flex items-center gap-3 lg:m-4 hover:bg-base-300 transition-colors sm:p-3 lg:p-2 ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}`
           }
          >

            {/* image and green ring for online users  */}
            <div className='relative mx-auto lg:mx-0'>
              <img
               src={user?.profilePic || "./avatar.png"}
               className='size-12 object-cover rounded-full'
               alt={user?.fullName}
               />
               {/* To show green ring for online users */}
               {onlineUsers.includes(user?._id) && (
                <span
                 className='absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900'
                />
               )}
            </div>

            {/* Users info - only visible on larger screens */}
            <div className='hidden lg:block text-left min-w-0'>
              <div className='font-medium truncate'>{user?.fullName}</div>
              <div className='text-sm text-zinc-400'>
                {onlineUsers.includes(user?._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}
        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}

      </div>
    </aside>
  )
}

export default Sidebar
