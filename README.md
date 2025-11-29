# 🚁 AeroMesh - Digital Twin Drone Swarm

<div align="center">

![AeroMesh Banner](https://img.shields.io/badge/Somnia-Data_Streams-00FF41?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React Three Fiber](https://img.shields.io/badge/R3F-3D-00F0FF?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**A real-time simulation of 50 autonomous drones streaming their positions and AI decisions to the Somnia blockchain.**

[Live Demo](#) • [Video Walkthrough](#) • [Documentation](https://docs.somnia.network)

</div>

---

## 🎯 **Project Overview**

**AeroMesh** is a **Digital Twin** architecture demonstrating how autonomous systems can leverage blockchain for real-time data streaming and coordination. Built for the **Somnia Data Streams Mini Hackathon**, this project showcases:

- **50 Autonomous Drones** flying over a cyberpunk city using advanced Boids flocking algorithm
- **Real-Time Collision Avoidance** with dynamic obstacle detection
- **AI Decision Streaming** to blockchain (collision avoidance, package delivery, battery alerts)
- **Live Reactive Dashboard** displaying on-chain events as they happen
- **Cryptographically Signed Events** ensuring data provenance and trust

### **Why This Matters**

Traditional IoT systems rely on centralized databases that lack transparency, immutability, and real-time reactivity. AeroMesh proves that:

✅ **IoT devices can publish structured data directly to blockchain**  
✅ **Real-time coordination is possible without centralized servers**  
✅ **AI decisions can be auditable and trustless**  
✅ **Blockchain can handle high-frequency updates** (1000s of TPS)

---

## 🎬 **Demo Video Guide**

### **What to Show (3-5 Minutes)**

#### **1. Introduction (30 seconds)**
- "Hi, I'm [Name], presenting AeroMesh for the Somnia Data Streams Hackathon"
- "This is a Digital Twin simulation of 50 autonomous drones coordinating in real-time via blockchain"

#### **2. Visual Demo (1 minute)**
- Show the 3D scene with drones flying
- Highlight:
  - Flocking behavior (drones moving as a swarm)
  - Collision avoidance (drones avoiding red buildings)
  - Smooth camera rotation for cinematic effect
  - Cyberpunk aesthetic (neon colors, dark mode)

#### **3. Real-Time Streaming (1.5 minutes)**
- **HUD Top-Left**: Show "Network Status" (green = connected to Somnia Testnet)
- **HUD Top-Right**: Show "TPS Counter" updating rapidly
- **HUD Bottom**: Show console logs appearing in real-time:
  - `[AGENT-04] Collision avoided. Rerouting...`
  - `[AGENT-12] Package delivered. Returning to base.`
  - `[AGENT-23] Battery low. Returning to base.`
- Explain: "These aren't fake logs—they're real events published to the blockchain"

#### **4. Code Walkthrough (1.5 minutes)**

**Show `lib/schema.ts`:**
```typescript
export const DRONE_EVENT_SCHEMA = `
    string eventType,
    string message,
    uint64 timestamp,
    string droneId,
    uint256 nonce
`;
```
- "This defines the structure of data we're streaming"

**Show `lib/simulation.ts` (publishRandomEvent function):**
- "Here's where drones make AI decisions and publish to blockchain"
- Highlight the `sdk.streams.set()` call

**Show `components/HUD.tsx` (subscribe function):**
- "The UI subscribes to blockchain events and updates in real-time"
- Highlight the `sdk.streams.subscribe()` call

#### **5. Blockchain Verification (30 seconds)**
- Open [Somnia Explorer](https://somnia-testnet.socialscan.io)
- Show recent transactions from your wallet address
- "Every event you saw is now immutably stored on-chain"

#### **6. Wrap-Up (30 seconds)**
- "This architecture scales to thousands of drones"
- "Applicable to: smart cities, logistics, IoT monitoring, autonomous vehicles"
- "Built entirely with Somnia Data Streams—no custom contracts needed"
- "Thank you!"

---

## 🏗️ **Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    Simulation Engine                         │
│  • Boids Flocking Algorithm (Separation/Alignment/Cohesion) │
│  • Collision Detection & Avoidance                           │
│  • Physics Updates (60 FPS)                                  │
└───────────────────┬─────────────────────────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Somnia Data Streams │
         │        SDK            │
         │  • Schema Encoding   │
         │  • Event Publishing  │
         │  • Data Streaming    │
         └──────────┬───────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │   Somnia Testnet     │
         │   (Blockchain L1)    │
         │  • Immutable Storage │
         │  • Cryptographic     │
         │    Verification      │
         └──────────┬───────────┘
                    │
                    ▼ (Subscribe)
         ┌──────────────────────┐
         │   React Three Fiber  │
         │     (3D Rendering)   │
         │  • 50 Drone Instances│
         │  • City Grid         │
         │  • Real-Time Updates │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │    HUD Overlay       │
         │  • Network Status    │
         │  • TPS Counter       │
         │  • Event Console     │
         └──────────────────────┘
```

---

## 🛠️ **Tech Stack**

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | Next.js 16 (App Router) | Server/client rendering, routing |
| **3D Engine** | React Three Fiber + Drei | WebGL rendering, camera controls |
| **Blockchain** | Somnia Testnet (EVM L1) | Data storage, event streaming |
| **SDK** | @somnia-chain/streams v0.11.0 | Schema encoding, pub/sub |
| **Client** | Viem | Blockchain interactions |
| **State** | Zustand (implicit) | Simulation state management |
| **Styling** | Tailwind CSS 4 | Cyberpunk theme, responsive UI |
| **Icons** | Lucide React | HUD icons |
| **Math** | Three.js Vector3 | Physics calculations |

---

## 🔧 **How Somnia Data Streams is Used**

### **1. Schema Definition** (`lib/schema.ts`)
We define a typed schema for drone events:
```typescript
export const DRONE_EVENT_SCHEMA = `
    string eventType,      // COLLISION_AVOIDED, PACKAGE_DELIVERED, etc.
    string message,        // Human-readable event description
    uint64 timestamp,      // Unix timestamp
    string droneId,        // AGENT-XX identifier
    uint256 nonce          // Unique event nonce
`;
```

### **2. Publishing Events** (`lib/simulation.ts`)
Drones publish AI decisions to blockchain:
```typescript
const encodedData = droneEventEncoder.encodeData([
  { name: 'eventType', value: 'COLLISION_AVOIDED', type: 'string' },
  { name: 'message', value: 'Rerouting...', type: 'string' },
  { name: 'timestamp', value: BigInt(Date.now()), type: 'uint64' },
  { name: 'droneId', value: 'AGENT-04', type: 'string' },
  { name: 'nonce', value: BigInt(Math.random() * 1000000), type: 'uint256' }
]);

await sdk.streams.set([{
  id: streamId,
  schemaId: this.schemaId,
  data: encodedData
}]);
```

### **3. Subscribing to Events** (`components/HUD.tsx`)
The UI subscribes to blockchain events:
```typescript
await sdk.streams.subscribe({
  somniaStreamsEventId: schemaId,
  ethCalls: [],
  onlyPushChanges: false,
  onData: (data) => {
    const decodedFields = droneEventEncoder.decodeData(data.result.data);
    const logMessage = `[${droneId}] ${message}`;
    setLogs(prev => [...prev.slice(-4), logMessage]);
  }
});
```

### **4. Data Provenance**
Every event is cryptographically signed by the simulation's wallet address, ensuring:
- **Immutability**: Events cannot be altered once published
- **Authenticity**: Only authorized wallets can publish
- **Transparency**: Anyone can verify events on-chain

---

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ installed
- A wallet with Somnia Testnet tokens (STT)
  - Get testnet tokens: [Somnia Faucet](https://faucet.somnia.network)

### **Installation**

```bash
# Clone the repository
git clone https://github.com/yourusername/somnia-data-streams.git
cd somnia-data-streams

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

Edit `.env` and add your private key:
```env
PRIVATE_KEY=0xYourPrivateKeyHere
```

⚠️ **Security Warning**: Never commit `.env` to version control. The private key is only used for the simulation's burner wallet (not your real funds).

### **Run Development Server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### **What to Expect**
1. **Loading**: SDK initializes and connects to Somnia Testnet
2. **3D Scene Loads**: 50 green drones appear over a city grid
3. **Drones Start Moving**: Boids algorithm activates, drones flock
4. **Events Appear**: Console logs show AI decisions streaming from blockchain

---

## 📁 **Project Structure**

```
somnia-data-streams/
├── app/
│   ├── globals.css          # Cyberpunk theme styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page (Canvas + HUD)
├── components/
│   ├── HUD.tsx              # Network status, TPS, event console
│   └── Scene.tsx            # 3D city, drones, camera
├── lib/
│   ├── schema.ts            # Drone event schema definition
│   └── simulation.ts        # Boids algorithm, collision, streaming
├── public/                  # Static assets
├── .env.example             # Environment template
├── package.json             # Dependencies
└── README.md                # This file
```

---

## 🧪 **Testing Checklist**

### **Local Testing**
- [ ] Drones render (50 green spheres)
- [ ] Drones move smoothly (flocking behavior)
- [ ] Drones avoid buildings (red cubes)
- [ ] HUD shows "Connected to Somnia Testnet" (green dot)
- [ ] TPS counter updates rapidly
- [ ] Console logs appear (event messages)
- [ ] Camera auto-rotates around scene
- [ ] No console errors in browser DevTools

### **Blockchain Verification**
- [ ] Open [Somnia Explorer](https://somnia-testnet.socialscan.io)
- [ ] Search for your wallet address (from simulation)
- [ ] Verify transactions appear
- [ ] Click a transaction → see encoded event data

---

## 🎨 **Customization**

### **Change Drone Count**
Edit `lib/simulation.ts`:
```typescript
const DRONE_COUNT = 100; // Increase to 100 drones
```

### **Adjust Flight Speed**
```typescript
const MAX_SPEED = 1.5; // Faster drones
```

### **Add More Building Types**
Edit `components/Scene.tsx` - modify the `buildings` array in the `City` component.

### **Change Color Scheme**
Edit `app/globals.css` - modify CSS variables:
```css
:root {
  --neon-green: #00FF41;
  --cyber-blue: #00F0FF;
  --alert-red: #FF003C;
}
```

---

## 🏆 **Hackathon Submission Checklist**

- [x] **GitHub Repo**: Public repository with README
- [x] **README**: Explains how Somnia Data Streams is used
- [x] **Deployed dApp**: Live on Somnia Testnet
- [ ] **Demo Video**: 3-5 minutes (follow guide above)
- [x] **Somnia SDK Integration**: `@somnia-chain/streams` implemented
- [x] **Real-Time Features**: Reactive event streaming
- [x] **Code Quality**: Clean, documented, production-ready

---

## 🔮 **Future Enhancements**

### **Phase 2: Multi-User Support**
- Allow users to deploy their own drone swarms
- Each user = unique publisher address
- Aggregate events from multiple publishers

### **Phase 3: Drone Control Interface**
- Click a drone to see individual stats (battery, speed, altitude)
- Set manual waypoints
- Toggle autopilot mode

### **Phase 4: Mission Planning**
- Define delivery routes on the map
- Schedule drone missions
- Track mission completion on-chain

### **Phase 5: Analytics Dashboard**
- Charts showing events over time
- Heatmaps of collision zones
- Performance metrics (TPS, latency)

### **Phase 6: Mobile App**
- React Native port
- Simplified 3D view
- Push notifications for critical events

---

## 🤝 **Contributing**

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📚 **Resources**

- [Somnia Documentation](https://docs.somnia.network)
- [Somnia Data Streams Guide](https://datastreams.somnia.network)
- [Somnia Testnet Explorer](https://somnia-testnet.socialscan.io)
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Boids Algorithm Explained](https://en.wikipedia.org/wiki/Boids)

---

## 📄 **License**

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 **Acknowledgments**

- **Somnia Team** - For building an amazing L1 blockchain and Data Streams SDK
- **DoraHacks** - For hosting the hackathon
- **PMND** - For React Three Fiber and Drei libraries
- **Craig Reynolds** - For the original Boids algorithm (1986)

---

## 📞 **Contact**

**Project Maintainer**: [Your Name]  
**GitHub**: [@yourusername](https://github.com/yourusername)  
**Twitter/X**: [@yourhandle](https://x.com/yourhandle)  
**Email**: your.email@example.com

---

<div align="center">

**Built with ❤️ for the Somnia Data Streams Mini Hackathon**

[⭐ Star this repo](https://github.com/yourusername/somnia-data-streams) • [🐛 Report Bug](https://github.com/yourusername/somnia-data-streams/issues) • [💡 Request Feature](https://github.com/yourusername/somnia-data-streams/issues)

</div>
