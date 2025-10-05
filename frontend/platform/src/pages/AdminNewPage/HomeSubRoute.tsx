import { useNavigate } from "react-router-dom";
import { menuGroupsConfig} from "./menuConfig";

interface ImageCardProps {
  src: string;
  alt: string;
  onClick: () => void;
  className?: string;
  containerClassName?: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ src, alt, onClick, className = "", containerClassName = "" }) => {
  return (
    <div 
      className={`  overflow-hidden cursor-pointer ${containerClassName} `}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "auto",
          maxHeight: "100%",
          objectFit: "contain",
          transition: "transform 0.3s, filter 0.3s",
        }}
        className={`hover:brightness-110 transition-all duration-300 ${className}`}
      />
    </div>
  );
};

export default function HomeSubRoute() {
  const navigate = useNavigate();

  const handleItemClick = (menuItem: any) => {
    if (!menuItem) return;
    
    // 直接使用菜单项数据，因为它已经是正确的格式
    const event = new CustomEvent('menuclick', { 
      detail: menuItem,
      bubbles: true 
    });
    document.dispatchEvent(event);
  };

  // 获取指定菜单项
  const namelist = ["AI创作版", "AI原理学习游戏", "AI对话助手", "心理小屋", "AI绘图（基础）"];
  // 按照 namelist 的顺序排序菜单项
  const menuItems = namelist.map(name => 
    menuGroupsConfig[0].items.find(item => item.label === name)
  ).filter(Boolean);

  return (
    <div className="p-6 h-full overflow-y-auto shouyebgimage   justify-center flex ">
      <div className="flex flex-col gap-6 h-[calc(100%-250px)] max-w-[1280px]  ">
        {/* 上半部分 */}
        <div className="flex h-full ">
          {/* 左侧大图 */}
          <ImageCard
            src="/src/assets/home/bodyavata.png"
            alt={  ""}
            onClick={() =>{}}
            containerClassName="flex-1 overflow-hidden flex items-center"
          />

          {/* 右侧两个小图 */}
          <div className="flex flex-col gap-4 w-[50%] h-full">
              <ImageCard
                src="/src/assets/home/aichuagnzuo.png"
                alt={menuItems[0]?.label || ""}
                onClick={() => handleItemClick(menuItems[0])}
                containerClassName="h-[50%]"
              />
              <ImageCard
                src="/src/assets/home/aiyuanli.png"
                alt={menuItems[1]?.label || ""}
                onClick={() => handleItemClick(menuItems[1])}
                containerClassName="h-[50%]"
              />
          </div>
        </div>

        {/* 下半部分 - 三个小图 */}
        <div className="grid grid-cols-3 gap-6">
            <ImageCard
              src="/src/assets/home/aiduihua.png"
              alt={menuItems[2]?.label || ""}
              onClick={() => handleItemClick(menuItems[2])}
              containerClassName="h-[180px]"
            />
            <ImageCard
              src="/src/assets/home/aixinli.png"
              alt={menuItems[3]?.label || ""}
              onClick={() => handleItemClick(menuItems[3])}
              containerClassName="h-[180px]"
            />
            <ImageCard
              src="/src/assets/home/aihuitu.png"
              alt={menuItems[4]?.label || ""}
              onClick={() => handleItemClick(menuItems[4])}
              containerClassName="h-[180px]"
          />
        </div>
      </div>
    </div>
  );
}
