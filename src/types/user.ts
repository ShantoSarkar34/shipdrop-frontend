export type Role = "CUSTOMER" | "DELIVERY_AGENT" | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED";
export type AgentAvailability = "AVAILABLE" | "OFFLINE" | "ON_DELIVERY";

export interface CustomerProfile {
  defaultPickupAddress: string | null;
}

export interface DeliveryAgentProfile {
  vehicleType: string | null;
  licenseNumber: string | null;
  availability: AgentAvailability;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  provider: string;
  status: UserStatus;
  createdAt: string;
  customer: CustomerProfile | null;
  deliveryAgent: DeliveryAgentProfile | null;
}
