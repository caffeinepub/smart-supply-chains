import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  type Disruption,
  RiskLevel,
  type RouteOptimization,
  type Shipment,
  Status,
  Status__1,
} from "../backend";
import { useActor } from "./useActor";

export { Status, RiskLevel, Status__1 };
export type { Shipment, Disruption, RouteOptimization };

export function useShipments() {
  const { actor, isFetching } = useActor();
  return useQuery<Shipment[]>({
    queryKey: ["shipments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllShipmentsStatic();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDisruptions() {
  const { actor, isFetching } = useActor();
  return useQuery<Disruption[]>({
    queryKey: ["disruptions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDisruptionsStatic();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRouteOptimizations() {
  const { actor, isFetching } = useActor();
  return useQuery<RouteOptimization[]>({
    queryKey: ["optimizations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRouteOptimizationsStatic();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useKPIMetrics() {
  const { actor, isFetching } = useActor();
  return useQuery<{
    totalActiveShipments: bigint;
    onTimeDeliveryRate: bigint;
    shipmentsAtRiskCount: bigint;
    activeDisruptionsCount: bigint;
  }>({
    queryKey: ["kpi"],
    queryFn: async () => {
      if (!actor)
        return {
          totalActiveShipments: 0n,
          onTimeDeliveryRate: 0n,
          shipmentsAtRiskCount: 0n,
          activeDisruptionsCount: 0n,
        };
      return actor.getKPIMetrics();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTriggerOptimization() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (shipment: Shipment) => {
      if (!actor) throw new Error("No actor");
      const optimization: RouteOptimization = {
        optimizationId: 0n,
        shipmentId: shipment.shipmentId,
        currentRoute: `${shipment.origin} → ${shipment.destination}`,
        suggestedRoute: `${shipment.origin} → Alt Hub → ${shipment.destination}`,
        reason: "AI-driven route optimization triggered",
        estimatedSavings: 15000n,
        currentDelay: 7200000000000n,
        status: Status__1.pending,
        createdAt: BigInt(Date.now()) * 1_000_000n,
      };
      return actor.triggerRouteOptimization(optimization);
    },
    onSuccess: () => {
      toast.success("Route optimization triggered successfully", {
        description: "AI is calculating the optimal route adjustment.",
      });
      qc.invalidateQueries({ queryKey: ["optimizations"] });
    },
    onError: () => {
      toast.error("Failed to trigger optimization");
    },
  });
}

export function useResolveDisruption() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.resolveDisruption(id);
    },
    onSuccess: () => {
      toast.success("Disruption resolved");
      qc.invalidateQueries({ queryKey: ["disruptions"] });
    },
    onError: () => {
      toast.error("Failed to resolve disruption");
    },
  });
}

export function useApplyOptimization() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, approved }: { id: bigint; approved: boolean }) => {
      if (!actor) throw new Error("No actor");
      return actor.applyRouteOptimization(id, approved);
    },
    onSuccess: (_data, variables) => {
      toast.success(
        variables.approved
          ? "Route optimization applied"
          : "Route optimization rejected",
      );
      qc.invalidateQueries({ queryKey: ["optimizations"] });
    },
    onError: () => {
      toast.error("Failed to apply optimization");
    },
  });
}
