# 🚨 EMERGENCY MANUAL REBUILD INSTRUCTIONS

## Problem
Vercel might not be auto-detecting commits. We need to manually trigger rebuild.

## SOLUTION - Manual Vercel Rebuild (5 minutes)

### Step 1: Go to Vercel Dashboard
1. Open: https://vercel.com/dashboard
2. Find project: **nova-ai-chatbot-2026** (or similar name)
3. Click on it

### Step 2: Trigger Manual Rebuild
**Method A (Preferred):**
1. Click **"Deployments"** tab
2. Find the latest deployment (top of list)
3. Click the **3-dot menu** (...) on the right
4. Select **"Redeploy"**
5. Click **"Redeploy"** button in popup
6. Wait 2-5 minutes for build to complete

**Method B (Alternative):**
1. Go to **Settings** tab
2. Scroll to **"Environment Variables"**
3. Check that `VITE_API_URL` is set to: `https://nova-ai-backend-sene.onrender.com/api`
4. If not, ADD IT:
   - Name: `VITE_API_URL`
   - Value: `https://nova-ai-backend-sene.onrender.com/api`
5. Save
6. Vercel will auto-rebuild

### Step 3: Verify Rebuild Complete
1. Go to **"Deployments"** tab
2. New deployment should show **✅ "Ready"** in green
3. Click on it to see details
4. It should say deployment is complete

### Step 4: Clear Browser Cache Again
1. Go to: https://nova-ai-chatbot-2026.vercel.app
2. Press: **Ctrl + Shift + R** (Windows) or **Cmd + Shift + R** (Mac)

### Step 5: Test
1. Open **DevTools**: Press **F12**
2. Go to **Console** tab
3. Try **Signup**
4. Should see in console:
   ```
   [AUTH] Signup request to: https://nova-ai-backend-sene.onrender.com/api/auth/signup
   ```
   ✅ **If you see this = SUCCESS!**

---

## If It STILL Shows localhost:

**Nuclear Option - Delete and Redeploy:**
1. Disconnect GitHub from Vercel temporarily
2. Wait 5 minutes
3. Reconnect GitHub
4. Vercel will do a fresh build
5. Clear cache and test

---

## BACKEND STATUS CHECK

Try this in browser address bar:
```
https://nova-ai-backend-sene.onrender.com/health
```

Should show:
```json
{"status":"ok","timestamp":"..."}
```

If this fails, backend is down - that's a different problem.

---

## ABSOLUTE LAST RESORT

If nothing works, reply with:
1. Screenshot of Vercel Deployments page
2. Screenshot of DevTools Console when you try signup
3. The exact error message

I will do a COMPLETE manual deployment setup.
