import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface RouteOptimization {
    status: Status__1;
    suggestedRoute: string;
    optimizationId: bigint;
    currentDelay: Time;
    currentRoute: string;
    createdAt: Time;
    estimatedSavings: bigint;
    shipmentId: bigint;
    reason: string;
}
export interface Shipment {
    eta: Time;
    weight: bigint;
    status: Status;
    destination: string;
    value: bigint;
    origin: string;
    lastUpdated: Time;
    routeId: bigint;
    currentLocation: string;
    shipmentId: bigint;
    carrier: string;
    riskLevel: RiskLevel;
}
export interface Disruption {
    affectedShipmentIds: Array<bigint>;
    disruptionId: bigint;
    description: string;
    isActive: boolean;
    timestamp: Time;
    disruptionType: DisruptionType;
    severity: Severity;
    estimatedResolutionTime: Time;
    location: string;
}
export interface UserProfile {
    name: string;
    role: string;
    email: string;
    department: string;
}
export enum DisruptionType {
    portCongestion = "portCongestion",
    weatherAdvisory = "weatherAdvisory",
    customsDelay = "customsDelay",
    operationalBottleneck = "operationalBottleneck",
    infrastructureFailure = "infrastructureFailure"
}
export enum RiskLevel {
    low = "low",
    high = "high",
    critical = "critical",
    medium = "medium"
}
export enum Severity {
    red = "red",
    orange = "orange",
    yellow = "yellow"
}
export enum Status {
    atCustoms = "atCustoms",
    delayed = "delayed",
    arrivingSoon = "arrivingSoon",
    inTransit = "inTransit",
    delivered = "delivered"
}
export enum Status__1 {
    pending = "pending",
    applied = "applied",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addDisruption(disruption: Disruption): Promise<bigint>;
    addShipment(shipment: Shipment): Promise<bigint>;
    applyRouteOptimization(id: bigint, approved: boolean): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllDisruptions(activeOnly: boolean): Promise<Array<Disruption>>;
    getAllDisruptionsStatic(): Promise<Array<Disruption>>;
    getAllRouteOptimizationsStatic(): Promise<Array<RouteOptimization>>;
    getAllShipments(statusFilter: Status | null): Promise<Array<Shipment>>;
    getAllShipmentsStatic(): Promise<Array<Shipment>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getKPIMetrics(): Promise<{
        totalActiveShipments: bigint;
        onTimeDeliveryRate: bigint;
        shipmentsAtRiskCount: bigint;
        activeDisruptionsCount: bigint;
    }>;
    getRouteOptimizations(shipmentId: bigint | null): Promise<Array<RouteOptimization>>;
    getShipmentById(id: bigint): Promise<Shipment | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    resolveDisruption(id: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    triggerRouteOptimization(optimization: RouteOptimization): Promise<bigint>;
    updateShipment(id: bigint, newStatus: Status, newRiskLevel: RiskLevel): Promise<void>;
}
