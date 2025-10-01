import { MessageCircle, Users, Settings, Home, FileText, Shield } from "lucide-react";

// 聊天菜单项配置
export interface ChatMenuItem {
  id: string;
  name: string;
  type: 'assistant' | 'flow' | 'iframe';
  chatId: string;
  icon?: any;
}

// 菜单分组配置
export interface MenuGroupConfig {
  id: string;
  label: string;
  icon: any;
  items: Array<{
    id: string;
    label: string;
    path: string;
    icon: any;
    type?: 'chat' | 'iframe';
    chatConfig?: ChatMenuItem;
  }>;
  isCollapsed: boolean;
}

// 聊天菜单配置
export const chatMenuConfig: ChatMenuItem[] = [
  {
    id: "chat2",
    name: "聊天2",
    type: "assistant",
    chatId: "236d01bc20f14a09a12bd24daa2ff14b",
    icon: MessageCircle
  },
  {
    id: "chat3", 
    name: "聊天3",
    type: "flow",
    chatId: "1b87aea2a46b40febe3e0d8bc10364bf",
    icon: MessageCircle
  },
  {
    id: "chat4", 
    name: "数学答案生成",
    type: "flow",
    chatId: "7f93ec779e8c442686189fadd222267e",
    icon: MessageCircle
  },
  {
    id: "psychology_test",
    name: "心理测试",
    type: "iframe",
    chatId: "http://ai.nocode.cc/chatbot/LrjHRi4h9CGIjSmE",
    icon: MessageCircle
  },
  // 可以在这里添加更多聊天菜单项
  // {
  //   id: "chat4",
  //   name: "聊天4",
  //   type: "assistant", 
  //   chatId: "your-chat-id-here",
  //   icon: MessageCircle
  // }
];

// 菜单分组配置
export const menuGroupsConfig: MenuGroupConfig[] = [
  {
    id: "basic",
    label: "基础功能",
    icon: FileText,
    items: [
      // 动态生成聊天菜单项
      ...chatMenuConfig.map(chat => ({
        id: chat.id,
        label: chat.name,
        path: chat.type === 'iframe' ? `iframe/${chat.id}` : `chat/${chat.type}/auth/${chat.chatId}`,
        icon: chat.icon || MessageCircle,
        type: 'chat' as const,
        chatConfig: chat
      }))
    ],
    isCollapsed: false
  },
  {
    id: "more",
    label: "更多功能", 
    icon: Settings,
    items: [
      { id: "test", label: "测试", path: "test", icon: FileText },
      { id: "chat", label: "聊天", path: "chat", icon: MessageCircle },
      { 
        id: "baidu", 
        label: "百度", 
        path: "iframe/baidu", 
        icon: FileText,
        type: 'iframe',
        chatConfig: {
          id: "baidu",
          name: "百度",
          type: "iframe",
          chatId: "https://www.baidu.com",
          icon: FileText
        }
      },
      { id: "users", label: "用户管理", path: "users", icon: Users },
      { id: "roles", label: "角色管理", path: "roles", icon: Shield },
      { id: "docs", label: "项目文档", path: "docs", icon: FileText },
      { id: "settings", label: "系统设置", path: "settings", icon: Settings }
    ],
    isCollapsed: true
  }
];

// 首页菜单项配置
export const homeMenuConfig = {
  id: "home",
  label: "首页",
  path: "",
  icon: Home
};
