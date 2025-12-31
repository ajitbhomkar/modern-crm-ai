# 🚀 CI/CD Pipeline Setup Guide

Your CRM now has an automated CI/CD pipeline that deploys to Vercel on every push!

## 🔄 What Happens Automatically

When you push to `main` branch:
1. ✅ Code is linted (ESLint)
2. ✅ TypeScript type checking
3. ✅ Application builds
4. ✅ Automatically deploys to Vercel Production
5. ✅ Deployment URL posted as commit comment

## 📋 Setup Instructions

### Step 1: Get Vercel Token

1. Go to https://vercel.com/account/tokens
2. Click **"Create Token"**
3. Name it: `GitHub Actions CI/CD`
4. Set expiration: Choose your preference (recommend: No Expiration for CI/CD)
5. Copy the token (starts with `vcel_...`)

### Step 2: Get Vercel Project IDs

Run these commands in your terminal:

```bash
cd /Users/apple/Desktop/crm

# Login to Vercel (if not already)
npx vercel login

# Link project to Vercel
npx vercel link

# Get your project details
cat .vercel/project.json
```

You'll see output like:
```json
{
  "orgId": "team_xxxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxxx"
}
```

### Step 3: Add GitHub Secrets

1. Go to your GitHub repository: https://github.com/ajitbhomkar/modern-crm-ai
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"** and add these 3 secrets:

| Secret Name | Value | Where to Get It |
|-------------|-------|-----------------|
| `VERCEL_TOKEN` | `vcel_xxx...` | From Step 1 (Vercel Token) |
| `VERCEL_ORG_ID` | `team_xxx...` | From Step 2 (orgId from .vercel/project.json) |
| `VERCEL_PROJECT_ID` | `prj_xxx...` | From Step 2 (projectId from .vercel/project.json) |
| `NEXT_PUBLIC_GROQ_API_KEY` | `gsk_xxx...` | From your `.env.local` file |

### Step 4: Test the Pipeline

```bash
# Make a small change
echo "# CI/CD Pipeline Active! 🚀" >> README.md

# Commit and push
git add .
git commit -m "Test CI/CD pipeline"
git push
```

### Step 5: Watch It Work!

1. Go to: https://github.com/ajitbhomkar/modern-crm-ai/actions
2. You'll see your workflow running
3. Wait 2-3 minutes
4. ✅ Your CRM is automatically deployed!

---

## 📊 Pipeline Stages

### Stage 1: Lint and Type Check (30 seconds)
- Runs ESLint to check code quality
- Runs TypeScript compiler to check types
- Continues even if there are warnings

### Stage 2: Build (1-2 minutes)
- Installs dependencies
- Builds the Next.js application
- Verifies build is successful
- Uploads build artifacts

### Stage 3: Deploy (1-2 minutes)
- **For Pull Requests**: Deploys preview version
- **For Main Branch**: Deploys to production
- Uses Vercel CLI for deployment
- Posts deployment URL as comment

**Total Time: ~3-5 minutes** ⏱️

---

## 🎯 What This Gives You

✅ **Automatic Deployments** - Push code, it goes live automatically  
✅ **Quality Checks** - Linting and type checking before deploy  
✅ **Preview Deployments** - Test PRs before merging  
✅ **Build Verification** - Ensures code builds successfully  
✅ **Deployment Comments** - See deployment URL in commits  
✅ **GitHub Actions** - Free for public repositories  

---

## 🔍 Monitoring Deployments

### View Workflow Runs
https://github.com/ajitbhomkar/modern-crm-ai/actions

### View Deployment Status
- Green checkmark ✅ = Deployed successfully
- Red X ❌ = Failed (click for details)
- Yellow circle 🟡 = In progress

### Get Deployment URL
After successful deployment, check:
1. Commit comment on GitHub
2. GitHub Actions workflow summary
3. Your Vercel dashboard

---

## 🛠️ Customization

### Change Deployment Branch
Edit `.github/workflows/deploy.yml`:
```yaml
on:
  push:
    branches:
      - main        # Change this to your branch
      - production  # Or add more branches
```

### Add Tests
Add to the workflow:
```yaml
- name: Run tests
  run: npm test
```

### Add Notifications
Integrate with:
- Slack
- Discord
- Email
- Microsoft Teams

---

## 🆘 Troubleshooting

### Issue: Workflow fails with "VERCEL_TOKEN is not set"
**Solution**: Add `VERCEL_TOKEN` secret in GitHub Settings → Secrets and variables → Actions

### Issue: "Project not found"
**Solution**: 
1. Run `npx vercel link` in your project
2. Update `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` secrets

### Issue: Build fails
**Solution**: 
1. Check the workflow logs on GitHub Actions
2. Ensure `npm run build` works locally
3. Verify all environment variables are set

### Issue: Deployment succeeds but site not working
**Solution**: 
1. Check you added `NEXT_PUBLIC_GROQ_API_KEY` secret
2. Verify the secret value is correct
3. Redeploy by pushing a new commit

---

## 📝 Quick Reference

```bash
# View workflow status
git push && open https://github.com/ajitbhomkar/modern-crm-ai/actions

# Get Vercel project info
npx vercel project ls

# Test build locally
npm run build

# Check secrets (won't show values)
# Go to: https://github.com/ajitbhomkar/modern-crm-ai/settings/secrets/actions
```

---

## 🎉 Benefits

### Before CI/CD:
1. Make changes
2. Commit and push
3. Manually deploy to Vercel
4. Wait and check if it worked
5. Fix issues and repeat

### With CI/CD:
1. Make changes
2. Push to GitHub
3. **✨ Everything else happens automatically!**
4. Get deployment URL in ~3 minutes

---

## 🚀 Next Steps

1. **Complete the setup** (Steps 1-3 above)
2. **Test with a commit** (Step 4)
3. **Monitor your first deployment** (Step 5)
4. **Enjoy automatic deployments!** 🎉

Your CRM now has **enterprise-grade CI/CD**! Every push automatically:
- Tests your code
- Builds the application
- Deploys to production
- Gives you the live URL

**Professional development workflow activated!** 💪

---

Made with ❤️ using GitHub Actions & Vercel
