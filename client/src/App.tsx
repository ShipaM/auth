import { Layout } from "antd";
import "./styles/reset.css";
import Header from "./Components/UI/Header/Header";
import Content from "./Components/UI/Content/Content";
import Footer from "./Components/UI/Footer/Footer";
import AppLoader from "./hok/AppLoader";

const layoutStyle = {
  width: "100%",
  height: "100vh",
} as const;

function App() {
  return (
    <Layout style={layoutStyle}>
      <AppLoader>
        <Header />
        <Content />
        <Footer />
      </AppLoader>
    </Layout>
  );
}

export default App;
