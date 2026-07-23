export type DashboardPage = "scores" | "clubs";

type DashboardTabsProps = {
  activePage: DashboardPage;
  onChange: (page: DashboardPage) => void;
};

const TABS: Array<{ id: DashboardPage; label: string }> = [
  { id: "scores", label: "成绩看板" },
  { id: "clubs", label: "俱乐部看板" },
];

function DashboardTabs({ activePage, onChange }: DashboardTabsProps) {
  return (
    <nav className="tabs" aria-label="看板导航">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`tab${activePage === tab.id ? " active" : ""}`}
          aria-current={activePage === tab.id ? "page" : undefined}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

export default DashboardTabs;
