
import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBibo = message.sender === 'bibo';

  return (
    <div className={`flex items-end gap-2 ${isBibo ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
          isBibo
            ? 'bg-purple-700 text-white rounded-bl-none'
            : 'bg-blue-500 text-white rounded-br-none'
        }`}
      >
        <p className="text-sm">{message.text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
