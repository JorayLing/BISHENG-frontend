import ReactDOM from "react-dom/client";
import App from "./App";
import ContextWrapper from "./contexts";
import "./i18n";
import reportWebVitals from "./reportWebVitals";
// @ts-ignore
import "./style/index.css";
// @ts-ignore
import "./style/applies.css";
// @ts-ignore
import "./style/classes.css";
// @ts-ignore
import { QueryClient, QueryClientProvider } from "react-query";
import "./style/markdown.css";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 0,
    },
  },
});
root.render(
  <QueryClientProvider client={queryClient}>
    <ContextWrapper>
      <App />
    </ContextWrapper>
  </QueryClientProvider>,
);
reportWebVitals();
