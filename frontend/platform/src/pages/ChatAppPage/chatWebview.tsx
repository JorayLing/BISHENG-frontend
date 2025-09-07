// 嵌iframe、适配移动端(企业接入)
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AssistantIcon, SkillIcon } from "@/components/bs-icons";
import { PlusBoxIcon, PlusBoxIconDark } from "@/components/bs-icons/plusBox";
import { TitleLogo } from "@/components/bs-comp/cardComponent";
import { useMessageStore } from "@/components/bs-comp/chatComponent/messageStore";
import { useMessageStore as useFlowMessageStore } from "@/pages/BuildPage/flow/FlowChat/messageStore";
import { captureAndAlertRequestErrorHoc } from "../../controllers/request";
import { deleteChatApi, getChatsApi } from "../../controllers/API";
import { getFlowApi } from "../../controllers/API/flow";
import { getAssistantDetailApi } from "../../controllers/API/assistant";
import { bsConfirm } from "@/components/bs-ui/alertDialog/useConfirm";
import { generateUUID } from "@/utils";
import ChatPanne from "./components/ChatPanne";
import LoadMore from "@/components/bs-comp/loadMore";
import { userContext } from "@/contexts/userContext";
import { AppNumType } from "@/types/app";
import { Trash2 } from "lucide-react";
import { formatStrTime } from "@/util/utils";

const ChatItem = ({ chat, chatId, location, handleSelectChat, handleDeleteChat, _k }) => {
    return (
        <div
            key={chat.chat_id}
            className={`group item w-full rounded-lg mt-2 p-4 relative hover:bg-[#EDEFF6] cursor-pointer dark:hover:bg-[#34353A] ${location
                ? 'bg-[#f9f9fc] dark:bg-[#212122]'
                : (chatId === chat.chat_id
                    ? 'bg-[#EDEFF6] dark:bg-[#34353A]'
                    : 'bg-[#f9f9fc] dark:bg-[#212122]')}`}
            onClick={() => handleSelectChat(chat)}
        >
            <div className="flex place-items-center space-x-3">
                <div className="inline-block bg-purple-500 rounded-md">
                    <TitleLogo
                        url={chat.logo}
                        id={chat.flow_id}
                    >
                        {chat.flow_type === 'assistant' ? <AssistantIcon /> : <SkillIcon />}
                    </TitleLogo>
                </div>
                <p className="truncate text-sm font-bold leading-6">{chat.flow_name}</p>
            </div>
            {/* 消息预览 - 与assistant页面保持一致 */}
            <span className="block text-xs text-gray-600 dark:text-[#8D8D8E] mt-3 break-words truncate">
               {chat.earliest_message?.remark || chat.latest_message?.message || ""}
            </span>
            {/* 底部信息 - 与assistant页面保持一致 */}
            <div className="mt-6">
                <span className="text-gray-400 text-xs absolute bottom-2 left-4">
                    {formatStrTime(chat.update_time, 'MM 月 dd 日')}
                </span>
                <Trash2
                    size={14}
                    className="absolute bottom-2 right-2 text-gray-400 hidden group-hover:block"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChat(chat.chat_id);
                    }}
                />
            </div>
        </div>
    );
};

// assistant workflow flow
export default function ChatPro({ type = AppNumType.SKILL }) {
    const { t } = useTranslation();
    const { id: flowId } = useParams()
    const { user } = useContext(userContext);

    // 聊天列表相关状态
    const { chatList, chatId, chatsRef, setChatId, addChat, deleteChat, onScrollLoad, pageRef, refreshChatList, setChatList, refreshSpecificChat } = useChatList();
    const [location, setLocation] = useState(true);
    const [loading, setLoading] = useState(true);
    const [selectChat, setSelelctChat] = useState<any>(null);
    const [workflow, setWorkflow] = useState<any>(null);

    // 获取消息状态用于监听
    const { messages } = type === AppNumType.ASSISTANT ? useMessageStore() : useFlowMessageStore();

    // 新建会话防抖状态
    const [isCreatingChat, setIsCreatingChat] = useState(false);

    // 防止重复初始化
    const isInitialized = useRef(false);

    // 防止重复更新聊天列表
    const lastUpdatedMessageId = useRef(null);

    useEffect(() => {
        if (flowId && !isInitialized.current) {
            isInitialized.current = true;
            const initializeFlow = async () => {
                try {
                    console.log("=== 聊天页面初始化开始 ===", "ID:", flowId, "类型:", type);

                    let _workflow;
                    // 根据类型选择正确的API
                    if (type === AppNumType.ASSISTANT) {
                        _workflow = await getAssistantDetailApi(flowId, 'v1');
                        console.log("助手数据加载完成:", _workflow);
                    } else {
                        _workflow = await getFlowApi(flowId, 'v1');
                        console.log("工作流数据加载完成:", _workflow);
                    }
                    setWorkflow(_workflow);

                    // 刷新聊天列表
                    await refreshChatList();

                    // 只有assistant类型才自动创建新聊天
                    if (type === AppNumType.ASSISTANT) {
                        await handlerSelectFlow(_workflow);
                        console.log("Assistant页面初始化完成，已自动创建新聊天");
                    } else {
                        console.log("Flow页面初始化完成，等待用户手动创建聊天");
                    }
                } catch (error) {
                    console.error("页面初始化失败:", error);
                    // 如果加载失败，使用默认信息
                    const defaultWorkflow = {
                        id: flowId,
                        name: type === AppNumType.ASSISTANT ? `助手 ${flowId}` : `工作流 ${flowId}`,
                        logo: '',
                        description: type === AppNumType.ASSISTANT ? '助手描述' : '工作流描述',
                        desc: type === AppNumType.ASSISTANT ? '助手描述' : '工作流描述'
                    };
                    setWorkflow(defaultWorkflow);
                    await refreshChatList();

                    // 只有assistant类型才自动创建新聊天
                    if (type === AppNumType.ASSISTANT) {
                        await handlerSelectFlow(defaultWorkflow);
                    }
                } finally {
                    setLoading(false);
                }
            };

            initializeFlow();
        }
    }, [flowId, type]);

    // 监听消息变化，在助手回复完成时更新聊天列表
    useEffect(() => {
        if (messages && messages.length > 0 && selectChat?.chatId) {
            const latestMessage = messages[messages.length - 1];

            // 检查是否是助手回复完成，并且没有处理过这条消息
            if (latestMessage.is_bot &&
                (latestMessage.type === 'end' || latestMessage.type === 'over' || latestMessage.end) &&
                lastUpdatedMessageId.current !== latestMessage.id) {

                console.log("助手回复完成，准备更新聊天列表信息");

                // 记录已处理的消息ID，防止重复处理
                lastUpdatedMessageId.current = latestMessage.id;

                // 延迟3秒后更新特定聊天信息（给服务器时间生成总结）
                setTimeout(() => {
                    refreshSpecificChat(selectChat.chatId);
                }, 3000);
            }
        }
    }, [messages, selectChat?.chatId]);

    // 处理选择聊天记录
    const handleSelectChat = (chat) => {
        setSelelctChat({ id: chat.flow_id, chatId: chat.chat_id, type: type });
        setChatId(chat.chat_id);
        setLocation(false);
    };

    // 处理删除聊天记录
    const handleDeleteChat = (chatId: string) => {
        bsConfirm({
            desc: t('chat.confirmDeleteChat'),
            onOk: async (next) => {
                // 检查是否删除的是当前聊天
                const isCurrentChat = chatId === selectChat?.chatId;

                if (isCurrentChat) {
                    // 删除当前聊天时，清空右侧聊天面板，回到初始状态
                    console.log("删除当前聊天，清空聊天面板");
                    setLocation(true);
                    setSelelctChat(null);
                    setChatId('');
                } else {
                    // 删除其他聊天，不影响当前聊天面板
                    console.log("删除其他聊天，保持当前聊天不变");
                }

                // 立即从本地列表中移除这条数据（无延迟）
                console.log("立即从列表中移除聊天:", chatId);
                setChatList(prev => prev.filter(chat => chat.chat_id !== chatId));

                // 执行服务器删除操作（后台进行）
                deleteChat(chatId);

                next();
            }
        });
    };

    // 处理新建会话 - 根据类型适配不同的数据结构
    const handlerSelectFlow = async (workflowInfo = null) => {
        // 防抖检查：如果正在创建中，直接返回
        if (isCreatingChat) {
            console.log("正在创建聊天中，请稍后再试...");
            return;
        }

        console.log("开始创建新聊天...");
        setIsCreatingChat(true); // 设置创建状态

        setLocation(false);
        const _chatId = generateUUID(32);
        setSelelctChat({ id: flowId, chatId: _chatId, type: type });
        setChatId(_chatId);
        pageRef.current = 0;

        // 使用传入的信息，或从现有聊天记录中获取，或使用默认值
        const _workflow = workflowInfo || workflow;
        const existingChat = chatList.find(chat => chat.flow_id === flowId);

        // 根据类型处理不同的数据结构
        let name, description;
        if (type === AppNumType.ASSISTANT) {
            // Assistant API返回的是desc字段
            name = _workflow?.name || existingChat?.flow_name || `助手 ${flowId}`;
            description = _workflow?.desc || _workflow?.description || existingChat?.flow_description || '';
        } else {
            // Flow API返回的是description字段
            name = _workflow?.name || existingChat?.flow_name || `工作流 ${flowId}`;
            description = _workflow?.description || existingChat?.flow_description || '';
        }

        const addChatObj = {
            "logo": _workflow?.logo || existingChat?.logo || '',
            "flow_name": name,
            "flow_description": description,
            "flow_id": flowId,
            "chat_id": _chatId,
            "create_time": "-",
            "update_time": Date.now(),
            "flow_type": type,
            "addNew": true
        };
        addChat(addChatObj);
        console.log("新聊天创建完成，chatId:", _chatId, "名称:", addChatObj.flow_name, "类型:", type);

        // 5秒后重置创建状态，允许再次点击
        setTimeout(() => {
            setIsCreatingChat(false);
            console.log("新建会话冷却完成，可以再次创建");
        }, 5000);
    };

    if (!flowId) return <div>请选择会话</div>
    if (loading) return <div className="flex items-center justify-center h-full">加载中...</div>

    return <div className="flex h-full">
        <div className="h-full w-[220px] relative border-r">
            <div className="absolute flex top-0 w-full bs-chat-bg bg-background-main-content z-10 p-2">
                <div
                    onClick={() => !isCreatingChat && handlerSelectFlow()}
                    id="newchat"
                    className={`flex justify-around items-center w-[200px] h-[48px] rounded-lg px-10 py-2 mx-auto text-center text-sm relative z-10 transition-all duration-200 ${
                        isCreatingChat
                            ? 'cursor-not-allowed bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                            : 'cursor-pointer bg-background-main-content hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                    <PlusBoxIcon className={`dark:hidden ${isCreatingChat ? 'opacity-50' : ''}`} />
                    <PlusBoxIconDark className={`hidden dark:block ${isCreatingChat ? 'opacity-50' : ''}`} />
                    {isCreatingChat ? t('chat.creating', '创建中...') : t('chat.newChat')}
                </div>
            </div>
            <div ref={chatsRef} className="scroll h-full overflow-y-scroll no-scrollbar p-2 pt-14">
                {chatList.length === 0 && (
                    <div className="text-center text-gray-500 mt-4">
                        暂无聊天记录
                    </div>
                )}
                {chatList
                    .filter(chat => chat.flow_id === flowId) // 直接使用flowId过滤
                    .map((chat, i) => (
                        <ChatItem
                            _k={i}
                            key={chat.chat_id}
                            chat={chat}
                            chatId={chatId}
                            location={location}
                            handleSelectChat={handleSelectChat}
                            handleDeleteChat={handleDeleteChat}
                        />
                    ))}
                <LoadMore onScrollLoad={onScrollLoad} />
            </div>
        </div>
        {/* 聊天面板 */}
        {!location && <ChatPanne appendHistory data={selectChat} />}
    </div>;
};

/**
 * 聊天列表Hook - 适用于Flow页面
 */
const useChatList = () => {
    const [id, setId] = useState('');
    const [chatList, setChatList] = useState([]);
    const chatsRef = useRef(null);
    const { chatId, messages } = useFlowMessageStore(); // 使用Flow的消息存储
    const pageRef = useRef(0);

    // 带自动刷新的列表获取
    const refreshChatList = async () => {
        console.log("=== refreshChatList调用 ===");
        try {
            // 重置页码并获取第一页数据
            pageRef.current = 0;
            const res = await getChatsApi(0);
            console.log("获取到的聊天列表:", res.length, "条");

            // 直接设置列表，不需要去重（因为是第一页数据）
            setChatList(res);

            return res;
        } catch (error) {
            console.error("会话列表加载失败:", error);
            return [];
        }
    };

    // 滚动加载更多
    const onScrollLoad = async () => {
        pageRef.current++;
        console.log("=== onScrollLoad调用 ===", "页码:", pageRef.current);
        try {
            const res = await getChatsApi(pageRef.current);
            console.log("加载更多数据:", res.length, "条");

            setChatList(prev => {
                // 合并数据时去重
                const allChats = [...prev, ...res];
                const uniqueChats = allChats.filter((chat, index, self) =>
                    index === self.findIndex(c => c.chat_id === chat.chat_id)
                );
                console.log("合并前:", allChats.length, "合并后:", uniqueChats.length);
                return uniqueChats;
            });
        } catch (error) {
            console.error("加载更多失败:", error);
        }
    };

    // 刷新特定聊天的信息
    const refreshSpecificChat = async (targetChatId: string) => {
        try {
            console.log("=== refreshSpecificChat调用 ===", "chatId:", targetChatId);

            // 重新获取聊天列表，找到更新后的聊天信息
            const res = await getChatsApi(0);
            const updatedChat = res.find(chat => chat.chat_id === targetChatId);

            if (updatedChat) {
                console.log("找到更新的聊天信息:", updatedChat.latest_message?.message || updatedChat.earliest_message?.remark);

                // 更新列表中对应的聊天记录
                setChatList(prev => prev.map(chat =>
                    chat.chat_id === targetChatId ? { ...chat, ...updatedChat } : chat
                ));
            } else {
                console.log("未找到对应的聊天记录");
            }
        } catch (error) {
            console.error("刷新特定聊天失败:", error);
        }
    };

    return {
        chatList,
        chatId: id,
        pageRef,
        chatsRef,
        setChatId: setId,
        setChatList, // 暴露setChatList函数
        addChat: (chat) => {
            console.log("=== addChat调用 ===", "chatId:", chat.chat_id, "flowId:", chat.flow_id);
            setId(chat.chat_id);
            setChatList(prev => {
                console.log("addChat前列表长度:", prev.length);
                // 去重：如果已存在相同chat_id，先移除再添加
                const filteredList = prev.filter(existingChat => existingChat.chat_id !== chat.chat_id);
                const newList = [chat, ...filteredList];
                console.log("addChat后列表长度:", newList.length);
                return newList;
            });
            setTimeout(() => {
                chatsRef.current?.scrollTo(0, 1);
            }, 0);
        },
        deleteChat: (id: string) => {
            captureAndAlertRequestErrorHoc(
                deleteChatApi(id).then(() => {
                    setChatList(prev => prev.filter(item => item.chat_id !== id));
                })
            );
        },
        onScrollLoad,
        refreshChatList,
        refreshSpecificChat
    };
};
