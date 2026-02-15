# 🤖 Stratis AI Assistant (Powered by Groq)

The AI Assistant is a powerful feature that integrates **Groq's lightning-fast AI inference** to provide intelligent, context-aware assistance for project management, client communication, and team productivity.

## Why Groq?

### ⚡ **10x Faster Responses**
Groq uses specialized hardware (LPU™) for AI inference, delivering responses in **under 1 second** compared to 3-5 seconds with traditional cloud AI.

### 💰 **Free for Developers**
- Generous free tier with no credit card required
- Perfect for startups and small teams
- Paid plans available for high-volume usage

### 🚀 **High Quality**
- Uses **Llama 3.3 70B** model
- Comparable quality to GPT-4
- Optimized for speed without sacrificing accuracy

## Features

### 1. **Intelligent Chat**
- Context-aware responses based on your organization, projects, and tasks
- Understands your current project scope and team structure
- Provides actionable insights and recommendations

### 2. **Email Generation**
- **Project Updates**: Generate professional status update emails for clients
- **Invoice Emails**: Create polished invoice communication
- **Onboarding**: Draft welcoming emails for new clients
- Customizable with additional context

### 3. **Project Analysis**
- Analyze project health and task distribution
- Identify bottlenecks and overdue items
- Get recommendations for improving team productivity
- Workload analysis across team members

## Setup

### 1. Get Groq API Key
1. Visit [Groq Console](https://console.groq.com/keys)
2. Sign up or log in (GitHub/Google available)
3. Click **"Create API Key"**
4. Name it "Stratis AI"
5. Copy the key (starts with `gsk_...`)

### 2. Configure Environment
Add your API key to `backend/.env`:
```bash
GROQ_API_KEY="gsk_your-api-key-here"
```

### 3. Restart Backend
```bash
cd backend
npm run dev
```

## Usage

### Frontend Access
The AI Assistant is available as a floating button in the bottom-right corner of the dashboard:
- Click the sparkle icon to open the chat
- Use quick action buttons for common tasks
- Type any question or request in the chat input

### API Endpoints

#### Chat with AI
```typescript
POST /api/ai/chat
{
  "message": "What tasks are overdue?",
  "orgId": "org-id",
  "projectId": "project-id", // optional
  "conversationHistory": [] // optional
}
```

#### Generate Email
```typescript
POST /api/ai/email
{
  "orgId": "org-id",
  "projectId": "project-id", // optional
  "emailType": "update" | "invoice" | "onboarding" | "custom",
  "additionalContext": "Any extra details..." // optional
}
```

#### Analyze Project
```typescript
POST /api/ai/analyze-project
{
  "orgId": "org-id",
  "projectId": "project-id"
}
```

## Context Awareness

The AI Assistant automatically has access to:
- **Organization Data**: Name, plan, member count, client count
- **Recent Tasks**: Last 10 tasks across all projects
- **Current Project**: Full project details including tasks, client info, and status distribution
- **Specific Task**: Complete task details including comments, time logs, and assignments

This context allows the AI to provide highly relevant and actionable responses.

## Example Prompts

### General Questions
- "Summarize the current project status"
- "What tasks are assigned to me?"
- "Which projects have the most overdue tasks?"
- "How is the team's workload distributed?"

### Email Drafting
- "Draft an update email for the client about our progress this week"
- "Write a professional invoice reminder"
- "Create a welcome email for a new client"

### Analysis
- "Analyze this project's health"
- "What are the biggest bottlenecks right now?"
- "Suggest priorities for this sprint"
- "Identify tasks that might miss their deadlines"

## Performance

### Speed Comparison
- **Groq (Llama 3.3 70B)**: ~0.5-1 second response time
- **OpenAI (GPT-4o-mini)**: ~3-5 second response time
- **Result**: **5-10x faster** with Groq!

### Model Details
- **Model**: `llama-3.3-70b-versatile`
- **Max Tokens**: 1024 (balanced for quality and speed)
- **Temperature**: 0.7 (creative but focused)

## Cost & Limits

### Free Tier
- **Generous limits** for development and small-scale use
- No credit card required
- Perfect for testing and MVP

### Paid Plans
- Available for high-volume usage
- Competitive pricing
- Pay-as-you-go or subscription options

## Privacy & Security

- All AI requests are authenticated
- Organization data is scoped to the requesting user
- Conversation history is not persisted on Groq servers
- API keys are stored securely in environment variables

## Troubleshooting

### "AI Assistant is not configured"
- Ensure `GROQ_API_KEY` is set in `backend/.env`
- Restart the backend server

### "Invalid Groq API key"
- Verify your API key is correct (starts with `gsk_`)
- Check that your Groq account is active
- Ensure the key hasn't been revoked

### "AI Assistant encountered an error"
- Check backend logs for detailed error messages
- Verify network connectivity to Groq's API
- Check if you've hit rate limits (unlikely on free tier)

## Future Enhancements

Planned features:
- [ ] Voice input/output
- [ ] Document analysis (upload PDFs, analyze contracts)
- [ ] Automated task creation from natural language
- [ ] Predictive deadline analysis
- [ ] Custom AI workflows and automations
- [ ] Multi-language support
- [ ] Integration with calendar and scheduling
- [ ] Streaming responses for real-time feedback

## Technical Details

### Architecture
```
Frontend (AIAssistant.tsx)
    ↓
API Routes (/api/ai/*)
    ↓
AI Controller (aiController.ts)
    ↓
AI Service (aiService.ts)
    ↓
Groq API (Llama 3.3 70B)
```

### Files
- `backend/src/services/aiService.ts` - Core AI logic and Groq integration
- `backend/src/controllers/aiController.ts` - API endpoint handlers
- `backend/src/routes/ai.routes.ts` - Route definitions
- `frontend/src/components/AIAssistant.tsx` - UI component

### Dependencies
- `groq-sdk` - Official Groq SDK for Node.js
- Compatible with OpenAI-style API patterns

## Groq vs OpenAI Comparison

| Feature | Groq | OpenAI |
|---------|------|--------|
| **Speed** | ⚡ 0.5-1s | 🐌 3-5s |
| **Free Tier** | ✅ Generous | ❌ Limited |
| **Cost** | 💰 Very Low | 💰💰 Higher |
| **Quality** | 🎯 Excellent | 🎯 Excellent |
| **Setup** | 🚀 Easy | 🚀 Easy |
| **Best For** | Speed-critical apps | General purpose |

## Support

For issues or feature requests related to the AI Assistant:
1. Check the troubleshooting section above
2. Review backend logs for error details
3. Ensure all dependencies are up to date
4. Visit [Groq Documentation](https://console.groq.com/docs)

---

**Built with ❤️ using Groq's Lightning-Fast AI**
