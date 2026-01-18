import { Routes, Route } from "react-router-dom";
import Home from "./page/Home/Home";
import MapPage from "./page/MapPage";
import Layout from "./layout/Layout";
import DetailPage from "./page/DetailPage/DetailPage";
import NotFound from "./components/NotFound";
import Profile from "./page/Profile/Profile";
import Music from "./page/Content/Components/Music";
import { useTranslation } from "react-i18next";
import Content from "./page/Content/Content";
import Maintenance from "./components/Maintenance";

const App = () => {
  const { t } = useTranslation();
  // if (true) {
  //   return (
  //     <Layout>
  //       <Routes>
  //         <Route path="*" element={<Maintenance />} />
  //       </Routes>
  //     </Layout>
  //   );
  // }
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/:id" element={<DetailPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/content" element={<Content />} />
        <Route path="*" element={<NotFound content={t("notFound")} />} />
      </Routes>
    </Layout>
  );
};

export default App;
