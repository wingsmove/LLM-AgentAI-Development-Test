import { useState } from "react";
import "./App.css";
import DashboardTabs, {
  type DashboardPage,
} from "./components/layout/DashboardTabs";
import ClubsPage from "./pages/ClubsPage";
import ScoresPage from "./pages/ScoresPage";

function App() {
  const [page, setPage] = useState<DashboardPage>("scores");

  return (
    <div className="container">
      <h1>USPSA 成绩看板</h1>
      <DashboardTabs activePage={page} onChange={setPage} />
      {page === "scores" ? <ScoresPage /> : <ClubsPage />}
    </div>
  );
}

export default App;
