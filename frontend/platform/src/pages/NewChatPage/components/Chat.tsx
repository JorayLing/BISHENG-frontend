import { useState } from "react";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";

export default function Chat({
  stop = false,
  debug,
  autoRun,
  logo = "",
  clear = false,
  form = false,
  useName,
  inputForm = null,
  guideWord,
  wsUrl,
  onBeforSend,
  loadMore = () => {},
}) {
  const [loading, setLoading] = useState(autoRun);

  return (
    <div className="chat">
      <ChatMessages
        debug={debug}
        logo={logo}
        useName={useName}
        guideWord={guideWord}
        loadMore={loadMore}
      ></ChatMessages>
      <ChatInput
        autoRun={autoRun}
        clear={clear}
        form={form}
        wsUrl={wsUrl}
        inputForm={inputForm}
        onBeforSend={onBeforSend}
        onLoad={() => setLoading(false)}
      ></ChatInput>
    </div>
  );
}
