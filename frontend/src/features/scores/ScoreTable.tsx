import DataTable, {
  type TableColumn,
} from "../../components/ui/DataTable";
import type { Score } from "./types";

type ScoreTableProps = {
  scores: Score[];
  onDelete: (id: number) => Promise<void>;
};

function ScoreTable({ scores, onDelete }: ScoreTableProps) {
  const columns: TableColumn<Score>[] = [
    {
      key: "createdAt",
      header: "提交时间",
      render: (score) => new Date(score.created_at).toLocaleString(),
    },
    { key: "percent", header: "%", render: (score) => score.percent },
    { key: "division", header: "Div", render: (score) => score.division },
    {
      key: "class",
      header: "Class",
      render: (score) => score.shooter_class,
    },
    { key: "pf", header: "PF", render: (score) => score.power_factor },
    { key: "a", header: "A", render: (score) => score.hits_a },
    { key: "c", header: "C", render: (score) => score.hits_c },
    { key: "d", header: "D", render: (score) => score.hits_d },
    { key: "m", header: "M", render: (score) => score.misses_m },
    {
      key: "npm",
      header: "NPM",
      render: (score) => score.nopenaltymisses_npm,
    },
    { key: "ns", header: "NS", render: (score) => score.no_shoots },
    {
      key: "procedurals",
      header: "Proc",
      render: (score) => score.procedurals,
    },
    {
      key: "additionalPenalties",
      header: "APen",
      render: (score) => score.additional_penalties_apen,
    },
    {
      key: "actions",
      header: "",
      render: (score) => (
        <button
          type="button"
          onClick={() => void onDelete(score.id)}
          className="delete-button"
        >
          删除
        </button>
      ),
    },
  ];

  return (
    <DataTable
      items={scores}
      columns={columns}
      getRowKey={(score) => score.id}
      emptyMessage="暂无成绩，先在上方新增一条吧。"
    />
  );
}

export default ScoreTable;
