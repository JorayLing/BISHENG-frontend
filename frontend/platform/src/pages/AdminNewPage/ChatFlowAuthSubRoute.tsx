import React from 'react';
import NewChatPro from '../NewChatPage/index';
import { AppNumType } from '@/types/app';

interface ChatFlowAuthSubRouteProps {
  flowId?: string;
}

export default function ChatFlowAuthSubRoute({ flowId }: ChatFlowAuthSubRouteProps) {
  // 如果没有提供ID，使用默认的聊天ID
  const chatId = flowId || "1b87aea2a46b40febe3e0d8bc10364bf";
  
  console.log('ChatFlowAuthSubRoute - 接收到的flowId:', flowId, '使用的chatId:', chatId);
  
  return React.createElement("div", { className: "h-full w-full" },
   
    React.createElement("div", { className: "h-full" },
      React.createElement(NewChatPro, {
        type: AppNumType.FLOW,
        flowId: chatId
      })
    )
  );
}
