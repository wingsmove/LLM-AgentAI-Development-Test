import { request } from "../api";
import AgentResultCard from "../components/ai/AgentResultCard";
import SectionCard from "../components/ui/SectionCard";
import ClubForm from "../features/clubs/ClubForm";
import ClubTable from "../features/clubs/ClubTable";
import type { Club, ClubCreate } from "../features/clubs/types";
import useCrudCollection from "../hooks/useCrudCollection";

function ClubsPage() {
  const { items, loading, error, create, remove } = useCrudCollection<
    Club,
    ClubCreate
  >("/clubs");

  async function addClub(club: ClubCreate) {
    await create(club);
  }

  async function deleteClub(id: number) {
    try {
      await remove(id);
    } catch {
      alert("删除失败，请稍后重试");
    }
  }

  return (
    <>
      <SectionCard title="新增俱乐部">
        <ClubForm onSubmit={addClub} />
      </SectionCard>
      <SectionCard title={`俱乐部列表${loading ? "（加载中…）" : ""}`}>
        {error ? <p className="error-message">{error}</p> : null}
        <ClubTable clubs={items} onDelete={deleteClub} />
      </SectionCard>
      <AgentResultCard
        title="LLM 比赛规划"
        description="根据上面的俱乐部，实时抓取即将进行的比赛，让 AI 教练生成参赛规划（较慢，请耐心等待）。"
        actionLabel="开始规划"
        pendingLabel="规划中，请稍候…"
        errorPrefix="规划失败"
        onRun={async () => {
          const result = await request<{ plan?: string }>("/plan", {
            method: "POST",
          });
          return result.plan ?? "";
        }}
      />
    </>
  );
}

export default ClubsPage;
