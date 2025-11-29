# 🎬 Demo Video Script for AeroMesh

## 📹 Recording Setup
- **Screen Recorder**: OBS Studio, Loom, or QuickTime
- **Resolution**: 1920x1080 (Full HD)
- **Duration**: 3-5 minutes
- **Audio**: Clear microphone (test before recording)

---

## 🎯 Shot List (Detailed)

### **Shot 1: Opening Title (5 seconds)**
- Show: Browser with localhost:3000 loading
- Say: Nothing yet (dramatic silence)

---

### **Shot 2: Introduction (30 seconds)**
**Show**: Full application view
**Say**: 
> "Hi, I'm [Your Name], and this is AeroMesh - a Digital Twin simulation built for the Somnia Data Streams Mini Hackathon. What you're seeing right now are 50 autonomous drones coordinating in real-time, with every decision they make being published directly to the Somnia blockchain."

**On-Screen Text**: "AeroMesh | Somnia Data Streams Hackathon 2025"

---

### **Shot 3: Visual Demonstration (1 minute)**

**Camera Movement**: Let the 3D scene auto-rotate for 10 seconds

**Point Out**:
1. **Flocking Behavior** (15 sec):
   - "Notice how the drones move as a cohesive swarm? That's the Boids algorithm in action - each drone adjusts its position based on its neighbors, creating emergent group behavior."
   
2. **Collision Avoidance** (15 sec):
   - "See those red buildings? Watch how the drones detect them and smoothly navigate around obstacles in real-time."
   
3. **Visual Style** (15 sec):
   - "The cyberpunk aesthetic with neon colors represents the futuristic smart city use case - imagine this scaled to thousands of delivery drones coordinating across a real city."

---

### **Shot 4: Real-Time Streaming Demo (1.5 minutes)**

**Camera**: Zoom slightly into the HUD elements

**Top-Left Network Status** (20 sec):
**Point to the green pulsing dot**
> "This green indicator shows we're actively connected to the Somnia Testnet. This isn't simulated - it's a live blockchain connection."

**Top-Right TPS Counter** (20 sec):
**Point to the counter**
> "The TPS counter shows Somnia's incredible throughput capability - over 4,000 transactions per second. This is what makes real-time IoT data streaming possible on blockchain."

**Bottom Console** (50 sec):
**Point to console logs appearing**
> "Now, this is where it gets interesting. Watch these console logs appearing in real-time. Each one represents an AI decision made by a drone and published to the blockchain."

**Read a few examples**:
- "[AGENT-04] Collision detected. Rerouting..."
- "[AGENT-12] Package delivered. Returning to base."
- "[AGENT-23] Battery level at 15%. Returning to base."

> "These aren't fake logs. Every single one of these events is a transaction on the Somnia blockchain, cryptographically signed and immutably stored."

---

### **Shot 5: Code Walkthrough (1.5 minutes)**

**Screen**: Split-screen or switch between VS Code and browser

#### **Part A: Schema Definition** (30 sec)
**Open `lib/schema.ts`**
**Show**:
```typescript
export const DRONE_EVENT_SCHEMA = `
    string eventType,
    string message,
    uint64 timestamp,
    string droneId,
    uint256 nonce
`;
```

**Say**:
> "Let me show you how this works under the hood. First, we define a schema - this is like a contract that specifies the structure of our data. Here we're defining drone events with fields for the event type, message, timestamp, drone ID, and a unique nonce."

---

#### **Part B: Publishing Events** (40 sec)
**Open `lib/simulation.ts`**
**Scroll to `publishRandomEvent()` function**
**Highlight these lines**:
```typescript
const encodedData = droneEventEncoder.encodeData([...]);
await sdk.streams.set([{
  id: streamId,
  schemaId: this.schemaId,
  data: encodedData
}]);
```

**Say**:
> "When a drone makes a decision - like avoiding a collision - we encode that event using our schema and publish it to the blockchain using the Somnia Data Streams SDK. This is the 'streams.set' method - it writes structured data directly to chain without needing a custom smart contract."

---

#### **Part C: Subscribing** (40 sec)
**Open `components/HUD.tsx`**
**Scroll to `sdk.streams.subscribe()` call**
**Highlight**:
```typescript
await sdk.streams.subscribe({
  somniaStreamsEventId: schemaId,
  onData: (data) => {
    const decodedFields = droneEventEncoder.decodeData(data.result.data);
    setLogs(prev => [...prev, logMessage]);
  }
});
```

**Say**:
> "On the UI side, we subscribe to blockchain events in real-time. When a drone publishes an event, this callback fires immediately, we decode the data, and update the console. This is the full Event → Stream → React loop that makes Somnia Data Streams so powerful."

---

### **Shot 6: Blockchain Verification (30 seconds)**

**Open new browser tab**
**Navigate to**: https://somnia-testnet.socialscan.io

**Enter your wallet address in search bar**

**Show**:
- List of recent transactions
- Click on one transaction
- Show the transaction details page with encoded data

**Say**:
> "Let's verify this on the blockchain explorer. Here's my simulation wallet address, and you can see all the transactions from the last few minutes. Each one is a drone event. Click on any transaction and you'll see the encoded event data - this is the cryptographic proof that our drones really are publishing to the blockchain."

---

### **Shot 7: Use Case & Wrap-Up (30 seconds)**

**Back to main application view**

**Say**:
> "So what's the bigger picture? This architecture can scale to thousands of drones. Imagine applying this to:
> - Smart city logistics and delivery networks
> - Autonomous vehicle coordination
> - IoT sensor networks that need tamper-proof, real-time data
> - Decentralized traffic management systems
>
> All of this was built using just the Somnia Data Streams SDK - no custom smart contracts, no centralized servers, just pure reactive blockchain architecture."

---

### **Shot 8: Closing (15 seconds)**

**Show**: GitHub repo in browser (README visible)

**Say**:
> "All the code is open source on GitHub. Thank you to the Somnia team for building such an incredible platform, and thanks for watching!"

**On-Screen Text**: 
- GitHub: github.com/yourusername/somnia-data-streams
- Built for Somnia Data Streams Hackathon 2025

---

## 🎨 Editing Tips

### **B-Roll Shots to Capture**:
1. Close-up of drones flocking
2. Drone avoiding a building
3. Console log appearing
4. Network status pulsing
5. Code syntax highlighted

### **Background Music**:
- Use royalty-free cyberpunk/electronic music
- Keep volume low (music should not overpower voice)
- Suggested: "Neon Dreams" or "Digital Future" from YouTube Audio Library

### **Text Overlays to Add**:
- Your name + GitHub handle at the start
- "50 Autonomous Drones" when showing the swarm
- "Real-Time Blockchain Events" when showing console
- "Somnia Data Streams SDK" when showing code
- Social links at the end

### **Pacing**:
- Don't rush! Speak clearly and pause between sections
- Let visual moments breathe (e.g., watch drones for 5 seconds in silence)
- Use smooth transitions between code and app

---

## ✅ Pre-Recording Checklist

- [ ] Application running without errors
- [ ] Browser dev console closed (or cleared of errors)
- [ ] Multiple events appearing in console (wait 30 seconds before recording)
- [ ] Microphone tested and clear
- [ ] Screen recording software ready
- [ ] GitHub repo public and README updated
- [ ] Somnia Explorer open in a tab (ready to switch)
- [ ] VS Code with relevant files open
- [ ] Browser zoom at 100%
- [ ] Close unnecessary tabs/applications

---

## 📤 After Recording

1. **Export video as MP4** (H.264 codec recommended)
2. **Upload to YouTube** as unlisted
3. **Add to README**: Update the "Video Walkthrough" link
4. **Submit**: Include YouTube link in hackathon submission

---

## 🎯 Key Messages to Emphasize

1. ✅ "This is LIVE blockchain - not simulated"
2. ✅ "No custom smart contracts needed"
3. ✅ "Real-time reactive architecture"
4. ✅ "Cryptographically verified events"
5. ✅ "Scalable to thousands of devices"
6. ✅ "Applicable to real-world IoT/smart cities"

---

Good luck! 🚀
