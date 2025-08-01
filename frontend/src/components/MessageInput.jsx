import { Image, Send, X } from 'lucide-react';
import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { useChatStore } from '../store/useChatStore';

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const {sendMessage} = useChatStore(); 

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(!file.type.startsWith("image/")){
        toast.error("Please select an image fie");
        return;
    }

    const reader = new FileReader();
    reader.onload = ()=>{
        setImagePreview(reader.result)
    };
    reader.readAsDataURL(file);
  }

  const removeImage = (e) => {
    setImagePreview(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  }

  const handleSendImage = async(e) => {
    e.preventDefault();
    try{
        await sendMessage({
            text: text.trim(),
            image: imagePreview
        })

        //clear form
        setText("");
        setImagePreview(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
    }
    catch(error){
        console.log("Failed to send message", error)
    }
  }

  return (
    <div className='p-4 w-full'>
        {imagePreview && (
            <div className='mb-3 flex items-center gap-2 '>
                <div className='relative'>
                    <img
                     src={imagePreview}
                     alt="Preview"
                     className='w-20 h-20 object-cover rounded-lg border border-zinc-700'
                    />
                    <button
                     onClick={removeImage}
                     className='absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full border-zinc-700'
                     type='button'
                    >
                        <X className='size-3'/>
                    </button>
                </div>
            </div>
        )}

        <form onSubmit={handleSendImage} className='flex items-center gap-2'>
            <div className='flex-1 flex gap-2'>
                <input
                 tyep="text"
                 className='w-full input input-bordered rounded-lg input-sm sm:input-md'
                 placeholder='Type a message....'
                 value={text}
                 onChange={(e) => setText(e.target.value)}
                />
                <input
                 type="file"
                 accept='image/*'
                 className='hidden'
                 ref={fileInputRef}
                 onChange={handleImageChange}
                />
                {/* Without wrapping it in a function, the click will happen immediately when the component renders, not when the user clicks the button. */}
                <button
                 type='button'
                 className={`hidden sm:flex btn btn-circle
                    ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Image size={20}/>
                </button>
            </div>
            <button
             type='submit'
             className='btn btn-sm '
             disabled={!text.trim() && !imagePreview}
            >
                <Send size={22} />
            </button>
        </form>
    </div>
  )
}

export default MessageInput