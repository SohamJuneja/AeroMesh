# AeroMesh - Deployment Guide

## Quick Deploy to Vercel ⚡

### Prerequisites
- GitHub account with AeroMesh repository
- Vercel account (free tier works)

### One-Click Deployment

1. **Push to GitHub** (if not already done):
```bash
git remote add origin https://github.com/SohamJuneja/AeroMesh.git
git push -u origin main
```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository `SohamJuneja/AeroMesh`
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

### Environment Variables (Auto-configured)
✅ All environment variables are public (Next.js client-side)
✅ No `.env` file needed - everything is in the code
✅ Burner wallet is hardcoded for demo purposes

### Build Configuration
The `vercel.json` is already configured with:
- Framework: Next.js 16
- Build command: `npm run build`
- Output: `.next` directory
- Region: US East (iad1) for low latency

### Deployment Process
1. ⏱️ Build takes ~2-3 minutes
2. 🚀 Auto-deploys on every push to `main`
3. 🌐 Get production URL: `https://aeromesh.vercel.app` (or similar)
4. 🔄 Automatic HTTPS, CDN, and edge caching

### Post-Deployment Checklist
- [ ] Visit the deployed URL
- [ ] Check browser console for `✅ Published to Somnia` messages
- [ ] Verify 3D visualization renders correctly
- [ ] Test the 4 navigation tabs (LOGS, TX, STATS, INFO)
- [ ] Confirm transactions appear in TX tab

### Vercel Dashboard Features
- **Analytics**: View page performance and traffic
- **Logs**: See build and function logs
- **Deployments**: Roll back to previous versions
- **Domains**: Add custom domain (optional)

### Demo Video Recording
With live URL, you can now:
1. Record the deployed version (more impressive than localhost)
2. Share the link with hackathon judges
3. Show real-time blockchain transactions
4. Demonstrate production-ready deployment

### Troubleshooting
If build fails:
```bash
# Test locally first
npm run build
npm start
```

If visualization doesn't load:
- Check browser console for errors
- Ensure WebGL is supported
- Try different browser (Chrome recommended)

### Optional: Custom Domain
1. Go to Vercel project settings
2. Add custom domain (e.g., `aeromesh.yourdomain.com`)
3. Update DNS records as instructed
4. Wait for SSL provisioning (~1 min)

---

**🎉 That's it!** Your AeroMesh Digital Twin is now live on the internet.
