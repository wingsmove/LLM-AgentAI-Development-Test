import { request } from "../api";
import AgentResultCard from "../components/ai/AgentResultCard";
import SectionCard from "../components/ui/SectionCard";
import ScoreForm from "../features/scores/ScoreForm";
import ScoreTable from "../features/scores/ScoreTable";
import type { Score, ScoreCreate } from "../features/scores/types";
import useCrudCollection from "../hooks/useCrudCollection";

function ScoresPage() {
  const { items, loading, error, create, remove } = useCrudCollection<
    Score,
    ScoreCreate
  >("/scores");

  async function addScore(score: ScoreCreate) {
    await create(score);
  }

  async function deleteScore(id: number) {
    try {
      await remove(id);
    } catch {
      alert("删除失败，请稍后重试");
    }
  }

  return (
    <>
      <SectionCard title="新增成绩">
        <ScoreForm onSubmit={addScore} />
      </SectionCard>
      <SectionCard title={`历史成绩${loading ? "（加载中…）" : ""}`}>
        {error ? <p className="error-message">{error}</p> : null}
        <ScoreTable scores={items} onDelete={deleteScore} />
      </SectionCard>
      <AgentResultCard
        title="LLM 成绩分析"
        description="点击下方按钮，让 AI 教练根据数据库中已有的成绩，生成表现评价与训练建议。"
        actionLabel="开始分析"
        pendingLabel="分析中，请稍候…"
        errorPrefix="分析失败"
        onRun={async () => {
          const result = await request<{ report?: string }>("/analyze", {
            method: "POST",
          });
          return result.report ?? "";
        }}
      />
    </>
  );
}

export default ScoresPage;
