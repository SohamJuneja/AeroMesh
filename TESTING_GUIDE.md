# 🧪 Testing Guide for AeroMesh

## Quick Test (5 Minutes)

### 1. Start the Development Server

```bash
npm run dev
```

**Expected Output**:
```
✓ Ready in 2.5s
○ Local: http://localhost:3000
```

### 2. Open in Browser

Navigate to `http://localhost:3000`

### 3. Visual Verification Checklist

Watch for these within the first 30 seconds:

#### ✅ 3D Scene
- [ ] Black background with blue grid lines (city floor)
- [ ] Random cube buildings (dark blue, some red)
- [ ] **50 green glowing spheres** (the drones)
- [ ] Drones are **MOVING** (not static)
- [ ] Camera slowly auto-rotates
- [ ] Stars in the background

#### ✅ HUD Top-Left (Network Status)
- [ ] Green pulsing dot
- [ ] Text: "SOMNIA TESTNET"
- [ ] Text: "LIVE STREAM CONNECTED"
- [ ] WiFi icon visible

#### ✅ HUD Top-Right (TPS Counter)
- [ ] Number between 3,500 - 4,500
- [ ] Updates every ~500ms
- [ ] Text: "TRANSACTIONS / SEC"

#### ✅ HUD Bottom (Console)
- [ ] Red border on top
- [ ] Text: "AEROMESH AGENT LOGS (ON-CHAIN)"
- [ ] **WAIT 10-30 seconds**: Event logs should start appearing
- [ ] Logs format: `[AGENT-XX] Message here`
- [ ] New logs slide in from bottom

---

## Expected Behavior

### Drone Movement
- **Flocking**: Drones move in groups (swarm intelligence)
- **Speed**: Smooth, not jerky
- **Boundaries**: Drones stay within the scene (don't fly away)
- **Collision Avoidance**: Drones veer away from red buildings

### Event Console
Events should appear every **5-15 seconds**. Examples:
```
[AGENT-04] Rerouting to avoid obstacle at 45.2, -23.1
[AGENT-12] Delivery confirmed at sector 7
[AGENT-23] Battery level at 18%. Returning to base.
[AGENT-08] Latency spike detected: 87ms
[AGENT-15] Consensus reached on Block #492847
```

---

## Common Issues & Solutions

### ❌ Problem: Drones not moving
**Cause**: Simulation engine initialization failed
**Solution**: 
1. Check browser console (F12) for errors
2. Refresh the page
3. Check `.env` file has valid PRIVATE_KEY

### ❌ Problem: No console logs appearing
**Cause**: Blockchain connection issue or subscription failed
**Solution**:
1. Wait 30 seconds (first publish takes time)
2. Check browser console for "Failed to subscribe" errors
3. Verify internet connection
4. Check Somnia Testnet is online: https://dream-rpc.somnia.network

### ❌ Problem: "Network Status" shows red/disconnected
**Cause**: RPC connection failed
**Solution**:
1. Check `.env` has correct RPC URL
2. Try restarting dev server
3. Check firewall/VPN isn't blocking connection

### ❌ Problem: Page is blank
**Cause**: Build error or missing dependencies
**Solution**:
```bash
npm install
npm run dev
```

### ❌ Problem: "Module not found" error
**Cause**: Dependencies not installed
**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## Browser Console Tests

Open DevTools (F12) → Console tab

### Good Signs ✅
```
Schema ID: 0xabc123...
Initialized simulation with 50 drones
Connected to Somnia Testnet
Subscription active
Published event: COLLISION_AVOIDED for AGENT-04
```

### Bad Signs ❌
```
Failed to fetch
TypeError: Cannot read property 'xxx' of undefined
ReferenceError: xxx is not defined
Failed to subscribe
Network error
```

---

## Performance Benchmarks

### Expected Performance
- **FPS**: 55-60 (smooth animation)
- **CPU Usage**: 30-50% (single core)
- **RAM Usage**: ~500MB
- **Network**: Minimal (only blockchain calls)

### Check FPS
In browser console, type:
```javascript
let fps = 0;
let lastTime = performance.now();
function checkFPS() {
  const now = performance.now();
  fps = Math.round(1000 / (now - lastTime));
  lastTime = now;
  console.log('FPS:', fps);
  requestAnimationFrame(checkFPS);
}
checkFPS();
```

Should show ~60 FPS consistently.

---

## Blockchain Verification Test

### Step 1: Get Your Wallet Address
1. Open `lib/simulation.ts`
2. Find the `SIMULATION_PRIVATE_KEY` constant
3. Derive the address using:
```bash
# In a new terminal
npx viem address --private-key 0xYourPrivateKeyHere
```

### Step 2: Check Transactions
1. Go to: https://somnia-testnet.socialscan.io
2. Paste your wallet address in search
3. You should see transactions appearing
4. Click any transaction → should show encoded data

### Step 3: Verify Event Data
1. Click a transaction
2. Look for "Input Data" section
3. Should show hex-encoded event
4. Copy the data → decode it (optional advanced step)

---

## Demo Recording Test

Before recording your demo video, run through this:

1. **Clear Cache**:
   ```bash
   # Stop dev server (Ctrl+C)
   rm -rf .next
   npm run dev
   ```

2. **Fresh Browser**:
   - Open incognito/private window
   - Go to localhost:3000
   - Let it load for 30 seconds

3. **Verify Everything**:
   - [ ] All drones visible
   - [ ] Smooth movement
   - [ ] Network status green
   - [ ] At least 3-4 console logs visible
   - [ ] No console errors (F12)

4. **Practice Narration**:
   - Explain what you're showing
   - Point out key features
   - Keep it under 5 minutes

---

## Pre-Submission Final Test

Run this checklist before submitting to hackathon:

### Code Quality
- [ ] No `console.log` statements in production code (remove or comment)
- [ ] No hardcoded secrets (use `.env`)
- [ ] All TypeScript errors resolved
- [ ] ESLint warnings addressed

### Documentation
- [ ] README has your actual GitHub username
- [ ] README has demo video link
- [ ] .env.example is present
- [ ] DEMO_VIDEO_GUIDE.md is included

### Functionality
- [ ] Application runs without errors
- [ ] Blockchain events appear
- [ ] 3D scene renders correctly
- [ ] HUD displays correct information

### GitHub
- [ ] Repository is PUBLIC
- [ ] All files pushed
- [ ] README displays correctly on GitHub
- [ ] No .env file in repository (security!)

---

## Test Automation Script (Optional)

Create `test.js` in project root:

```javascript
// Quick automated test
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  console.log('🧪 Testing AeroMesh...');
  
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(5000);
  
  const errors = await page.evaluate(() => {
    return window.__errors || [];
  });
  
  if (errors.length === 0) {
    console.log('✅ No errors detected!');
  } else {
    console.log('❌ Errors found:', errors);
  }
  
  await browser.close();
})();
```

Run with: `node test.js`

---

## Need Help?

If you encounter issues during testing:

1. **Check Browser Console** (F12) first
2. **Read Error Messages** carefully
3. **Search Error** on Stack Overflow
4. **Check Somnia Discord** for known issues
5. **Review Somnia Docs**: https://docs.somnia.network

---

Good luck! Your project is solid - just verify everything works before submitting! 🚀
