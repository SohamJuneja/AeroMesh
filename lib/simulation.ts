import { Vector3 } from 'three';
import { SDK } from '@somnia-chain/streams';
import { createPublicClient, createWalletClient, http, toHex, type Hex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { defineChain } from 'viem';
import { DRONE_EVENT_SCHEMA, droneEventEncoder } from './schema';

// Somnia Testnet Config
export const somniaTestnet = defineChain({
  id: 50312,
  name: 'Somnia Testnet',
  network: 'somnia-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'STT',
    symbol: 'STT',
  },
  rpcUrls: {
    default: {
      http: ['https://dream-rpc.somnia.network'],
    },
    public: {
      http: ['https://dream-rpc.somnia.network'],
    },
  },
  blockExplorers: {
    default: { name: 'Somnia Explorer', url: 'https://somnia-testnet.socialscan.io' },
  },
  testnet: true,
});

// Types
export interface Drone {
  id: string;
  position: Vector3;
  velocity: Vector3;
  acceleration: Vector3;
}

export interface SimulationState {
  drones: Drone[];
  buildings: Vector3[];
}

// Constants
const DRONE_COUNT = 50;
const WORLD_SIZE = 200;
const MAX_SPEED = 0.8;
const MAX_FORCE = 0.03;
const PERCEPTION_RADIUS = 20;
const SEPARATION_DISTANCE = 8;

// Burner Wallet for Simulation (In a real app, user would connect)
// This is a random private key for demo purposes to allow "Publishing" without user interaction for the simulation loop
const SIMULATION_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

export class SimulationEngine {
  drones: Drone[];
  buildings: Vector3[];
  sdk: SDK;
  schemaId: Hex | null = null;
  account = privateKeyToAccount(SIMULATION_PRIVATE_KEY);

  constructor() {
    this.drones = this.initializeDrones();
    this.buildings = this.initializeBuildings();

    // Initialize SDK
    this.sdk = new SDK({
      public: createPublicClient({
        chain: somniaTestnet,
        transport: http()
      }),
      wallet: createWalletClient({
        account: this.account,
        chain: somniaTestnet,
        transport: http()
      })
    });

    this.initSchema();
  }

  async initSchema() {
    try {
      const computedSchemaId = await this.sdk.streams.computeSchemaId(DRONE_EVENT_SCHEMA);
      if (computedSchemaId instanceof Error) {
        console.error('Failed to compute schema ID:', computedSchemaId);
        this.schemaId = null;
        return;
      }
      // Now TypeScript knows computedSchemaId is `0x${string}`
      this.schemaId = computedSchemaId as `0x${string}`;
      console.log('Schema ID:', this.schemaId);
    } catch (e) {
      console.error('Failed to compute schema ID:', e);
      this.schemaId = null;
    }
  }

  private initializeDrones(): Drone[] {
    const drones: Drone[] = [];
    for (let i = 0; i < DRONE_COUNT; i++) {
      drones.push({
        id: `AGENT-${i.toString().padStart(2, '0')}`,
        position: new Vector3(
          (Math.random() - 0.5) * WORLD_SIZE,
          20 + Math.random() * 20,
          (Math.random() - 0.5) * WORLD_SIZE
        ),
        velocity: new Vector3(
          (Math.random() - 0.5) * MAX_SPEED,
          0,
          (Math.random() - 0.5) * MAX_SPEED
        ),
        acceleration: new Vector3()
      });
    }
    return drones;
  }

  private initializeBuildings(): Vector3[] {
    const buildings: Vector3[] = [];
    for (let i = 0; i < 20; i++) {
      buildings.push(new Vector3(
        (Math.random() - 0.5) * WORLD_SIZE * 0.8,
        0,
        (Math.random() - 0.5) * WORLD_SIZE * 0.8
      ));
    }
    return buildings;
  }

  tick() {
    this.drones.forEach(drone => {
      this.flock(drone);
      this.updatePhysics(drone);
      this.checkBoundaries(drone);
    });

    // Randomly publish events to the blockchain
    if (Math.random() < 0.005 && this.schemaId) { // Lower frequency to avoid spamming too much
      this.publishRandomEvent();
    }
  }

  async publishRandomEvent() {
    if (!this.schemaId) return;

    const randomDrone = this.drones[Math.floor(Math.random() * this.drones.length)];
    const eventTypes = ['COLLISION_AVOIDED', 'PACKAGE_DELIVERED', 'BATTERY_LOW', 'NETWORK_LATENCY', 'BLOCK_SYNC'];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];

    let message = '';
    switch (eventType) {
      case 'COLLISION_AVOIDED': message = `Rerouting to avoid obstacle at ${randomDrone.position.x.toFixed(1)}, ${randomDrone.position.z.toFixed(1)}`; break;
      case 'PACKAGE_DELIVERED': message = `Delivery confirmed at sector ${Math.floor(Math.random() * 10)}`; break;
      case 'BATTERY_LOW': message = `Battery level at ${Math.floor(Math.random() * 20)}%. Returning to base.`; break;
      case 'NETWORK_LATENCY': message = `Latency spike detected: ${Math.floor(Math.random() * 100 + 50)}ms`; break;
      case 'BLOCK_SYNC': message = `Consensus reached on Block #${Math.floor(Math.random() * 1000000)}`; break;
    }

    try {
      const encodedData = droneEventEncoder.encodeData([
        { name: 'eventType', value: eventType, type: 'string' },
        { name: 'message', value: message, type: 'string' },
        { name: 'timestamp', value: BigInt(Date.now()), type: 'uint64' },
        { name: 'droneId', value: randomDrone.id, type: 'string' },
        { name: 'nonce', value: BigInt(Math.floor(Math.random() * 1000000)), type: 'uint256' }
      ]);

      // Publish to Somnia
      // We use a random ID for the stream key for now, or could use the Drone ID
      const streamId = toHex(randomDrone.id, { size: 32 });

      await this.sdk.streams.set([{
        id: streamId,
        schemaId: this.schemaId,
        data: encodedData
      }]);

      console.log(`Published event: ${eventType} for ${randomDrone.id}`);
    } catch (e) {
      console.error('Failed to publish event:', e);
    }
  }

  private flock(drone: Drone) {
    const alignment = new Vector3();
    const cohesion = new Vector3();
    const separation = new Vector3();
    let total = 0;

    this.drones.forEach(other => {
      const d = drone.position.distanceTo(other.position);
      if (other !== drone && d < PERCEPTION_RADIUS) {
        alignment.add(other.velocity);
        cohesion.add(other.position);

        if (d < SEPARATION_DISTANCE) {
          const diff = new Vector3().subVectors(drone.position, other.position);
          diff.divideScalar(d);
          separation.add(diff);
        }
        total++;
      }
    });

    if (total > 0) {
      alignment.divideScalar(total);
      alignment.setLength(MAX_SPEED);
      alignment.sub(drone.velocity);
      alignment.clampLength(0, MAX_FORCE);

      cohesion.divideScalar(total);
      cohesion.sub(drone.position);
      cohesion.setLength(MAX_SPEED);
      cohesion.sub(drone.velocity);
      cohesion.clampLength(0, MAX_FORCE);

      separation.divideScalar(total);
      separation.setLength(MAX_SPEED);
      separation.sub(drone.velocity);
      separation.clampLength(0, MAX_FORCE);
    }

    const avoidance = new Vector3();
    this.buildings.forEach(building => {
      const d = drone.position.distanceTo(building);
      if (d < 25) {
        const diff = new Vector3().subVectors(drone.position, building);
        diff.divideScalar(d);
        avoidance.add(diff);
      }
    });
    if (avoidance.length() > 0) {
      avoidance.setLength(MAX_SPEED);
      avoidance.sub(drone.velocity);
      avoidance.clampLength(0, MAX_FORCE * 2);
    }

    drone.acceleration.add(alignment);
    drone.acceleration.add(cohesion);
    drone.acceleration.add(separation.multiplyScalar(1.5));
    drone.acceleration.add(avoidance.multiplyScalar(2.0));
  }

  private updatePhysics(drone: Drone) {
    drone.position.add(drone.velocity);
    drone.velocity.add(drone.acceleration);
    drone.velocity.clampLength(0, MAX_SPEED);
    drone.acceleration.set(0, 0, 0);
  }

  private checkBoundaries(drone: Drone) {
    const margin = WORLD_SIZE / 2;
    const turnFactor = 0.05;

    if (drone.position.x < -margin) drone.velocity.x += turnFactor;
    if (drone.position.x > margin) drone.velocity.x -= turnFactor;
    if (drone.position.z < -margin) drone.velocity.z += turnFactor;
    if (drone.position.z > margin) drone.velocity.z -= turnFactor;
    if (drone.position.y < 10) drone.velocity.y += turnFactor;
    if (drone.position.y > 60) drone.velocity.y -= turnFactor;
  }
}
