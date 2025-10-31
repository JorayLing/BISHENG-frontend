import aiAvatar from "@/pages/NewChatPage/images/aiAvatar.png";
import checkIcon from "@/pages/NewChatPage/images/check.png";
import MusicIcon from "@/pages/NewChatPage/images/music-icon.png";
import MusicPlay from "@/pages/NewChatPage/images/music-play.png";
import MusicPause from "@/pages/NewChatPage/images/music-pause.png";
import React, { useEffect, useRef, useState } from "react";
import "../style/ChatMusic.css";

interface ChatMusicProps {
  logo?: string;
  data: string; // 接口返回的原始文本
}

const ChatMusic: React.FC<ChatMusicProps> = ({ logo, data }) => {
  // hack
  if (typeof data.files === "string") return null;
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(120); // 初始设为 2 分 10 秒
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 解析数据
  const { title, lyrics, audioUrl } = parseMusicData(data?.message.msg);

  // 模拟音频时长（实际应通过 audio.duration 获取）
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onloadedmetadata = () => {
        setDuration(audioRef.current.duration || 120);
      };
    }
  }, []);

  // 播放控制
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((err) => console.warn("播放失败:", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  // 进度条拖动
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setCurrentTime(value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
    }
  };

  // 时间格式化
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // 实际播放进度更新（监听 audio 的 timeupdate）
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener("timeupdate", updateTime);
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
    };
  }, []);

  // 自动暂停当播放结束
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  // 动态计算当前显示的歌词行（简化版：按时间分段）
  const getCurrentLyricIndex = () => {
    // 假设每句歌词持续约 2 秒
    const avgDurationPerLine = 2;
    return Math.min(
      Math.floor(currentTime / avgDurationPerLine),
      lyrics.length - 1,
    );
  };

  const [selected, setSelected] = useState(data.message.hisValue || "");
  const handleSelect = (obj) => {
    if (selected) return;
    const myEvent = new CustomEvent("outputMsgEvent", {
      detail: {
        nodeId: data.message.node_id,
        message: data,
        data: {
          [data.message.key]: obj.id,
        },
      },
    });
    document.dispatchEvent(myEvent);
    setSelected(obj.id);
  };

  return (
    <div>
      <div className="w-fit group max-w-[90%] flex">
        {/*{logo ? (*/}
        {/*  <div className="w-[40px] h-[40px] rounded-full overflow-hidden">*/}
        {/*    <img className="w-[40px] h-[40px]" src={logo} alt="" />*/}
        {/*  </div>*/}
        {/*) : (*/}
        {/*  <div className="w-[40px] h-[40px] flex justify-center items-center rounded-full">*/}
        {/*    <img className="w-full h-full" src={aiAvatar} alt="" />*/}
        {/*  </div>*/}
        {/*)}*/}
        <div className="w-[40px] h-[40px] flex justify-center items-center rounded-full">
          <img className="w-full h-full" src={aiAvatar} alt="" />
        </div>
        <div className="chat-music-container">
          {/* 头部区域 */}
          <div className="music-header">
            <div className="avatar">
              <img src={MusicIcon} alt="Album" />
            </div>
            <div className="music-info">
              <h3>{title}</h3>
            </div>
            <button 
              className="play-button" 
              onClick={handlePlayPause}
              style={{
                backgroundImage: `url(${isPlaying ? MusicPause : MusicPlay})`
              }}
            ></button>
          </div>

          {/* 进度条 */}
          <div className="progress-bar">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="progress-slider"
              style={
                {
                  "--seek-before-width": `${(currentTime / duration) * 100}%`,
                } as React.CSSProperties
              }
            />
            <span className="current-time">{formatTime(currentTime)}</span>
          </div>

          {/* 歌词区域 */}
          <div className="lyrics-container">
            {lyrics.map((line, index) => (
              <div
                key={index}
                className={`lyric-line ${index === getCurrentLyricIndex() ? "highlight" : ""}`}
              >
                {line}
              </div>
            ))}
          </div>

          {/* 隐藏音频元素 */}
          <audio ref={audioRef} src={audioUrl} preload="metadata" />
        </div>
      </div>
      <div className="flex w-full mb-3">
        <div className="w-fit group max-w-[90%]">
          <div className="min-h-8">
            <div className="flex gap-2">
              {/*{logo ? (*/}
              {/*  <div className="w-[40px] h-[40px] rounded-full overflow-hidden">*/}
              {/*    <img className="w-[40px] h-[40px]" src={logo} alt="" />*/}
              {/*  </div>*/}
              {/*) : (*/}
              {/*  <div className="w-[40px] h-[40px] flex justify-center items-center rounded-full">*/}
              {/*    <img className="w-full h-full" src={aiAvatar} alt="" />*/}
              {/*    /!*<AvatarIcon />*!/*/}
              {/*  </div>*/}
              {/*)}*/}
              <div className="w-[40px] h-[40px] flex justify-center items-center rounded-full">
                <img className="w-full h-full" src={aiAvatar} alt="" />
                {/*<AvatarIcon />*/}
              </div>
              <div className="text-sm max-w-[calc(100%-64px)] chat-ai-msg">
                {/* select or input */}
                <div className="mt-2">
                  <div className={"flex flex-col"}>
                    {data.message.options.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={() => handleSelect(opt)}
                        className={`chat-select ${selected === opt.id ? "chat-select-check" : ""}`}
                      >
                        {opt.label}
                        {selected === opt.id && (
                          <img src={checkIcon} alt="" />
                          // <CheckCircle size={20} className="min-w-5" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const parseMusicData = (rawText: string) => {
  const lines = rawText.split("\n");
  let title = "这里是生成的歌曲";
  let lyrics: string[] = [];
  let audioUrl = "";

  // 提取所有 HTTP/HTTPS 链接（用于备用）
  const urlRegex = /https?:\/\/[^\s]+/g;
  const urls = rawText.match(urlRegex) || [];

  // 尝试找到第一个有效的音频 URL（优先级：带 .wav 或 .mp3 的）
  for (let url of urls) {
    if (url.includes(".wav") || url.includes(".mp3")) {
      audioUrl = decodeURIComponent(url);
      break;
    }
  }

  // 如果没有找到，尝试从 [点击播放音频] 中提取
  if (!audioUrl) {
    for (let line of lines) {
      if (line.includes("[点击播放音频]")) {
        const match = line.match(/\(([^)]+)\)/);
        if (match) {
          audioUrl = decodeURIComponent(match[1]);
          break;
        }
      }
    }
  }

  // 解析标题和歌词：从 "歌词：" 开始，到 "这里试听：" 结束
  let inLyrics = false;
  let lyricLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.includes("这是生成的音乐")) {
      title = line;
    } else if (line.includes("歌词：")) {
      inLyrics = true;
      // 跳过 "歌词：" 这一行
    } else if (inLyrics && line.includes("这里试听：")) {
      break; // 遇到 "这里试听：" 就停止收集
    } else if (inLyrics && line !== "") {
      lyricLines.push(line);
    }
  }

  lyrics = lyricLines;

  return { title, lyrics, audioUrl };
};

export default ChatMusic;
