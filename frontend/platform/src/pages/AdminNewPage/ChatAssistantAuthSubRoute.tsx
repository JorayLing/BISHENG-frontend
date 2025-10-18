import React from 'react';
import NewChatPro from '../NewChatPage/index';
import { AppNumType } from '@/types/app';

interface ChatAssistantAuthSubRouteProps {
  flowId: string;
}

export default function ChatAssistantAuthSubRoute({ flowId }: ChatAssistantAuthSubRouteProps) {
  console.log('ChatAssistantAuthSubRoute - props:', { flowId });
  if (!flowId) {
    console.error('No flowId provided to ChatAssistantAuthSubRoute');
    return null;
  }
  
  return React.createElement("div", { className: "h-full w-full" },
    
    React.createElement("div", { className: "h-full" },
      React.createElement(NewChatPro, {
        type: AppNumType.ASSISTANT,
        flowId: flowId
      })
    )
  );
}
