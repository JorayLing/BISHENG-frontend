import React from 'react';
import { useParams } from 'react-router-dom';
import { chatMenuConfig, menuGroupsConfig } from './menuConfig';

interface IframeSubRouteProps {
  url?: string;
  title?: string;
}

export default function IframeSubRoute({ url, title = "页面" }: IframeSubRouteProps) {
  const { id } = useParams();
  
  // 如果没有传入url，则根据id从配置中查找
  let iframeUrl = url;
  let iframeTitle = title;
  
  if (!iframeUrl && id) {
    // 首先从聊天配置中查找
    let chatItem = chatMenuConfig.find(chat => chat.id === id && chat.type === 'iframe');
    
    // 如果没找到，从菜单分组配置中查找
    if (!chatItem) {
      for (const group of menuGroupsConfig) {
        const item = group.items.find(item => item.id === id && item.type === 'iframe');
        if (item && item.chatConfig) {
          chatItem = item.chatConfig;
          break;
        }
      }
    }
    
    if (chatItem) {
      iframeUrl = chatItem.chatId;
      iframeTitle = chatItem.name;
    }
  }
  
  if (!iframeUrl) {
    return React.createElement("div", { className: "h-full w-full flex items-center justify-center" },
      React.createElement("div", { className: "text-gray-500" }, "未找到指定的页面")
    );
  }
  
  return React.createElement("div", { className: "h-full w-full" },
    React.createElement("div", { className: "h-full w-full" },
      React.createElement("iframe", {
        src: iframeUrl,
        title: iframeTitle,
        className: "w-full h-full border-0",
        allowFullScreen: true,
        sandbox: "allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      })
    )
  );
}
