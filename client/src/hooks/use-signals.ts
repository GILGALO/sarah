import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type Signal, type InsertSignal, type GenerateSignalRequest } from "@shared/schema";

export function useSignals() {
  return useQuery({
    queryKey: [api.signals.list.path],
    queryFn: async () => {
      const res = await fetch(api.signals.list.path);
      if (!res.ok) throw new Error("Failed to fetch signals");
      return api.signals.list.responses[200].parse(await res.json());
    },
  });
}

export function useLatestSignal() {
  return useQuery({
    queryKey: [api.signals.latest.path],
    queryFn: async () => {
      const res = await fetch(api.signals.latest.path);
      if (!res.ok) throw new Error("Failed to fetch latest signal");
      const data = await res.json();
      return api.signals.latest.responses[200].parse(data);
    },
    refetchInterval: 5000, // Poll every 5 seconds for new signals
  });
}

export function useGenerateSignal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: GenerateSignalRequest) => {
      const res = await fetch(api.signals.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to generate signal");
      }
      
      return api.signals.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.signals.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.signals.latest.path] });
    },
  });
}

export function useClearSignals() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.signals.list.path, {
        method: "DELETE",
      });
      
      if (!res.ok) {
        throw new Error("Failed to clear signals");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.signals.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.signals.latest.path] });
    },
  });
}

export function useMarketData(pair: string) {
  return useQuery({
    queryKey: [api.market.data.path, pair],
    queryFn: async () => {
      const path = api.market.data.path.replace(":pair", pair);
      const res = await fetch(path);
      if (!res.ok) throw new Error("Failed to fetch market data");
      return api.market.data.responses[200].parse(await res.json());
    },
    refetchInterval: 10000, // Refresh chart data every 10s
  });
}
