import React from 'react';
import NewChatPro from '../NewChatPage/index';
import { AppNumType } from '@/types/app';

interface ChatFlowAuthSubRouteProps {
  id?: string;
}

export default function ChatFlowAuthSubRoute({ id }: ChatFlowAuthSubRouteProps) {
  // 如果没有提供ID，使用默认的聊天ID
  const chatId = id || "1b87aea2a46b40febe3e0d8bc10364bf";
  
  // console.log('ChatFlowAuthSubRoute - 接收到的ID:', id, '使用的chatId:', chatId);
  
  return React.createElement("div", { className: "h-full w-full" },
   
    React.createElement("div", { className: "h-full" },
      React.createElement(NewChatPro, {
        type: AppNumType.FLOW,
        flowId: chatId
      })
    )
  );
}
