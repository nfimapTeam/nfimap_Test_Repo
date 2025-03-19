import { Routes, Route } from "react-router-dom";
import Home from "./page/Home";
import MapPage from "./page/MapPage";
import Layout from "./components/Layout";
import DetailPage from "./page/DetailPage/DetailPage";
import NotFound from "./components/NotFound";
import Profile from "./page/Profile";
import Music from "./page/Music";
import { useTranslation } from "react-i18next";

const App = () => {
  const { t } = useTranslation();
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/:id" element={<DetailPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/music" element={<Music />} />
        <Route path="*" element={<NotFound content={t("notFound")} />} />
      </Routes>
    </Layout>
  );
};

export default App;
