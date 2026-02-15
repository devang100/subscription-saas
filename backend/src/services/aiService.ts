import Groq from 'groq-sdk';
import { prisma } from '../server';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || '',
});

export interface AIContext {
    orgId: string;
    userId: string;
    projectId?: string;
    taskId?: string;
}

/**
 * Get relevant context for AI assistant based on user's current scope
 */
async function getContextData(context: AIContext) {
    const { orgId, projectId, taskId } = context;

    // Fetch organization data
    const org = await prisma.organization.findUnique({
        where: { id: orgId },
        include: {
            subscription: { include: { plan: true } },
            _count: { select: { clients: true, memberships: true } }
        }
    });

    // Fetch recent tasks
    const recentTasks = await prisma.task.findMany({
        where: {
            project: {
                client: { organizationId: orgId }
            }
        },
        include: {
            project: { select: { name: true } },
            assignee: { select: { fullName: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
    });

    // Fetch specific project if provided
    let projectData: any = null;
    if (projectId) {
        projectData = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                client: true,
                tasks: {
                    include: { assignee: { select: { fullName: true } } },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
    }

    // Fetch specific task if provided
    let taskData: any = null;
    if (taskId) {
        taskData = await prisma.task.findUnique({
            where: { id: taskId },
            include: {
                project: { include: { client: true } },
                assignee: { select: { fullName: true, email: true } },
                comments: { include: { user: { select: { fullName: true } } } },
                timeLogs: { include: { user: { select: { fullName: true } } } }
            }
        });
    }

    return {
        org,
        recentTasks,
        projectData,
        taskData
    };
}

/**
 * Build system prompt with context
 */
function buildSystemPrompt(contextData: any): string {
    const { org, recentTasks, projectData, taskData } = contextData;

    let prompt = `You are Stratis AI, an intelligent assistant for the Stratis Team Operating System. You help teams manage projects, collaborate, and handle clients efficiently.

Current Organization: ${org?.name || 'Unknown'}
Plan: ${org?.subscription?.plan?.name || 'Free'}
Active Clients: ${org?._count?.clients || 0}
Team Members: ${org?._count?.memberships || 0}

`;

    if (recentTasks.length > 0) {
        prompt += `\nRecent Tasks:\n`;
        recentTasks.slice(0, 5).forEach((task: any) => {
            prompt += `- ${task.title} (${task.status}) - ${task.project.name} - Assigned to: ${task.assignee?.fullName || 'Unassigned'}\n`;
        });
    }

    if (projectData) {
        prompt += `\nCurrent Project: ${projectData.name}
Client: ${projectData.client.name}
Total Tasks: ${projectData.tasks.length}
Status Breakdown:
- TODO: ${projectData.tasks.filter((t: any) => t.status === 'TODO').length}
- IN_PROGRESS: ${projectData.tasks.filter((t: any) => t.status === 'IN_PROGRESS').length}
- REVIEW: ${projectData.tasks.filter((t: any) => t.status === 'REVIEW').length}
- DONE: ${projectData.tasks.filter((t: any) => t.status === 'DONE').length}
`;
    }

    if (taskData) {
        prompt += `\nCurrent Task: ${taskData.title}
Status: ${taskData.status}
Priority: ${taskData.priority}
Project: ${taskData.project.name}
Client: ${taskData.project.client.name}
Assigned to: ${taskData.assignee?.fullName || 'Unassigned'}
Comments: ${taskData.comments.length}
Time Logged: ${taskData.timeLogs.reduce((sum: number, log: any) => sum + log.minutes, 0)} minutes
`;
    }

    prompt += `\nYou can help with:
- Drafting professional emails to clients
- Summarizing project status and progress
- Analyzing task workload and suggesting priorities
- Generating project descriptions and documentation
- Providing insights on team productivity
- Answering questions about the current project or organization

Be concise, professional, and actionable. Format responses in markdown when appropriate.`;

    return prompt;
}

/**
 * Generate a mock response for demo purposes when no API key is present
 */
function mockAIResponse(userMessage: string, contextData: any): string {
    const msg = userMessage.toLowerCase();

    if (msg.includes('email') || msg.includes('draft')) {
        return `Subject: Project Update - ${contextData.projectData?.name || 'Project'}

Dear Client,

I hope this email finds you well.

I wanted to provide a quick update on our progress with the ${contextData.projectData?.name || 'current project'}. We have made significant headway on the recent milestones.

**Completed Items:**
- Initial setup and configuration
- Core feature implementation
- User interface design

**Next Steps:**
- Testing and QA
- Client review session
- Final deployment

Please let us know if you have any questions or would like to schedule a call to discuss further.

Best regards,
Stratis Team
(Demo Mode: Add valid GROQ_API_KEY to generate real emails)`;
    }

    if (msg.includes('analyze') || msg.includes('health')) {
        return `### Project Health Analysis (Demo)

**Status:** 🟢 On Track

**Key Metrics:**
- **Tasks Completed:** ${contextData.projectData?.tasks?.filter((t: any) => t.status === 'DONE').length || 5}
- **Pending Tasks:** ${contextData.projectData?.tasks?.filter((t: any) => t.status !== 'DONE').length || 3}
- **Team Velocity:** High

**Recommendations:**
1. Review pending high-priority tasks.
2. Schedule a team sync to discuss blockers.
3. Ensure all documentation is up to date.

*Note: This is a simulated response. Configure Groq API for real analysis.*`;
    }

    return `I received your message: "${userMessage}"

Since the **Groq API Key** is missing, I am running in **Demo Mode**. 
I have access to your context:
- Organization: ${contextData.org?.name || 'N/A'}
- Active Project: ${contextData.projectData?.name || 'None'}

To get real AI responses, please add your API Key to the \`backend/.env\` file.
For now, I can simulate basic responses for testing limits and UI.`;
}

/**
 * Main AI chat function using Groq
 */
export async function chatWithAI(
    userMessage: string,
    context: AIContext,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<string> {
    try {
        // Check if API key is configured
        if (!process.env.GROQ_API_KEY) {
            // return "⚠️ AI Assistant is not configured. Please add your Groq API key to enable this feature.";
            console.log("Using Mock AI Response (No API Key)");
            const contextData = await getContextData(context);
            return mockAIResponse(userMessage, contextData);
        }

        // Get context data
        const contextData = await getContextData(context);

        // Build system prompt
        const systemPrompt = buildSystemPrompt(contextData);

        // Prepare messages for Groq
        const messages: Groq.Chat.ChatCompletionMessageParam[] = [
            { role: 'system', content: systemPrompt },
            ...conversationHistory.map(msg => ({
                role: msg.role as 'user' | 'assistant',
                content: msg.content
            })),
            { role: 'user', content: userMessage }
        ];

        // Call Groq API
        const response = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile', // Fast and capable model
            messages,
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1,
            stream: false
        });

        return response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    } catch (error: any) {
        console.error('AI Service Error:', error);

        if (error.status === 401 || error.error?.error?.code === 'invalid_api_key') {
            return "⚠️ Invalid Groq API key. Please check your configuration.";
        }

        return `⚠️ AI Assistant encountered an error: ${error.message || 'Unknown error'}`;
    }
}

/**
 * Generate email draft for client communication
 */
export async function generateClientEmail(
    context: AIContext,
    emailType: 'update' | 'invoice' | 'onboarding' | 'custom',
    additionalContext?: string
): Promise<string> {
    const contextData = await getContextData(context);

    let prompt = '';

    switch (emailType) {
        case 'update':
            prompt = `Draft a professional project update email for the client. Include current progress, completed tasks, and next steps. ${additionalContext || ''}`;
            break;
        case 'invoice':
            prompt = `Draft a professional invoice email for the client. Be polite and include payment details. ${additionalContext || ''}`;
            break;
        case 'onboarding':
            prompt = `Draft a welcoming onboarding email for a new client. Introduce the team and explain the workflow. ${additionalContext || ''}`;
            break;
        case 'custom':
            prompt = additionalContext || 'Draft a professional email to the client.';
            break;
    }

    return chatWithAI(prompt, context);
}

/**
 * Analyze project health and provide insights
 */
export async function analyzeProjectHealth(context: AIContext): Promise<string> {
    const prompt = `Analyze the current project's health. Consider task distribution, overdue items, team workload, and provide actionable recommendations for improvement.`;
    return chatWithAI(prompt, context);
}
