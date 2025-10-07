-- Seed Learning Paths
INSERT INTO learning_paths (title, description, cover_image_url, difficulty_level, estimated_hours, is_published, sort_order) VALUES 
(
  'AI Automation Fundamentals',
  'Master the essential skills needed to build intelligent automation systems. This comprehensive path covers everything from basic AI concepts to advanced automation techniques, perfect for beginners looking to enter the AI automation field.',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1080&q=80',
  'beginner',
  40,
  true,
  1
),
(
  'Advanced Prompt Engineering',
  'Dive deep into the art and science of crafting effective prompts for large language models. Learn advanced techniques for getting the most out of AI systems, including chain-of-thought prompting, few-shot learning, and prompt optimization strategies.',
  'https://images.unsplash.com/photo-1676299081847-824916de030a?w=1080&q=80',
  'intermediate',
  25,
  true,
  2
),
(
  'Building AI Agents',
  'Learn to create autonomous AI agents that can reason, plan, and execute complex tasks. This advanced path covers agent architectures, tool use, memory systems, and multi-agent collaboration.',
  'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=1080&q=80',
  'advanced',
  60,
  true,
  3
),
(
  'Business AI Implementation',
  'A practical guide to implementing AI solutions in real business environments. Learn to identify opportunities, build ROI cases, manage stakeholders, and deploy AI systems that deliver measurable value.',
  'https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=1080&q=80',
  'intermediate',
  35,
  true,
  4
),
(
  'No-Code AI Automation',
  'Build powerful AI automations without writing a single line of code. Master tools like Make.com, Zapier, and n8n to create sophisticated workflows that integrate AI capabilities into your business processes.',
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1080&q=80',
  'beginner',
  30,
  false,
  5
);

-- Seed Courses
INSERT INTO courses (title, description, cover_image_url, difficulty_level, estimated_hours, is_published, sort_order) VALUES 
-- AI Fundamentals courses
(
  'Introduction to Artificial Intelligence',
  'Understand what AI is, how it works, and its applications in the modern world. This course demystifies AI and provides a solid foundation for your learning journey.',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1080&q=80',
  'beginner',
  8,
  true,
  1
),
(
  'Machine Learning Basics',
  'Learn the fundamentals of machine learning, including supervised and unsupervised learning, training models, and evaluating performance.',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1080&q=80',
  'beginner',
  12,
  true,
  2
),
(
  'Large Language Models Explained',
  'Deep dive into how large language models like GPT work, their capabilities, limitations, and best practices for using them effectively.',
  'https://images.unsplash.com/photo-1676299081847-824916de030a?w=1080&q=80',
  'intermediate',
  10,
  true,
  3
),
(
  'Automation Design Principles',
  'Learn to design robust, scalable automations that handle edge cases and fail gracefully. Master the principles of good automation architecture.',
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1080&q=80',
  'beginner',
  10,
  true,
  4
),

-- Prompt Engineering courses
(
  'Prompt Engineering 101',
  'Master the basics of writing effective prompts for AI models. Learn techniques for getting consistent, high-quality outputs.',
  'https://images.unsplash.com/photo-1676299081847-824916de030a?w=1080&q=80',
  'beginner',
  6,
  true,
  5
),
(
  'Advanced Prompting Techniques',
  'Explore advanced prompting strategies including chain-of-thought, tree-of-thought, and meta-prompting approaches.',
  'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=1080&q=80',
  'advanced',
  8,
  true,
  6
),
(
  'Prompt Optimization & Testing',
  'Learn systematic approaches to testing and optimizing prompts for production use, including A/B testing and performance metrics.',
  'https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=1080&q=80',
  'intermediate',
  7,
  true,
  7
),
(
  'Domain-Specific Prompting',
  'Master prompting techniques for specific domains like code generation, data analysis, content creation, and customer service.',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1080&q=80',
  'intermediate',
  4,
  true,
  8
),

-- AI Agents courses
(
  'Agent Fundamentals',
  'Understand what makes an AI agent autonomous, including perception, reasoning, planning, and action capabilities.',
  'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=1080&q=80',
  'intermediate',
  12,
  true,
  9
),
(
  'Tool Use and Function Calling',
  'Learn to build agents that can use tools and APIs to interact with external systems and expand their capabilities.',
  'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1080&q=80',
  'advanced',
  15,
  true,
  10
),
(
  'Agent Memory Systems',
  'Build agents with sophisticated memory capabilities including short-term, long-term, and episodic memory.',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1080&q=80',
  'advanced',
  10,
  true,
  11
),
(
  'Multi-Agent Collaboration',
  'Create systems where multiple AI agents work together to solve complex problems through coordination and communication.',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1080&q=80',
  'advanced',
  18,
  true,
  12
),

-- Business Implementation courses
(
  'AI Opportunity Assessment',
  'Learn to identify and evaluate AI automation opportunities in business processes, calculating potential ROI and impact.',
  'https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=1080&q=80',
  'intermediate',
  8,
  true,
  13
),
(
  'Building AI Business Cases',
  'Master the art of creating compelling business cases for AI projects, including cost-benefit analysis and risk assessment.',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1080&q=80',
  'intermediate',
  6,
  true,
  14
),
(
  'AI Project Management',
  'Learn to manage AI projects from conception to deployment, including agile methodologies adapted for AI development.',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1080&q=80',
  'intermediate',
  12,
  true,
  15
),
(
  'Change Management for AI',
  'Successfully navigate organizational change when implementing AI systems, including stakeholder management and adoption strategies.',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1080&q=80',
  'intermediate',
  9,
  true,
  16
),

-- No-Code Automation courses
(
  'Make.com Mastery',
  'Master Make.com (formerly Integromat) to build complex automation workflows without code, integrating hundreds of apps and services.',
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1080&q=80',
  'beginner',
  10,
  true,
  17
),
(
  'Zapier Advanced Techniques',
  'Go beyond basic Zaps to create sophisticated multi-step automations with conditional logic, filters, and custom webhooks.',
  'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=1080&q=80',
  'beginner',
  8,
  true,
  18
),
(
  'n8n Workflow Automation',
  'Build powerful self-hosted automation workflows with n8n, the fair-code workflow automation tool.',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1080&q=80',
  'intermediate',
  12,
  false,
  19
);

-- Seed Lessons
INSERT INTO lessons (title, description, content, video_url, duration_minutes, lesson_type, is_published, sort_order) VALUES 
-- Introduction to AI course lessons
(
  'What is Artificial Intelligence?',
  'An overview of AI, its history, and current applications across industries.',
  E'# What is Artificial Intelligence?\n\nArtificial Intelligence (AI) refers to computer systems designed to perform tasks that typically require human intelligence. These tasks include:\n\n- Learning from experience\n- Recognizing patterns\n- Making decisions\n- Understanding language\n- Solving problems\n\n## Brief History\n\nAI has evolved from simple rule-based systems in the 1950s to today\'s sophisticated neural networks and large language models.\n\n## Modern Applications\n\n- Healthcare diagnostics\n- Financial trading\n- Customer service\n- Content creation\n- Autonomous vehicles',
  'https://www.youtube.com/watch?v=ad79nYk2keg',
  25,
  'video',
  true,
  1
),
(
  'Types of AI Systems',
  'Understanding the different categories of AI: narrow AI, general AI, and superintelligence.',
  E'# Types of AI Systems\n\n## Narrow AI (Weak AI)\n\nSpecialized systems designed for specific tasks:\n- Voice assistants\n- Recommendation engines\n- Image recognition\n- Chess programs\n\n## General AI (Strong AI)\n\nHypothetical systems with human-level intelligence across all domains. Not yet achieved.\n\n## Superintelligence\n\nTheoretical AI that surpasses human intelligence in all areas. Remains in the realm of speculation.\n\n## Current State\n\nAll existing AI systems are narrow AI, highly specialized but lacking general reasoning capabilities.',
  'https://www.youtube.com/watch?v=kWmX3pd1f10',
  30,
  'video',
  true,
  2
),
(
  'AI vs Machine Learning vs Deep Learning',
  'Clarifying the relationship between AI, ML, and DL with practical examples.',
  E'# AI vs Machine Learning vs Deep Learning\n\n## The Relationship\n\n- **AI** is the broadest concept - creating intelligent machines\n- **Machine Learning** is a subset of AI - systems that learn from data\n- **Deep Learning** is a subset of ML - neural networks with multiple layers\n\n## Practical Examples\n\n### Rule-Based AI (Not ML)\n- Chess programs using predefined strategies\n- Expert systems with hard-coded rules\n\n### Machine Learning\n- Spam email filters\n- House price predictions\n- Customer churn prediction\n\n### Deep Learning\n- Image recognition\n- Natural language processing\n- Voice synthesis\n- Large language models',
  'https://www.youtube.com/watch?v=q6kJ71tEYqM',
  28,
  'video',
  true,
  3
),
(
  'AI Ethics and Responsible Use',
  'Understanding ethical considerations when working with AI systems.',
  E'# AI Ethics and Responsible Use\n\n## Key Ethical Considerations\n\n### Bias and Fairness\n- AI systems can perpetuate or amplify human biases\n- Training data may not represent all populations\n- Regular audits are essential\n\n### Privacy\n- AI systems often require large amounts of data\n- Personal information must be protected\n- Comply with regulations like GDPR\n\n### Transparency\n- Users should know when they\'re interacting with AI\n- Decision-making processes should be explainable\n- Clear accountability for AI actions\n\n### Environmental Impact\n- Training large models consumes significant energy\n- Consider sustainability in AI development\n\n## Best Practices\n\n1. Design with diverse teams\n2. Test for bias regularly\n3. Be transparent about capabilities and limitations\n4. Prioritize user privacy\n5. Consider environmental impact',
  'https://www.youtube.com/watch?v=Jn8c3oe_GWU',
  35,
  'video',
  true,
  4
),
(
  'Quiz: AI Fundamentals',
  'Test your understanding of basic AI concepts.',
  E'# Quiz: AI Fundamentals\n\n## Question 1\nWhat is the main difference between narrow AI and general AI?\n\na) Narrow AI is older technology\nb) Narrow AI is designed for specific tasks, while general AI would have human-level intelligence across all domains\nc) General AI is what we use in smartphones\nd) There is no difference\n\n## Question 2\nWhich of these is an example of machine learning?\n\na) A calculator performing arithmetic\nb) A spam filter that improves over time\nc) A simple if-then rule\nd) A stoplight timer\n\n## Question 3\nWhat is a key ethical consideration when deploying AI systems?\n\na) Making the AI as complex as possible\nb) Ensuring the system is trained only on recent data\nc) Testing for bias and ensuring fairness\nd) Keeping the AI system secret\n\n## Question 4\nDeep learning is:\n\na) A type of machine learning using neural networks\nb) A philosophy about AI\nc) Unrelated to AI\nd) Only useful for image recognition\n\n## Question 5\nWhat should you do when bias is detected in an AI system?\n\na) Ignore it if accuracy is high\nb) Retrain with more diverse data and audit regularly\nc) Use the system only for low-risk applications\nd) Switch to a different AI technology',
  null,
  20,
  'quiz',
  true,
  5
),

-- Prompt Engineering 101 lessons
(
  'Introduction to Prompt Engineering',
  'Why prompt engineering matters and how it impacts AI output quality.',
  E'# Introduction to Prompt Engineering\n\nPrompt engineering is the practice of designing and optimizing text inputs to get the best possible outputs from AI language models.\n\n## Why It Matters\n\n- Same AI model can produce vastly different results based on the prompt\n- Well-crafted prompts save time and improve output quality\n- Critical skill for working effectively with AI\n\n## Key Principles\n\n1. **Clarity**: Be specific about what you want\n2. **Context**: Provide relevant background information\n3. **Constraints**: Specify format, length, tone\n4. **Examples**: Show the AI what you\'re looking for\n\n## Example\n\n**Poor Prompt**: "Write about dogs"\n\n**Better Prompt**: "Write a 200-word informative paragraph about the benefits of owning a dog for mental health, focusing on companionship and routine. Use a warm, friendly tone suitable for a general audience."',
  'https://www.youtube.com/watch?v=pZsJbYIFCCw',
  22,
  'video',
  true,
  6
),
(
  'Basic Prompting Patterns',
  'Learn fundamental prompting patterns that work across different AI models.',
  E'# Basic Prompting Patterns\n\n## 1. Instruction Pattern\nDirect commands about what to do.\n\n**Example**: "Summarize this article in 3 bullet points"\n\n## 2. Role Pattern\nAsk the AI to adopt a specific persona or expertise.\n\n**Example**: "You are an experienced financial advisor. Explain compound interest to a beginner."\n\n## 3. Format Pattern\nSpecify the exact output format you need.\n\n**Example**: "List 5 marketing strategies in the following format:\n- Strategy name: [name]\n- Cost: [low/medium/high]\n- Timeline: [timeframe]"\n\n## 4. Few-Shot Pattern\nProvide examples of what you want.\n\n**Example**:\n"Convert these to formal language:\nInput: gonna\nOutput: going to\nInput: wanna\nOutput: want to\nInput: gotta\nOutput: "\n\n## 5. Chain-of-Thought Pattern\nAsk the AI to show its reasoning.\n\n**Example**: "Solve this problem step by step, showing your work at each stage."',
  'https://www.youtube.com/watch?v=jC4v5AS4RIM',
  28,
  'video',
  true,
  7
),
(
  'Writing Clear Instructions',
  'Techniques for crafting unambiguous, effective prompts.',
  E'# Writing Clear Instructions\n\n## Be Specific\n\n**Vague**: "Write a business email"\n**Specific**: "Write a 150-word business email to a client explaining a project delay, maintaining a professional yet apologetic tone, and proposing a new timeline"\n\n## Use Delimiters\n\nSeparate different parts of your prompt:\n```\nAnalyze the following customer review:\n\n---\n[Review text here]\n---\n\nProvide:\n1. Sentiment (positive/negative/neutral)\n2. Main concerns\n3. Suggested response\n```\n\n## Specify Length\n\n- Word count: "in 300 words"\n- Sentence count: "in 5 sentences"\n- Approximate: "in 2-3 paragraphs"\n\n## Define Tone and Style\n\n- "professional and formal"\n- "casual and friendly"\n- "technical and precise"\n- "simple language for beginners"\n\n## Break Down Complex Tasks\n\nInstead of one massive prompt, create a sequence:\n1. "First, identify the key themes"\n2. "Now, for each theme, provide examples"\n3. "Finally, synthesize into recommendations"',
  'https://www.youtube.com/watch?v=T9aRN5JkmL8',
  25,
  'video',
  true,
  8
),
(
  'Hands-On: Prompt Crafting Exercise',
  'Practice writing effective prompts for common business scenarios.',
  E'# Hands-On: Prompt Crafting Exercise\n\n## Exercise 1: Email Writing\n\nScenario: You need to write an email declining a meeting request.\n\n**Your Task**: Write a prompt that will generate an appropriate email.\n\nConsider:\n- Tone (professional, polite)\n- Key elements (decline, reason, alternative)\n- Length\n- Format\n\n## Exercise 2: Data Analysis\n\nScenario: You have sales data and need insights.\n\n**Your Task**: Write a prompt to analyze the data and provide actionable recommendations.\n\nConsider:\n- What specific insights you need\n- Format for the analysis\n- Level of detail\n- Target audience\n\n## Exercise 3: Content Creation\n\nScenario: Create social media posts about a product launch.\n\n**Your Task**: Write a prompt for generating 5 different posts.\n\nConsider:\n- Platform (LinkedIn, Twitter, etc.)\n- Tone and voice\n- Key messages\n- Call to action\n- Character limits\n\n## Exercise 4: Code Generation\n\nScenario: You need a Python function to process customer data.\n\n**Your Task**: Write a prompt for generating the code.\n\nConsider:\n- Function purpose\n- Input/output specifications\n- Edge cases\n- Comments and documentation\n- Coding standards\n\n## Self-Assessment\n\nFor each prompt you write:\n1. Is it specific enough?\n2. Does it provide necessary context?\n3. Are constraints clearly defined?\n4. Would someone else get the same result?',
  null,
  45,
  'exercise',
  true,
  9
),

-- Tool Use and Function Calling lessons
(
  'Understanding Tool-Augmented AI',
  'How AI agents can use external tools to expand their capabilities.',
  E'# Understanding Tool-Augmented AI\n\n## What Are AI Tools?\n\nTools are external functions or APIs that AI agents can call to perform specific tasks:\n- Search the web\n- Perform calculations\n- Access databases\n- Send emails\n- Generate images\n- Execute code\n\n## Why Tools Matter\n\n### Overcome Model Limitations\n- Models have knowledge cutoffs\n- Tools provide real-time information\n- Precise calculations vs. approximations\n\n### Extend Capabilities\n- Take actions in the real world\n- Access proprietary data\n- Integrate with existing systems\n\n## Tool Use Pattern\n\n1. **User Request**: "What\'s the weather in Tokyo?"\n2. **AI Recognizes**: Needs weather data tool\n3. **Tool Call**: Invokes weather API with location\n4. **Tool Response**: Returns current weather data\n5. **AI Synthesis**: Formats response for user\n\n## Common Tool Categories\n\n- **Information Retrieval**: Search, databases, APIs\n- **Computation**: Calculators, code execution\n- **Communication**: Email, messaging, notifications\n- **Creation**: Image generation, document creation\n- **Data Processing**: Analysis, transformation, validation',
  'https://www.youtube.com/watch?v=0lq4p7tLLJk',
  30,
  'video',
  true,
  10
),
(
  'Function Calling Fundamentals',
  'Learn the technical basics of implementing function calling with AI models.',
  E'# Function Calling Fundamentals\n\n## How Function Calling Works\n\n### 1. Define Tools\nDescribe available functions to the AI:\n\n```json\n{\n  "name": "get_weather",\n  "description": "Get current weather for a location",\n  "parameters": {\n    "location": {\n      "type": "string",\n      "description": "City name"\n    },\n    "units": {\n      "type": "string",\n      "enum": ["celsius", "fahrenheit"]\n    }\n  }\n}\n```\n\n### 2. Model Decides\nAI determines if a function should be called based on user input.\n\n### 3. Extract Parameters\nModel identifies the required parameters from context.\n\n### 4. Execute Function\nYour code runs the actual function.\n\n### 5. Provide Results\nReturn function output to the model.\n\n### 6. Generate Response\nModel uses the results to craft final answer.\n\n## Best Practices\n\n- **Clear Descriptions**: Make function purpose obvious\n- **Specific Parameters**: Define types and constraints\n- **Error Handling**: Handle missing params gracefully\n- **Validation**: Verify inputs before execution\n- **Rate Limiting**: Prevent excessive API calls',
  'https://www.youtube.com/watch?v=4OyUDK0rXnk',
  35,
  'video',
  true,
  11
),

-- Make.com Mastery lessons
(
  'Make.com Platform Overview',
  'Introduction to the Make.com interface and core concepts.',
  E'# Make.com Platform Overview\n\n## What is Make.com?\n\nFormerly known as Integromat, Make.com is a powerful visual automation platform that lets you:\n- Connect apps and services\n- Build complex workflows\n- Process data automatically\n- Trigger actions based on events\n\nAll without writing code!\n\n## Core Concepts\n\n### Scenarios\nYour automation workflows. Each scenario contains:\n- Trigger (what starts the automation)\n- Modules (actions and transformations)\n- Connections (links between modules)\n\n### Modules\nIndividual actions or operations:\n- App integrations (Gmail, Slack, Airtable)\n- Tools (HTTP requests, data transformation)\n- Flow control (routers, filters)\n\n### Operations\nNumber of actions performed. Your plan includes a monthly allowance.\n\n### Execution\nEach time a scenario runs (manually or triggered).\n\n## Getting Started\n\n1. Create account\n2. Connect your first apps\n3. Build a simple scenario\n4. Test and activate\n5. Monitor executions\n\n## Common Use Cases\n\n- Email to task manager integration\n- Social media post scheduling\n- Lead data synchronization\n- Invoice processing\n- Report generation',
  'https://www.youtube.com/watch?v=JIp5p17FH_4',
  28,
  'video',
  true,
  12
),
(
  'Building Your First Scenario',
  'Step-by-step guide to creating a working Make.com automation.',
  E'# Building Your First Scenario\n\n## Project: Gmail to Slack Notification\n\nWe\'ll create an automation that sends a Slack message when you receive an important email.\n\n## Step 1: Create New Scenario\n\n1. Click "+ Create a new scenario"\n2. Click the "+" to add your first module\n3. Search for "Gmail"\n4. Select "Watch Emails"\n\n## Step 2: Configure Gmail Trigger\n\n1. Connect your Gmail account\n2. Set folder to "INBOX"\n3. Add filter: Label = "Important"\n4. Set max results: 10\n5. Click OK\n\n## Step 3: Add Slack Module\n\n1. Click "+" after Gmail module\n2. Search for "Slack"\n3. Select "Create a Message"\n4. Connect your Slack account\n5. Choose channel\n\n## Step 4: Map Data\n\nClick in the "Text" field and select variables:\n- Subject: {{1.subject}}\n- From: {{1.from}}\n- Preview: {{1.snippet}}\n\n## Step 5: Test\n\n1. Click "Run once"\n2. Send yourself a test email\n3. Check Slack for notification\n\n## Step 6: Activate\n\n1. Name your scenario\n2. Set schedule (immediately/intervals)\n3. Toggle "ON"\n\nCongratulations! Your first automation is live.',
  'https://www.youtube.com/watch?v=bNZZZj8_Nic',
  32,
  'video',
  true,
  13
);

-- Connect Learning Paths to Courses
INSERT INTO learning_path_courses (learning_path_id, course_id, sort_order) VALUES
-- AI Automation Fundamentals path
(1, 1, 1),  -- Introduction to AI
(1, 2, 2),  -- Machine Learning Basics
(1, 3, 3),  -- Large Language Models Explained
(1, 4, 4),  -- Automation Design Principles

-- Advanced Prompt Engineering path
(2, 5, 1),  -- Prompt Engineering 101
(2, 6, 2),  -- Advanced Prompting Techniques
(2, 7, 3),  -- Prompt Optimization & Testing
(2, 8, 4),  -- Domain-Specific Prompting

-- Building AI Agents path
(3, 3, 1),  -- Large Language Models Explained
(3, 9, 2),  -- Agent Fundamentals
(3, 10, 3), -- Tool Use and Function Calling
(3, 11, 4), -- Agent Memory Systems
(3, 12, 5), -- Multi-Agent Collaboration

-- Business AI Implementation path
(4, 13, 1), -- AI Opportunity Assessment
(4, 14, 2), -- Building AI Business Cases
(4, 15, 3), -- AI Project Management
(4, 16, 4), -- Change Management for AI

-- No-Code AI Automation path
(5, 4, 1),  -- Automation Design Principles
(5, 17, 2), -- Make.com Mastery
(5, 18, 3), -- Zapier Advanced Techniques
(5, 19, 4); -- n8n Workflow Automation

-- Connect Courses to Lessons
INSERT INTO course_lessons (course_id, lesson_id, sort_order) VALUES
-- Introduction to AI course
(1, 1, 1),  -- What is AI?
(1, 2, 2),  -- Types of AI Systems
(1, 3, 3),  -- AI vs ML vs DL
(1, 4, 4),  -- AI Ethics
(1, 5, 5),  -- Quiz

-- Prompt Engineering 101 course
(5, 6, 1),  -- Introduction to Prompt Engineering
(5, 7, 2),  -- Basic Prompting Patterns
(5, 8, 3),  -- Writing Clear Instructions
(5, 9, 4),  -- Hands-On Exercise

-- Tool Use and Function Calling course
(10, 10, 1), -- Understanding Tool-Augmented AI
(10, 11, 2), -- Function Calling Fundamentals

-- Make.com Mastery course
(17, 12, 1), -- Make.com Platform Overview
(17, 13, 2); -- Building Your First Scenario
