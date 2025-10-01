// 这是一个示例配置文件，展示如何扩展菜单
// 复制此文件为 menuConfig.ts 并根据需要修改

import { MessageCircle, Users, Settings, Home, FileText, Shield, Bot, Zap } from "lucide-react";

// 聊天菜单项配置示例
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
  // 添加更多聊天菜单项示例
  {
    id: "chat4",
    name: "智能助手",
    type: "assistant",
    chatId: "your-assistant-id-here",
    icon: Bot
  },
  {
    id: "chat5",
    name: "工作流助手",
    type: "flow", 
    chatId: "your-flow-id-here",
    icon: Zap
  },
  {
    id: "chat6",
    name: "客服助手",
    type: "assistant",
    chatId: "customer-service-id",
    icon: MessageCircle
  }
];

// 菜单分组配置示例
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
        path: `chat/${chat.type}/auth/${chat.chatId}`,
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
