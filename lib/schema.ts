import { SchemaEncoder } from '@somnia-chain/streams';

// Define the schema string
// We want to track events like collisions or status updates
export const DRONE_EVENT_SCHEMA = 'string eventType, string message, uint64 timestamp, string droneId, uint256 nonce';

// Create the encoder instance
export const droneEventEncoder = new SchemaEncoder(DRONE_EVENT_SCHEMA);

export interface DroneEventData {
    eventType: string;
    message: string;
    timestamp: bigint;
    droneId: string;
    nonce: bigint;
}
