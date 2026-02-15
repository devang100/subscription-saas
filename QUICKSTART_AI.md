# ⚡ Quick Start: AI Assistant (Groq Edition)

## 1. Get Your Groq API Key (2 minutes) - **FREE!**

1. Go to: **https://console.groq.com/keys**
2. Sign up or log in (GitHub/Google sign-in available)
3. Click **"Create API Key"**
4. Name it "Stratis AI"
5. Copy the key (it starts with `gsk_...`)

> 🎉 **Groq is FREE for developers!** Much faster than OpenAI and no credit card required!

## 2. Add to Environment (30 seconds)

Open `backend/.env` and add:

```bash
GROQ_API_KEY="gsk_paste-your-key-here"
```

## 3. Restart Backend (10 seconds)

```bash
cd backend
npm run dev
```

## 4. Test It! (1 minute)

1. Open your dashboard: `http://localhost:3000/dashboard`
2. Click the **sparkle icon** (bottom-right corner)
3. Type: **"What projects do I have?"**
4. Watch the **lightning-fast** response! ⚡

## 5. Try These Features

### Quick Actions
- Click **"Email Draft"** → Generates professional client email
- Click **"Analyze"** → Analyzes current project health

### Chat Examples
- "Summarize my tasks for today"
- "Draft an update email for the client"
- "What's the status of Project X?"
- "How is my team's workload?"

## Why Groq?

### ⚡ **Lightning Fast**
- Responses in **under 1 second** (vs 3-5 seconds with OpenAI)
- Uses specialized hardware for AI inference

### 💰 **Free Tier**
- Generous free tier for developers
- No credit card required to start
- Perfect for testing and small-scale use

### 🚀 **High Quality**
- Uses Llama 3.3 70B model
- Comparable quality to GPT-4
- Optimized for speed without sacrificing accuracy

## Troubleshooting

### "AI Assistant is not configured"
→ Make sure you added `GROQ_API_KEY` to `.env` and restarted the backend

### "Invalid Groq API key"
→ Double-check your API key is correct (starts with `gsk_`)

### Still having issues?
→ Check `backend/` terminal for error messages

## Cost

- **FREE** for most use cases!
- Generous rate limits on free tier
- Paid plans available for high-volume usage

## That's It!

You now have a **blazing-fast** AI assistant powered by Groq that understands your projects, generates emails, and provides intelligent insights.

**Enjoy the speed! 🚀**

---

For detailed documentation, see: `AI_ASSISTANT.md`
