import { useCallback, useEffect, useState } from "react";
import { postJson, request } from "../api";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function useCrudCollection<TItem, TCreate>(resource: string) {
  const [items, setItems] = useState<TItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      setItems(await request<TItem[]>(resource));
    } catch (loadError) {
      setError(`加载失败：${getErrorMessage(loadError)}`);
    } finally {
      setLoading(false);
    }
  }, [resource]);

  useEffect(() => {
    void load();
  }, [load]);

  const create = useCallback(
    async (payload: TCreate) => {
      await postJson<TItem, TCreate>(resource, payload);
      await load();
    },
    [load, resource],
  );

  const remove = useCallback(
    async (id: number) => {
      await request<void>(`${resource}/${id}`, { method: "DELETE" });
      await load();
    },
    [load, resource],
  );

  return {
    items,
    loading,
    error,
    reload: load,
    create,
    remove,
  };
}

export default useCrudCollection;
