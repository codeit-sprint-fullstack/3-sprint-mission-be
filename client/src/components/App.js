import { TopNav } from "./TopNav";
import { Footer } from "./Footer";
import "./App.css";

function App({ children }) {
  return (
    <div className="app">
      <TopNav />
      <div>{children}</div>
      <Footer />
    </div>
  );
}

export default App;
