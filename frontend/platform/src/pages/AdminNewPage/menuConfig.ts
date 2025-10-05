import { FileText, MessageCircle, Settings } from "lucide-react";

// 聊天菜单项配置
export interface ChatMenuItem {
  id: string;
  name: string;
  type: "assistant" | "flow" | "iframe" | "chat";
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
    type?: "assistant" | "flow" | "iframe" | "chat";
    chatConfig?: ChatMenuItem;
  }>;
  isCollapsed: boolean;
}
// 聊天菜单配置

/** 
 */
export const chatMenuConfig: ChatMenuItem[] = [
  {
    id: "chat2",
    name: "AI创作版",
    type: "iframe",
    chatId: "https://aixuexi.cc/avue-data/priv",
    icon: "/src/assets/chuangzuoban.png",
  },
  {
    id: "chat3",
    name: "AI原理学习游戏",
    type: "iframe",
    chatId: "https://aixuexi.cc/ai3/youxi/tP8yS5gD2eM6eN4wI0jZ9vZ5uS9fS0dU8pH6vI3mV3fC2fC5rQ9xU7oX3tZ9hD0eS5sG7fX7tW0nV6zV2.html",
    icon: "/src/assets/aiyuanli.png",
  },
  {
    id: "chat4",
    name: "AI绘图（基础）",
    type: "assistant",
    chatId: "132d58f60e0f4b32a6a84b936d77f3b7",
    icon: "/src/assets/aihuitujichu.png",
  },
  {
    id: "chat5",
    name: "AI对话助手",
    type: "assistant",
    chatId: "236d01bc20f14a09a12bd24daa2ff14b",
    icon: "/src/assets/aiduihuazhushou.png",
  },
  {
    id: "chat6",
    name: "AI识图",
    type: "assistant",
    chatId: "27d7770ed1d04fadae9b0d633607821f",
    icon: "/src/assets/aishitu.png",
  },
  {
    id: "chat7",
    name: "文学创作辅导员",
    type: "assistant",
    chatId: "1db0673834f34d87b59fa51bb0104cee",
    icon: "/src/assets/wenxuechuangzuofuwu.png",
  },
  {
    id: "chat8",
    name: "AI阅读理解",
    type: "assistant",
    chatId: "1144b9b63c804dba919605cd74f90d0b",
    icon: "/src/assets/yuedulijie.png",
  },
  {
    id: "chat9",
    name: "古诗学习小助手",
    type: "assistant",
    chatId: "1ea97db900254ef3a5d1fceea921df43",
    icon: "/src/assets/gushixuexixiaozhushou.png",
  },
  {
    id: "chat10",
    name: "逻辑思维辅导员",
    type: "assistant",
    chatId: "aac4be32a6a649f798f6cc6ade466a7f",
    icon: "/src/assets/luojisiweifudaoyuan.png",
  },
  {
    id: "chat11",
    name: "AI小翻译家",
    type: "assistant",
    chatId: "3c7980284630419b9faab6f26125a9df",
    icon: "/src/assets/aixiaofanyijia.png",
  },
  {
    id: "chat12",
    name: "AI辅助记单词",
    type: "assistant",
    chatId: "0f23e82c0ead435f81009acfe4023195",
    icon: "/src/assets/aifuzhujidanci.png",
  },
  {
    id: "chat13",
    name: "AI辩论",
    type: "assistant",
    chatId: "91318a476b2b4acc9dcbf6d44454a064",
    icon: "/src/assets/aibianlun.png",
  },
  {
    id: "chat14",
    name: "AI编程小助手",
    type: "assistant",
    chatId: "bdd52a20831d43a0a03c17a8414d5b66",
    icon: "/src/assets/mofang.png",
  },
  {
    id: "chat15",
    name: "AI生成视频",
    type: "assistant",
    chatId: "32f57d0c97db46eaadf71bd8e5642c85",
    icon: "/src/assets/aishengcshipin.png",
  },
  {
    id: "psychology_test",
    name: "心理小屋",
    type: "iframe",
    chatId: "https://aixuexi.cc/ai3/xinlixiaowu/index.html",
    icon: "/src/assets/xinlixiaowu.png",
  },
  {
    id: "chat16",
    name: "AI音乐家",
    type: "assistant",
    chatId: "2070ef768422436b809e370626c01d2c",
    icon: "/src/assets/aiyuinyuejia.png",
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

// 更多功能菜单配置
export const moreMenuConfig: ChatMenuItem[] = [
  {
    id: "test",
    name: "海报设计",
    type: "iframe",
    chatId: "https://aixuexi.cc/_sheji_ui/home",
    icon: "/src/assets/haibaosheji.png",
  },
  {
    id: "siwei1",
    name: "思维导图",
    type: "iframe",
    chatId: "https://aixuexi.cc/dev/naotu/list",
    icon: "/src/assets/mofang.png",
  },
  {
    id: "huitu",
    name: "绘图工具",
    type: "iframe",
    chatId: "https://aixuexi.cc/_ps/index.html",
    icon: "/src/assets/huitugongju.png",
  },
  {
    id: "ziyuan",
    name: "资源文件",
    type: "iframe",
    chatId: "https://aixuexi.cc/dev/file/index",
    icon: "/src/assets/ziyuanwenjian.png",
  },
  {
    id: "sucaijiaoxue",
    name: "教学素材",
    type: "iframe",
    chatId: "http://admin.aixuexi.cc/boots/S9Ij984bcgI79I8kMnLJWmY2?TOKEN_USER=lrXF8hhIVgELEkAyyCtcBnq7t56Q5AWiFWkSMlu-lA7ibJsroqw1p1dUeWXKKRXJjsXXe4a9ZqrHq29EgvJePw==_753",
    icon: "/src/assets/jiaoxuesucai.png",
  }
];

// 菜单分组配置
export const menuGroupsConfig: MenuGroupConfig[] = [
  {
    id: "basic",
    label: "基础功能",
    icon: FileText,
    items: [
      // 动态生成聊天菜单项
      ...chatMenuConfig.map((chat) => ({
        id: chat.id,
        label: chat.name,
        path:
          chat.type === "iframe"
            ? `iframe/${chat.id}`
            : `chat/${chat.type}/auth/${chat.chatId}`,
        icon: chat.icon || MessageCircle,
        type: "chat" as const,
        chatConfig: chat,
      })),
    ],
    isCollapsed: false,
  },
  {
    id: "more",
    label: "更多功能",
    icon: Settings,
    items: [
      // 动态生成更多功能菜单项
      ...moreMenuConfig.map((item) => ({
        id: item.id,
        label: item.name,
        path: `iframe/${item.id}`,
        icon: item.icon || MessageCircle,
        type: item.type,
        chatConfig: item,
      })),
    ],
    isCollapsed: true,
  },
];

// 首页菜单项配置
export const homeMenuConfig = {
  id: "home",
  label: "首页",
  path: "",
  icon: "/src/assets/menushouye.png",
};
