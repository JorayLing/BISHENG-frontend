import React from 'react';
import NewChatPro from '../NewChatPage/index';
import { AppNumType } from '@/types/app';

interface ChatAssistantAuthSubRouteProps {
  id?: string;
}

export default function ChatAssistantAuthSubRoute({ id }: ChatAssistantAuthSubRouteProps) {
  // 如果没有提供ID，使用默认的聊天ID
  const chatId = id || "236d01bc20f14a09a12bd24daa2ff14b";
  
  console.log('ChatAssistantAuthSubRoute - 接收到的ID:', id, '使用的chatId:', chatId);
  
  return React.createElement("div", { className: "h-full w-full" },
    
    React.createElement("div", { className: "h-full" },
      React.createElement(NewChatPro, {
        type: AppNumType.ASSISTANT,
        flowId: chatId
      })
    )
  );
}
