import React from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { MessageCircle, Users, Settings, Home, FileText, Shield, Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import logoImage from "../../assets/logo.png";
import HomeSubRoute from "./HomeSubRoute";
import ChatSubRoute from "./ChatSubRoute";
import UsersSubRoute from "./UsersSubRoute";
import TestSubRoute from "./TestSubRoute";
import ChatFlowAuthSubRoute from "./ChatFlowAuthSubRoute";
import ChatAssistantAuthSubRoute from "./ChatAssistantAuthSubRoute";
import IframeSubRoute from "./IframeSubRoute";
import { menuGroupsConfig, homeMenuConfig, chatMenuConfig } from "./menuConfig";

// 标签页类型定义
interface TabItem {
  id: string;
  label: string;
  path: string;
  icon: any;
  isActive: boolean;
  component?: React.ComponentType<any>;
  props?: any;
}

// 菜单项类型定义
interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: any;
}

// 菜单分组类型定义
interface MenuGroup {
  id: string;
  label: string;
  icon: any;
  items: MenuItem[];
  isCollapsed: boolean;
}

export default function AdminNewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [tabs, setTabs] = React.useState<TabItem[]>([]);
  const [activeTabId, setActiveTabId] = React.useState<string>("home");
  const [collapsedGroups, setCollapsedGroups] = React.useState<Record<string, boolean>>({
    basic: false,
    more: true
  });

  // 动态生成组件映射
  const getComponentMap = () => {
    const baseMap: Record<string, React.ComponentType<any>> = {
      home: HomeSubRoute,
      test: TestSubRoute,
      chat: ChatSubRoute,
      users: UsersSubRoute,
      roles: () => React.createElement("div", { className: "p-6" }, 
        React.createElement("h2", { className: "text-xl font-semibold" }, "角色管理")
      ),
      docs: () => React.createElement("div", { className: "p-6" }, 
        React.createElement("h2", { className: "text-xl font-semibold" }, "项目文档")
      ),
      settings: () => React.createElement("div", { className: "p-6" }, 
        React.createElement("h2", { className: "text-xl font-semibold" }, "系统设置")
      ),
    };

    // 动态添加聊天菜单项
    chatMenuConfig.forEach(chat => {
      if (chat.type === 'assistant') {
        baseMap[chat.id] = ChatAssistantAuthSubRoute;
      } else if (chat.type === 'flow') {
        baseMap[chat.id] = ChatFlowAuthSubRoute;
      } else if (chat.type === 'iframe') {
        baseMap[chat.id] = IframeSubRoute;
      }
    });

    // 处理更多功能分组中的iframe菜单项
    menuGroupsConfig.forEach(group => {
      group.items.forEach(item => {
        if (item.type === 'iframe' && item.chatConfig) {
          baseMap[item.id] = IframeSubRoute;
        }
      });
    });

    return baseMap;
  };

  const componentMap = getComponentMap();

  // 使用配置文件中的菜单结构
  const menuGroups = menuGroupsConfig;
  const homeMenuItem = homeMenuConfig;

  // 获取所有菜单项的扁平列表（用于查找）
  const allMenuItems = [homeMenuItem, ...menuGroups.flatMap(group => group.items)];

  // 切换分组折叠状态
  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const handleMenuClick = (item: any) => {
    console.log('点击菜单:', item.label, '路径:', item.path);
    
    // 检查标签页是否已存在
    const existingTab = tabs.find(tab => tab.id === item.id);
    
    if (existingTab) {
      // 如果标签页已存在，切换到该标签页
      setActiveTabId(item.id);
      navigate(item.path);
    } else {
      // 如果标签页不存在，创建新标签页
      const chatConfig = item.chatConfig;
      let props = {};
      
      if (chatConfig) {
        if (chatConfig.type === 'iframe') {
          props = { url: chatConfig.chatId, title: chatConfig.name };
        } else {
          props = { id: chatConfig.chatId };
        }
      }
      
      const newTab: TabItem = {
        id: item.id,
        label: item.label,
        path: item.path,
        icon: item.icon,
        isActive: true,
        component: componentMap[item.id],
        props: props
      };
      
      // 更新所有标签页的激活状态
      const updatedTabs = tabs.map(tab => ({ ...tab, isActive: false }));
      updatedTabs.push(newTab);
      
      setTabs(updatedTabs);
      setActiveTabId(item.id);
      navigate(item.path);
    }
    
    // 在移动端点击菜单后关闭侧边栏
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // 关闭标签页
  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (tabs.length <= 1) return; // 至少保留一个标签页
    
    const updatedTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(updatedTabs);
    
    // 如果关闭的是当前激活的标签页，切换到其他标签页
    if (activeTabId === tabId) {
      const newActiveTab = updatedTabs[updatedTabs.length - 1];
      setActiveTabId(newActiveTab.id);
      navigate(newActiveTab.path);
    }
  };

  // 切换标签页
  const switchTab = (tabId: string) => {
    setActiveTabId(tabId);
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      navigate(tab.path);
    }
  };

  const getCurrentActiveMenu = () => {
    const currentPath = location.pathname;
    console.log('当前路径:', currentPath);
    
    // 移除 /adminNew 前缀，获取相对路径
    const relativePath = currentPath.replace('/adminNew', '') || '/';
    console.log('相对路径:', relativePath);
    
    const menuItem = allMenuItems.find(item => {
      if (item.path === '') {
        return relativePath === '/' || relativePath === '';
      }
      return relativePath === `/${item.path}` || relativePath === item.path;
    });
    
    console.log('匹配的菜单项:', menuItem);
    return menuItem ? menuItem.id : "home";
  };

  // 初始化首页标签页
  React.useEffect(() => {
    if (tabs.length === 0) {
      const homeTab: TabItem = {
        id: "home",
        label: "首页",
        path: "",
        icon: Home,
        isActive: true,
        component: componentMap.home,
        props: {}
      };
      setTabs([homeTab]);
      setActiveTabId("home");
    }
  }, [tabs.length]);

  const currentMenu = allMenuItems.find(item => getCurrentActiveMenu() === item.id);

  return React.createElement("div", { className: "flex h-screen bg-gray-50" },
    // 移动端遮罩层
    sidebarOpen && React.createElement("div", {
      className: "fixed inset-0 bg-black   z-40 md:hidden",
      onClick: () => setSidebarOpen(false)
    }),

    // 侧边栏
    React.createElement("div", {
      className: `
        fixed md:relative z-50 md:z-auto
        w-64   shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        h-full 
        
      `
    },
      // 侧边栏头部
      React.createElement("div", { className: "p-6 border-b border-gray-200" },
        React.createElement("div", { className: "flex items-center justify-between" },
          React.createElement("div", { className: "flex items-center space-x-3" },
            React.createElement("div", { className: "  h-8   rounded flex items-center justify-center" },
              React.createElement("img", { 
                src: logoImage,
                alt: "logo",
                className: "  h-8"
              })
            ),
            // React.createElement("span", { className: "text-xl font-semibold text-gray-800" }, "人工智能学习平台")
          ),
          React.createElement("button", {
            className: "md:hidden p-1 rounded-md hover:bg-gray-100",
            onClick: () => setSidebarOpen(false)
          },
            React.createElement(X, { className: "w-5 h-5" })
          )
        )
      ),
      
      // 导航菜单
      React.createElement("nav", { className: "mt-6" },
        // 首页菜单项（独立显示）
        React.createElement("div", { className: "mb-4" },
          React.createElement("button", {
            onClick: () => handleMenuClick(homeMenuItem),
            className: `w-full flex items-center px-6 py-3 text-left transition-colors duration-200 ${
              getCurrentActiveMenu() === homeMenuItem.id
                ? "bg-green-50 text-green-600 border-r-2 border-green-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          },
            React.createElement(Home, { className: "w-5 h-5 mr-3" }),
            React.createElement("span", { className: "font-medium" }, homeMenuItem.label)
          )
        ),
        
        // 分组菜单
        menuGroups.map((group) => {
          const GroupIcon = group.icon;
          const isCollapsed = collapsedGroups[group.id];
          
          return React.createElement("div", { key: group.id, className: "mb-2" },
            // 分组标题
            React.createElement("button", {
              onClick: () => toggleGroup(group.id),
              className: "w-full flex items-center justify-between px-6 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            },
              React.createElement("div", { className: "flex items-center" },
                React.createElement(GroupIcon, { className: "w-5 h-5 mr-3" }),
                React.createElement("span", { className: "font-medium text-sm" }, group.label)
              ),
              React.createElement(isCollapsed ? ChevronRight : ChevronDown, { 
                className: "w-4 h-4 text-gray-400" 
              })
            ),
            
            // 分组内容
            !isCollapsed && React.createElement("div", { className: "ml-4" },
              group.items.map((item) => {
                const Icon = item.icon;
                const isActive = getCurrentActiveMenu() === item.id;
                
                return React.createElement("button", {
                  key: item.id,
                  onClick: () => handleMenuClick(item),
                  className: `w-full flex items-center px-6 py-2 text-left transition-colors duration-200 rounded-md ${
                    isActive
                      ? "bg-green-50 text-green-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                },
                  React.createElement(Icon, { className: "w-4 h-4 mr-3" }),
                  React.createElement("span", { className: "font-medium text-sm" }, item.label)
                );
              })
            )
          );
        })
      )
    ),

    // 主内容区域
    React.createElement("div", { className: "flex-1 flex flex-col min-w-0" },
      // 顶部导航栏
      React.createElement("div", { className: "bg-white shadow-sm border-b border-gray-200" },
        // 标题栏
        React.createElement("div", { className: "px-4 py-4 md:px-6" },
          React.createElement("div", { className: "flex items-center justify-between" },
            React.createElement("div", { className: "flex items-center space-x-4" },
              React.createElement("button", {
                className: "md:hidden p-2 rounded-md hover:bg-gray-100",
                onClick: () => setSidebarOpen(true)
              },
                React.createElement(Menu, { className: "w-5 h-5" })
              ),
              React.createElement("h1", { className: "text-xl md:text-2xl font-semibold text-gray-800" },
                currentMenu?.label || "首页"
              )
            ),
            React.createElement("div", { className: "flex items-center space-x-4" },
              React.createElement("div", { className: "text-sm text-gray-500 hidden md:block" },
                "欢迎使用管理后台"
              ),
              React.createElement("div", { className: "w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center" },
                React.createElement("span", { className: "text-sm font-medium text-gray-600" }, "A")
              )
            )
          )
        ),
        
        // 标签页栏
        tabs.length > 1 && React.createElement("div", { className: "px-4 pb-2 md:px-6" },
          React.createElement("div", { className: "flex space-x-1 overflow-x-auto" },
            tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTabId === tab.id;
              
              return React.createElement("div", {
                key: tab.id,
                onClick: () => switchTab(tab.id),
                className: `flex items-center px-3 py-2 rounded-t-lg text-sm font-medium cursor-pointer transition-colors duration-200 ${
                  isActive
                    ? "bg-green-50 text-green-600 border-b-2 border-green-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`
              },
                React.createElement(Icon, { className: "w-4 h-4 mr-2" }),
                React.createElement("span", { className: "whitespace-nowrap" }, tab.label),
                tabs.length > 1 && React.createElement("button", {
                  onClick: (e) => closeTab(tab.id, e),
                  className: "ml-2 p-1 rounded-full hover:bg-gray-300 transition-colors duration-200",
                  title: "关闭标签页"
                },
                  React.createElement("span", { className: "text-xs" }, "×")
                )
              );
            })
          )
        )
      ),

       // 内容区域
       React.createElement("div", { className: "flex-1 overflow-hidden" },
         React.createElement("div", { className: "h-full" },
           // 渲染所有标签页内容，但只显示当前激活的标签页
           tabs.map((tab) => {
             const Component = tab.component;
             if (!Component) return null;
             
             return React.createElement("div", {
               key: tab.id,
               className: `h-full w-full ${activeTabId === tab.id ? 'block' : 'hidden'}`,
               style: { display: activeTabId === tab.id ? 'block' : 'none' }
             },
               React.createElement(Component, tab.props || {})
             );
           })
         )
       )
    )
  );
}