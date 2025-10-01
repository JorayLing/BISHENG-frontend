# 菜单配置系统

这个菜单配置系统允许您通过配置文件轻松管理和扩展左侧菜单，特别是聊天相关的菜单项。

## 文件结构

- `menuConfig.ts` - 主配置文件
- `menuConfig.example.ts` - 示例配置文件
- `index.tsx` - 主组件，使用配置文件渲染菜单

## 如何添加新的聊天菜单项

### 1. 编辑 `menuConfig.ts` 文件

在 `chatMenuConfig` 数组中添加新的聊天菜单项：

```typescript
export const chatMenuConfig: ChatMenuItem[] = [
  // 现有配置...
  {
    id: "chat4",                    // 唯一ID
    name: "新聊天助手",              // 显示名称
    type: "assistant",              // 类型：assistant 或 flow
    chatId: "your-chat-id-here",   // 聊天ID
    icon: MessageCircle             // 图标（可选）
  }
];
```

### 2. 配置项说明

- `id`: 菜单项的唯一标识符
- `name`: 在菜单中显示的名称
- `type`: 聊天类型
  - `"assistant"`: 使用 ChatAssistantAuthSubRoute 组件
  - `"flow"`: 使用 ChatFlowAuthSubRoute 组件
- `chatId`: 实际的聊天ID，会传递给组件
- `icon`: 菜单图标（可选，默认为 MessageCircle）

### 3. 路径自动生成

系统会自动根据配置生成路径：
- `assistant` 类型: `chat/assistant/auth/{chatId}`
- `flow` 类型: `chat/flow/auth/{chatId}`

## 如何添加其他菜单项

在 `menuGroupsConfig` 中的相应分组添加菜单项：

### 普通菜单项
```typescript
{
  id: "more",
  label: "更多功能",
  icon: Settings,
  items: [
    // 现有菜单项...
    { 
      id: "newFeature", 
      label: "新功能", 
      path: "new-feature", 
      icon: FileText 
    }
  ],
  isCollapsed: true
}
```

### iframe菜单项
```typescript
{
  id: "more",
  label: "更多功能",
  icon: Settings,
  items: [
    // 现有菜单项...
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
    }
  ],
  isCollapsed: true
}
```

## 分组管理

### 创建新分组

```typescript
{
  id: "custom",
  label: "自定义功能",
  icon: CustomIcon,
  items: [
    // 菜单项...
  ],
  isCollapsed: false  // 默认是否折叠
}
```

### 分组属性

- `id`: 分组的唯一标识符
- `label`: 分组显示名称
- `icon`: 分组图标
- `items`: 分组内的菜单项数组
- `isCollapsed`: 默认折叠状态

## 图标使用

可以使用任何 Lucide React 图标：

```typescript
import { MessageCircle, Bot, Zap, Settings, Home } from "lucide-react";
```

## 注意事项

1. 确保每个菜单项的 `id` 是唯一的
2. 聊天菜单项的 `chatId` 必须是有效的聊天ID
3. 添加新菜单项后，确保在 `componentMap` 中有对应的组件映射
4. 修改配置后需要重启开发服务器

## 示例

查看 `menuConfig.example.ts` 文件了解完整的配置示例。