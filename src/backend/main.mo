import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // MODULES

  // Shipments
  module Shipment {
    public type Status = {
      #inTransit;
      #delayed;
      #atCustoms;
      #arrivingSoon;
      #delivered;
    };

    public type RiskLevel = {
      #low;
      #medium;
      #high;
      #critical;
    };

    public type Shipment = {
      shipmentId : Nat;
      routeId : Nat;
      origin : Text;
      destination : Text;
      currentLocation : Text;
      status : Status;
      eta : Time.Time;
      riskLevel : RiskLevel;
      carrier : Text;
      value : Nat;
      weight : Nat;
      lastUpdated : Time.Time;
    };

    public func compare(a : Shipment, b : Shipment) : Order.Order {
      Nat.compare(a.shipmentId, b.shipmentId);
    };
  };

  let shipments = Map.empty<Nat, Shipment.Shipment>();
  var nextShipmentId = 1;

  // Disruptions
  module Disruption {
    public type DisruptionType = {
      #portCongestion;
      #weatherAdvisory;
      #operationalBottleneck;
      #customsDelay;
      #infrastructureFailure;
    };

    public type Severity = {
      #yellow;
      #orange;
      #red;
    };

    public type Disruption = {
      disruptionId : Nat;
      disruptionType : DisruptionType;
      severity : Severity;
      location : Text;
      description : Text;
      timestamp : Time.Time;
      affectedShipmentIds : [Nat];
      isActive : Bool;
      estimatedResolutionTime : Time.Time;
    };

    public func compare(a : Disruption, b : Disruption) : Order.Order {
      Nat.compare(a.disruptionId, b.disruptionId);
    };
  };

  let disruptions = Map.empty<Nat, Disruption.Disruption>();
  var nextDisruptionId = 1;

  // Route Optimizations
  module RouteOptimization {
    public type Status = {
      #pending;
      #applied;
      #rejected;
    };

    public type RouteOptimization = {
      optimizationId : Nat;
      shipmentId : Nat;
      currentRoute : Text;
      suggestedRoute : Text;
      currentDelay : Time.Time;
      estimatedSavings : Nat;
      reason : Text;
      status : Status;
      createdAt : Time.Time;
    };

    public func compare(a : RouteOptimization, b : RouteOptimization) : Order.Order {
      Nat.compare(a.optimizationId, b.optimizationId);
    };
  };

  let routeOptimizations = Map.empty<Nat, RouteOptimization.RouteOptimization>();
  var nextOptimizationId = 1;

  // TYPES
  public type UserProfile = {
    name : Text;
    email : Text;
    role : Text;
    department : Text;
  };

  // ACCESS CONTROL
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // USER PROFILES
  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // FUNCTION TO GET ALL SHIPMENTS (WITH OPTIONAL STATUS FILTER)
  public query ({ caller }) func getAllShipments(statusFilter : ?Shipment.Status) : async [Shipment.Shipment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view shipments");
    };
    shipments.values().toArray().sort().filter(
      func(s) {
        switch (statusFilter) {
          case (null) { true };
          case (?filterStatus) { s.status == filterStatus };
        };
      }
    );
  };

  // GET SINGLE SHIPMENT BY ID
  public query ({ caller }) func getShipmentById(id : Nat) : async ?Shipment.Shipment {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view shipments");
    };
    shipments.get(id);
  };

  // ADD NEW SHIPMENT
  public shared ({ caller }) func addShipment(shipment : Shipment.Shipment) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add shipments");
    };

    let newShipment : Shipment.Shipment = {
      shipment with
      shipmentId = nextShipmentId;
      lastUpdated = Time.now();
    };

    shipments.add(nextShipmentId, newShipment);
    nextShipmentId += 1;
    nextShipmentId - 1;
  };

  // UPDATE SHIPMENT STATUS AND RISK LEVEL
  public shared ({ caller }) func updateShipment(id : Nat, newStatus : Shipment.Status, newRiskLevel : Shipment.RiskLevel) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update shipments");
    };

    switch (shipments.get(id)) {
      case (null) { Runtime.trap("Shipment not found") };
      case (?s) {
        let updatedShipment : Shipment.Shipment = {
          s with
          status = newStatus;
          riskLevel = newRiskLevel;
          lastUpdated = Time.now();
        };
        shipments.add(id, updatedShipment);
      };
    };
  };

  // DISRUPTIONS FUNCTIONS
  public query ({ caller }) func getAllDisruptions(activeOnly : Bool) : async [Disruption.Disruption] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view disruptions");
    };
    disruptions.values().toArray().sort().filter(
      func(d) {
        if (activeOnly) { d.isActive } else { true };
      }
    );
  };

  public shared ({ caller }) func addDisruption(disruption : Disruption.Disruption) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add disruptions");
    };

    let newDisruption : Disruption.Disruption = {
      disruption with
      disruptionId = nextDisruptionId;
      timestamp = Time.now();
    };
    disruptions.add(nextDisruptionId, newDisruption);
    nextDisruptionId += 1;

    nextDisruptionId - 1;
  };

  public shared ({ caller }) func resolveDisruption(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can resolve disruptions");
    };

    switch (disruptions.get(id)) {
      case (null) { Runtime.trap("Disruption not found") };
      case (?d) {
        let updatedDisruption : Disruption.Disruption = {
          d with
          isActive = false;
        };
        disruptions.add(id, updatedDisruption);
      };
    };
  };

  // ROUTE OPTIMIZATIONS FUNCTIONS
  public query ({ caller }) func getRouteOptimizations(shipmentId : ?Nat) : async [RouteOptimization.RouteOptimization] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view route optimizations");
    };
    routeOptimizations.values().toArray().sort().filter(
      func(o) {
        switch (shipmentId) {
          case (null) { true };
          case (?filterId) { o.shipmentId == filterId };
        };
      }
    );
  };

  public shared ({ caller }) func triggerRouteOptimization(optimization : RouteOptimization.RouteOptimization) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can trigger route optimizations");
    };

    let newOptimization : RouteOptimization.RouteOptimization = {
      optimization with
      optimizationId = nextOptimizationId;
      status = #pending;
      createdAt = Time.now();
    };
    routeOptimizations.add(nextOptimizationId, newOptimization);
    nextOptimizationId += 1;
    nextOptimizationId - 1;
  };

  public shared ({ caller }) func applyRouteOptimization(id : Nat, approved : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can apply route optimizations");
    };

    switch (routeOptimizations.get(id)) {
      case (null) { Runtime.trap("Route optimization not found") };
      case (?o) {
        let newStatus = if (approved) { #applied } else { #rejected };
        let updatedOptimization : RouteOptimization.RouteOptimization = {
          o with
          status = newStatus;
        };
        routeOptimizations.add(id, updatedOptimization);
      };
    };
  };

  public query ({ caller }) func getKPIMetrics() : async {
    onTimeDeliveryRate : Nat;
    activeDisruptionsCount : Nat;
    shipmentsAtRiskCount : Nat;
    totalActiveShipments : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view KPI metrics");
    };
    let allShipments = shipments.values().toArray();
    let onTimeDeliveries = allShipments.filter(func(s) { s.status == #delivered and s.riskLevel != #high }).size();
    let totalDeliveries = allShipments.filter(func(s) { s.status == #delivered }).size();
    let onTimeRate = switch (totalDeliveries) {
      case (0) { 0 };
      case (_) { onTimeDeliveries * 100 / totalDeliveries };
    };
    let activeDisruptions = disruptions.values().toArray().filter(func(d) { d.isActive }).size();
    let shipmentsAtRisk = allShipments.filter(func(s) { s.riskLevel == #high or s.riskLevel == #critical }).size();
    let totalActive = allShipments.filter(func(s) { s.status != #delivered }).size();

    {
      onTimeDeliveryRate = onTimeRate;
      activeDisruptionsCount = activeDisruptions;
      shipmentsAtRiskCount = shipmentsAtRisk;
      totalActiveShipments = totalActive;
    };
  };

  // Helper functions to get entities, used for seeding logic - admin only
  public query ({ caller }) func getAllShipmentsStatic() : async [Shipment.Shipment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access static data");
    };
    shipments.values().toArray().sort();
  };

  public query ({ caller }) func getAllDisruptionsStatic() : async [Disruption.Disruption] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access static data");
    };
    disruptions.values().toArray().sort();
  };

  public query ({ caller }) func getAllRouteOptimizationsStatic() : async [RouteOptimization.RouteOptimization] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access static data");
    };
    routeOptimizations.values().toArray().sort();
  };
};
