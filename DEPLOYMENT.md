# Vercel Deployment Guide

## 🚀 How to Deploy Your CRM to Vercel

### Step 1: Go to Vercel
Visit [https://vercel.com](https://vercel.com) and sign in with your GitHub account.

### Step 2: Import Your Repository
1. Click the **"Add New..."** button in the top right
2. Select **"Project"**
3. Find and select your repository: `ajitbhomkar/modern-crm-ai`
4. Click **"Import"**

### Step 3: Configure Environment Variables (IMPORTANT!)
Before deploying, you MUST add your Groq API key:

1. In the "Configure Project" screen, scroll down to **"Environment Variables"**
2. Add the following:
   - **Key**: `NEXT_PUBLIC_GROQ_API_KEY`
   - **Value**: `your_groq_api_key_from_console`
   - **Environment**: Select all (Production, Preview, Development)
3. Click **"Add"**

### Step 4: Deploy
1. Leave all other settings as default (Vercel auto-detects Next.js)
2. Click **"Deploy"**
3. Wait 2-3 minutes for the build to complete

### Step 5: Your CRM is Live! 🎉
Once deployed, you'll get a URL like: `https://modern-crm-ai.vercel.app`

---

## 📝 Alternative: Deploy with Vercel CLI

If you prefer using the command line:

```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Deploy from your project directory
cd /Users/apple/Desktop/crm
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - What's your project's name? modern-crm-ai
# - In which directory is your code located? ./
# - Want to override the settings? No

# Add environment variable
vercel env add NEXT_PUBLIC_GROQ_API_KEY

# When prompted, paste your API key from .env.local file

# Select all environments (Production, Preview, Development)

# Deploy to production
vercel --prod
```

---

## 🔒 Security Note

Your `.env.local` file is NOT committed to Git (it's in `.gitignore`), so your API key remains secure. You must add it manually in Vercel's dashboard or CLI.

---

## ✅ Post-Deployment Checklist

- [ ] Visit your deployed URL
- [ ] Test the Dashboard
- [ ] Test Customer Management
- [ ] Test AI Chat (this uses the API key)
- [ ] Test AI Lead Scoring (this uses the API key)
- [ ] Test Task Management

---

## 🆘 Troubleshooting

### AI Features Not Working?
- Make sure you added the `NEXT_PUBLIC_GROQ_API_KEY` environment variable in Vercel
- Redeploy after adding the environment variable
- Check the browser console for errors

### Build Failed?
- Check the Vercel deployment logs
- Ensure all dependencies are in package.json
- Try building locally first: `npm run build`

---

## 🎯 Your Deployment URLs

- **GitHub Repository**: https://github.com/ajitbhomkar/modern-crm-ai
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Your Live CRM**: (will be available after deployment)

---

Made with ❤️ using Next.js, Groq AI, and Vercel
