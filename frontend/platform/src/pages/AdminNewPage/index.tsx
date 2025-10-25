import {
  ChevronDown,
  ChevronRight,
  CircleChevronLeft,
  CircleChevronRight,
} from "lucide-react";
import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { bsResetPassword } from "../../components/bs-ui/alertDialog/useResetPassword";
// 使用相对路径引用公共资源
const logoImage = '/assets/images/logo.png';
const menuHomeIcon = '/assets/images/menushouye.png';
const openGroupIcon = '/assets/images/opengroup.png';
const tagLeftArrow = '/assets/images/tagleftarrow.png';
const tagRightArrow = '/assets/images/tagrightarrow.png';
const tagCloseIcon = '/assets/images/tagcloseicon.png';
const leftRa = '/assets/images/leftra.png';
const rightRa = '/assets/images/rightra.png';
import { bsConfirm } from "../../components/bs-ui/alertDialog/useConfirm";
import { userContext } from "../../contexts/userContext";
import { logoutApi } from "../../controllers/API/user";
import { captureAndAlertRequestErrorHoc } from "../../controllers/request";
import ChatAssistantAuthSubRoute from "./ChatAssistantAuthSubRoute";
import ChatFlowAuthSubRoute from "./ChatFlowAuthSubRoute";
import ChatSubRoute from "./ChatSubRoute";
import HomeSubRoute from "./HomeSubRoute";
import IframeSubRoute from "./IframeSubRoute";
import { homeMenuConfig, menuGroupsConfig } from "./menuConfig";
import TestSubRoute from "./TestSubRoute";
import UsersSubRoute from "./UsersSubRoute";

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
interface ChatMenuItem {
  type: 'chat' | 'iframe' | 'assistant' | 'flow';
  chatId: string;
  name?: string;
}

interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: any;
  chatConfig?: ChatMenuItem;
}

// 菜单分组类型定义
interface MenuGroup {
  id: string;
  label: string;
  icon: any;
  items: MenuItem[];
  isCollapsed: boolean;
}
let userInfoshow=''
export default function AdminNewPage() {
  const { user, setUser } = useContext(userContext);
  const userPermissions = JSON.parse(localStorage.getItem('userPermissions') || '{}');
  if(userPermissions) {
    // console.log(userPermissions);
    if(userPermissions.school_name) {
      userInfoshow = userPermissions.school_name+'('+userPermissions.nick_name+')';
    }else{
      userInfoshow = userPermissions.nick_name;
    }
  }
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showLeftScroll, setShowLeftScroll] = React.useState(false);
  const [showRightScroll, setShowRightScroll] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 退出登录
  const handleLogout = () => {
    bsConfirm({
      title: "提示!",
      desc: "确认退出登录？",
      okTxt: "确认",
      onOk(next) {
        captureAndAlertRequestErrorHoc(logoutApi()).then((_) => {
          setUser(null);
          localStorage.removeItem("isLogin");
          localStorage.removeItem("menuConfig");
          navigate("/login");
        });
        next();
      },
    });
  };

  // 修改密码
  const handleChangePassword = () => {
    localStorage.setItem("account", user.user_name);
    setShowUserMenu(false);
    bsResetPassword({
      onSuccess: () => {
        // 修改密码成功后执行退出登录
        captureAndAlertRequestErrorHoc(logoutApi()).then((_) => {
          setUser(null);
          localStorage.removeItem("isLogin");
          localStorage.removeItem("menuConfig");
          navigate("/login");
        });
      },
    });
  };

  // 点击其他区域关闭用户菜单
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [tabs, setTabs] = React.useState<TabItem[]>([]);
  const [activeTabId, setActiveTabId] = React.useState<string>("home");
  const [collapsedGroups, setCollapsedGroups] = React.useState<
    Record<string, boolean>
  >({
    basic: false,
    more: true,
  });

  // 动态生成组件映射
  const getComponentMap = (groups: typeof menuGroups) => {
    const baseMap: Record<string, React.ComponentType<any>> = {
      home: HomeSubRoute,
      test: TestSubRoute,
      chat: ChatSubRoute,
      users: UsersSubRoute,
      roles: () => (
        <div className="p-6">
          <h2 className="text-xl font-semibold">角色管理</h2>
        </div>
      ),
      docs: () => (
        <div className="p-6">
          <h2 className="text-xl font-semibold">项目文档</h2>
        </div>
      ),
      settings: () => (
        <div className="p-6">
          <h2 className="text-xl font-semibold">系统设置</h2>
        </div>
      ),
    };

    // 动态添加聊天菜单项
    menuGroups.forEach((group) => {
      group.items.forEach((item) => {
        const chatConfig = item.chatConfig;
        if (!chatConfig) return;

        if (chatConfig.type === "assistant") {
          baseMap[item.id] = ChatAssistantAuthSubRoute;
        } else if (chatConfig.type === "flow" || chatConfig.type === "chat") {
          baseMap[item.id] = ChatFlowAuthSubRoute;
        } else if (chatConfig.type === "iframe") {
          baseMap[item.id] = IframeSubRoute;
        }
        // console.log('Mapping component for:', item.id, chatConfig.type);
      });
    });

    // 已经在上面处理过所有菜单项的组件映射

    return baseMap;
  };

  const menuGroups = menuGroupsConfig;
  const homeMenuItem: MenuItem = homeMenuConfig;
  const allMenuItems = [
    homeMenuItem,
    ...menuGroups.flatMap((group) => group.items),
  ];
  const componentMap = getComponentMap(menuGroups);

  // 切换分组折叠状态
  const toggleGroup = (groupId: string) => {
    setCollapsedGroups((prev) => {
      // 创建新的状态对象，默认所有组都折叠
      const newState = Object.keys(prev).reduce(
        (acc, key) => {
          acc[key] = true;
          return acc;
        },
        {} as Record<string, boolean>,
      );

      // 切换当前点击的组的状态
      newState[groupId] = prev[groupId];

      return {
        ...newState,
        [groupId]: !prev[groupId],
      };
    });
  };

  const handleMenuClick = (item: any) => {
    // console.log("点击菜单:", item.label, "路径:", item.path);

    // 检查标签页是否已存在
    const existingTab = tabs.find((tab) => tab.id === item.id);

    if (existingTab) {
      // 如果标签页已存在，切换到该标签页
      setActiveTabId(item.id);
      if (item.chatConfig?.type === "iframe") {
        navigate(`/adminNew/iframe/${item.id}`);
      } else {
        navigate(`/adminNew/${item.path}`);
      }
    } else {
      // 如果标签页不存在，创建新标签页
      const chatConfig = item.chatConfig;
      let props = {};

      if (chatConfig) {
        if (chatConfig.type === "iframe") {
          props = { url: chatConfig.chatId, title: chatConfig.name };
        } else {
          props = { flowId: chatConfig.chatId };
        }
      }

      const newTab: TabItem = {
        id: item.id,
        label: item.label,
        path: item.path,
        icon: item.icon,
        isActive: true,
        component: componentMap[item.id],
        props: props,
      };

      // 更新所有标签页的激活状态
      const updatedTabs = tabs.map((tab) => ({ ...tab, isActive: false }));
      updatedTabs.push(newTab);

      setTabs(updatedTabs);
      setActiveTabId(item.id);
      if (item.chatConfig?.type === "iframe") {
        navigate(`/adminNew/iframe/${item.id}`);
      } else {
        navigate(`/adminNew/${item.path}`);
      }
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

    const updatedTabs = tabs.filter((tab) => tab.id !== tabId);
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
    const tab = tabs.find((t) => t.id === tabId);
    if (tab) {
      // 重置消息存储
      if (tab.props?.flowId) {
        // 如果是聊天相关的标签页，重新初始化对应的消息
        const chatComponent = tab.component;
        if (chatComponent === ChatAssistantAuthSubRoute || chatComponent === ChatFlowAuthSubRoute) {
          // 触发重新加载消息
          const event = new CustomEvent('resetChatMessages', {
            detail: { flowId: tab.props.flowId }
          });
          document.dispatchEvent(event);
        }
      }
      navigate(tab.path);
    }
  };

  const getCurrentActiveMenu = () => {
    const currentPath = location.pathname;
    // console.log("当前路径:", currentPath);

    // 移除 /adminNew 前缀，获取相对路径
    const relativePath = currentPath.replace("/adminNew", "") || "/";
    // console.log("相对路径:", relativePath);

    const menuItem = allMenuItems.find((item) => {
      if (item.path === "") {
        return relativePath === "/" || relativePath === "";
      }
      return relativePath === `/${item.path}` || relativePath === item.path;
    });

    // console.log("匹配的菜单项:", menuItem);
    return menuItem ? menuItem.id : "home";
  };

  // 根据路由获取菜单项
  const getMenuItemFromRoute = () => {
    const currentPath = location.pathname;
    const pathSegments = currentPath.split('/');
    
    // 处理 iframe 路由
    if (pathSegments.includes('iframe')) {
      const iframeId = pathSegments[pathSegments.length - 1];
      return allMenuItems.find(item => item.id === iframeId);
    }
    
    // 处理 assistant/auth 路由
    if (pathSegments.includes('assistant') && pathSegments.includes('auth')) {
      const assistantId = pathSegments[pathSegments.length - 1];
      return allMenuItems.find(item => 'chatConfig' in item && item.chatConfig?.chatId === assistantId);
    }

    // 处理普通路由
    const relativePath = currentPath.replace("/adminNew/", "");
    return allMenuItems.find(item => {
      if (item.path === "") {
        return relativePath === "/" || relativePath === "";
      }
      return relativePath === item.path || relativePath.startsWith(item.path + "/");
    });
  };

  // 初始化首页标签页和事件监听
  React.useEffect(() => {
    // 根据当前路由创建标签页
    const initializeTabFromRoute = () => {
      const menuItem = getMenuItemFromRoute();
      
      if (menuItem) {
        let props = {};
        if (menuItem.chatConfig) {
          if (menuItem.chatConfig.type === "iframe") {
            props = { url: menuItem.chatConfig.chatId, title: menuItem.chatConfig.name };
          } else {
            props = { flowId: menuItem.chatConfig.chatId };
          }
        }

        const newTab: TabItem = {
          id: menuItem.id,
          label: menuItem.label,
          path: menuItem.path,
          icon: menuItem.icon,
          isActive: true,
          component: componentMap[menuItem.id],
          props: props,
        };

        setTabs([newTab]);
        setActiveTabId(menuItem.id);
      } else {
        // 如果没有匹配的路由，创建首页标签
        const homeTab: TabItem = {
          id: "home",
          label: "首页",
          path: "",
          icon: menuHomeIcon,
          isActive: true,
          component: componentMap.home,
          props: {},
        };
        setTabs([homeTab]);
        setActiveTabId("home");
      }
    };

    if (tabs.length === 0) {
      initializeTabFromRoute();
    }

    // 添加自定义菜单点击事件监听
    const handleMenuClickEvent = (e: any) => {
      const item = e.detail;
      handleMenuClick(item);
    };

    document.addEventListener('menuclick', handleMenuClickEvent);
    return () => {
      document.removeEventListener('menuclick', handleMenuClickEvent);
    };
  }, [tabs.length, location.pathname]);

  const currentMenu = allMenuItems.find(
    (item) => getCurrentActiveMenu() === item.id,
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50 indexbgimage">
      {/* 顶部栏 */}
      <div className="h-16 flex items-center justify-between px-6">
        {/* 左侧 Logo 区域 */}
        <div className="flex items-center">
          <div className="h-8 rounded flex items-center justify-center">
            <img src={logoImage} alt="logo" className="h-8" />
          </div>
          {/* <span className="ml-3 text-xl font-semibold text-gray-800">人工智能学习平台</span> */}
        </div>

        {/* 右侧用户信息 */}
        <div className="flex items-center space-x-4">
          <div className="text-sm" style={{ color: "#5A87FB" }}>
            你好～{userInfoshow  || "未登录"}
          </div>
          <div className="relative user-menu-container flex items-center">
            <div
              className="w-[56px] h-[56px] userheadbg flex items-center justify-center mt-[-8px] cursor-pointer"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div>
                <img
                  src="/assets/images/head.png"
                  className="w-[46px] h-[46px]"
                  alt="userhead"
                />
              </div>
            </div>
            <img
              src="/assets/images/downarrow.png"
              className={`w-[12px] h-[8px] ml-2 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`}
              alt="arrow"
            />

            {/* 用户菜单 */}
            {showUserMenu && (
              <div className="absolute top-[30px] right-0 mt-2 w-[140px] bg-white rounded-lg shadow-lg py-2 z-50">
                <button
                  onClick={() => {
                    handleChangePassword();
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center"
                >
                  修改密码
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center"
                >
                  退出登录
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 下方主要内容区域 */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* 收起/展开按钮 - 绝对定位 */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`absolute top-[50%] z-[39] w-[20px] h-[100px] flex items-center justify-center hover:bg-blue-50 rounded-full transition-all duration-300 shadow-md bg-white ${
            sidebarOpen ? "left-[250px]" : "left-[0px]"
          }`}
          title={sidebarOpen ? "收起菜单" : "展开菜单"}
        >
        
            <img
            src="/assets/images/downarrow.png"
            className={`w-[12px]  transition-transform duration-200 ${sidebarOpen ? "rotate-90" : "rotate-[270deg]"}`}
            alt="arrow"
          />
          
        </button>
        
        {/* 左侧菜单 */}
        <div
          className={`
          transition-all duration-300 ease-in-out overflow-hidden
          ${sidebarOpen ? "w-64 pr-[20px]" : "w-0 pr-0"}
        `}
        >
          <nav className="h-full py-4 w-64">
            {/* 首页菜单项 */}
            <div className="mb-4">
              <button
                onClick={() => handleMenuClick(homeMenuItem)}
                className={`w-full flex items-center text-left transition-colors duration-200 h-[50px] ${
                  getCurrentActiveMenu() === homeMenuItem.id
                    ? "selectmenucss"
                    : "normalmenucss"
                }`}
              >
                {/* <Home className="w-5 h-5 mr-3" /> */}
                <img
                  src={homeMenuItem.icon}
                  alt="home"
                  className="w-[50px] h-[50px] mr-3"
                />
                <span className="font-medium" style={{ color: `${ getCurrentActiveMenu() === homeMenuItem.id ? "#fff" : "#0057FF"}`}}>
                  {homeMenuItem.label}
                </span>
              </button>
            </div>

            {/* 分组菜单 */}
            {menuGroups.map((group) => {
              const GroupIcon = group.icon;
              const isCollapsed = collapsedGroups[group.id];

              return (
                <div key={group.id} className="mb-2">
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between px-6 py-3 text-left groupmenucss h-[50px]"
                  >
                    <div className="flex items-center">
                      {/*  <GroupIcon className="w-5 h-5 mr-3" /> */}
                      <span
                        className="font-medium text-sm"
                        style={{ color: "#0057FF" }}
                      >
                        {group.label}
                      </span>
                    </div>
                    {isCollapsed ? (
                      <img src={openGroupIcon} className="w-4 h-4 rotate-[-90deg]" alt="down" />

                    ) : (
                    
                      <img src={openGroupIcon} className="w-4 h-4" alt="down" />
                    )}
                  </button>

                  {!isCollapsed && (
                    <div className="max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = getCurrentActiveMenu() === item.id;

                        return (
                          <button
                            key={item.id}
                            onClick={() => handleMenuClick(item)}
                            className={`w-full flex items-center px-6 py-2 text-left h-[50px] mt-[10px] ${
                              isActive ? "selectmenucss" : "normalmenucss"
                            }`}
                          >
                            <img
                              src={item.icon}
                              alt={item.label}
                              className="w-[50px] h-[50px] mr-3"
                            />
                            <span
                              className="font-medium text-sm"
                              style={{
                                color: `${isActive ? "#fff" : "#5A87FB"}`,
                              }}
                            >
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* 右侧内容区域 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 标签页栏 */}
          <div className="border-gray-200 h-[46px] flex items-center relative">
            {/* 左翻页按钮 */}
            {showLeftScroll && (
              <button
                onClick={() => {
                  const container = document.getElementById("tabs-container");
                  if (container) {
                    container.scrollLeft -= 200;
                  }
                }}
                className="absolute left-0 z-10 px-1 h-full flex items-center justify-center  "
              >
                <img src={tagLeftArrow} className="w-8 h-8" alt="left" />
            
              </button>
            )}

            {/* 右翻页按钮 */}
            {showRightScroll && (
              <button
                onClick={() => {
                  const container = document.getElementById("tabs-container");
                  if (container) {
                    container.scrollLeft += 200;
                  }
                }}
                className="absolute right-0 z-10 px-1 h-full flex items-center justify-center "
              >
                <img src={tagRightArrow} className="w-8 h-8" alt="right" />
             
              </button>
            )}

            {/* 标签容器 */}
            <div
              id="tabs-container"
              className="flex flex-nowrap space-x-1 overflow-x-hidden mx-[40px] pr-[10px] pl-[10px] scroll-smooth gap-[5px]"
              onScroll={(e) => {
                const container = e.currentTarget;
                setShowLeftScroll(container.scrollLeft > 0);
                setShowRightScroll(
                  container.scrollLeft <
                    container.scrollWidth - container.clientWidth,
                );
              }}
              ref={(el) => {
                if (el) {
                  const checkScroll = () => {
                    setShowLeftScroll(el.scrollLeft > 0);
                    setShowRightScroll(
                      el.scrollLeft < el.scrollWidth - el.clientWidth,
                    );
                  };
                  checkScroll();
                  // 监听容器大小变化
                  const observer = new ResizeObserver(checkScroll);
                  observer.observe(el);
                }
              }}
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTabId === tab.id;

                return (
                  <div
                    key={tab.id}
                    onClick={() => switchTab(tab.id)}
                    className={`group relative flex-none flex items-center h-[36px] px-3 pr-[14px] text-sm font-medium cursor-pointer     relative ${
                      isActive
                        ? "tagselectcss  h-[46px] "
                        : "tagnormalcss mt-[5px]"
                    }`}
                  >
                    {isActive && (
                      <>
                        <div className="absolute left-[-10px] bottom-0 w-[10px] h-[10px] ">
                          <img
                            src={leftRa}
                            className="w-[10px] h-[10px]"
                            alt="left"
                          />
                        </div>
                        <div className="absolute right-[-10px] bottom-0 w-[10px] h-[10px]  ">
                          <img
                            src={rightRa}
                            className="w-[10px] h-[10px]"
                            alt="right"
                          />
                        </div>
                      </>
                    )}
                    {/** 标签页图标<img
                       src={tab.icon}
                       alt={tab.label}
                       className="w-[20px] h-[20px] "
                     /> */}
                    <span className="whitespace-nowrap">{tab.label}</span>
                    {tabs.length > 1 && (
                      <button
                        onClick={(e) => closeTab(tab.id, e)}
                        className="opacity-0 group-hover:opacity-100 absolute right-0 h-[14px] w-[14px] top-0   transition-all duration-200"
                        title="关闭标签页"
                      >
                        <img src={tagCloseIcon} className="w-[14px] h-[14px]" alt="close" />
                        {/* <span className="text-xs">×</span> */}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 内容区域 */}
          <div className="flex-1 infoRidau overflow-hidden  w-[calc(100%-20px)]">
            {tabs.map((tab) => {
              const Component = tab.component;
              if (!Component) return null;

              return (
                <div
                  key={tab.id}
                  className={`h-full w-full ${activeTabId === tab.id ? "block" : "hidden"}`}
                  style={{ display: activeTabId === tab.id ? "block" : "none" }}
                >
                  <Component {...(tab.props || {})} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 移动端遮罩层 */}
      {/**sidebarOpen && (
        <div
          className="fixed inset-0 bg-black z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}*/}
    </div>
  );
}
