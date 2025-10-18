import { useParams } from "react-router-dom";
import ChatPanne from "../ChatAppPage/components/ChatPanne";
import { AppNumType } from "@/types/app";
import { generateUUID } from "@/utils";

export default function ChatSubRoute() {
  const { id } = useParams();
  
  // 如果没有提供ID，使用默认的聊天ID
  const chatId = id || "1b87aea2a46b40febe3e0d8bc10364bf";
  
  // console.log('ChatSubRoute - 接收到的ID:', id, '使用的chatId:', chatId);
  
  // 构建 WebSocket URL
  const wsUrl = `/api/v2/workflow/chat/${chatId}?`;
  
  // 创建数据对象
  const data = { 
    id: chatId, 
    chatId: generateUUID(32), 
    type: AppNumType.FLOW 
  };
  
  return (
    <div className="h-full w-full">
      <div className="p-4 bg-blue-50 border-b">
        <p className="text-sm text-blue-600">
          聊天页面 - ID: {chatId}
        </p>
      </div>
      <ChatPanne 
        customWsHost={wsUrl} 
        version="v2" 
        data={data} 
      />
    </div>
  );
}
