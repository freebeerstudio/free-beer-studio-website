-- Insert admin user
INSERT INTO users (id, email, role, auth_provider) VALUES 
('admin-1', 'hello@freebeer.ai', 'admin', 'email');

INSERT INTO profiles (user_id, plan_tier) VALUES 
('admin-1', 'admin');

-- Seed pricing items
INSERT INTO pricing_items (title, description, price, features, is_featured, sort_order) VALUES 
('Starter Pack', 'Perfect for small businesses getting started with AI automation', 499.00, '["AI-powered content creation", "Basic workflow automation", "Email support", "1 team member"]', false, 1),
('Growth Engine', 'Ideal for growing companies ready to scale with AI', 1299.00, '["Everything in Starter", "Advanced AI agents", "Custom integrations", "Priority support", "5 team members", "Analytics dashboard"]', true, 2),
('Enterprise Rocket', 'For large organizations needing full AI transformation', 2999.00, '["Everything in Growth", "Custom AI model training", "Dedicated success manager", "Unlimited team members", "White-label options", "SLA guarantee"]', false, 3),
('Custom Solution', 'Tailored AI automation for your unique needs', null, '["Fully customized solution", "Dedicated development team", "Enterprise integrations", "24/7 support", "Training included"]', false, 4);

-- Seed portfolio projects
INSERT INTO projects (title, description, cover_image_url, gallery, external_url, is_featured, sort_order) VALUES 
('E-commerce AI Assistant', 'Built an intelligent shopping assistant that increased customer engagement by 40% and sales by 25% for a major online retailer.', '/images/portfolio/ecommerce-ai.jpg', '[]', 'https://example-client.com', true, 1),
('Content Generation Pipeline', 'Automated content creation system that produces 100+ unique articles per week while maintaining brand voice and SEO optimization.', '/images/portfolio/content-pipeline.jpg', '[]', null, true, 2),
('Customer Service Bot', 'Developed a multilingual support bot that handles 80% of customer inquiries automatically, reducing response time from hours to seconds.', '/images/portfolio/support-bot.jpg', '[]', null, false, 3),
('Social Media Automation', 'Created an AI-powered social media management system that schedules, creates, and optimizes content across multiple platforms.', '/images/portfolio/social-automation.jpg', '[]', null, false, 4);

-- Seed blog posts
INSERT INTO blog_posts (title, subtitle, slug, cover_image_url, body, excerpt, status, published_at, author_id) VALUES 
('The Future of AI in Business Automation', 'How artificial intelligence is transforming the way we work', 'future-ai-business-automation', '/images/blog/ai-future.jpg', 
'# The Future of AI in Business Automation

Artificial intelligence is no longer a futuristic concept—it''s here, and it''s revolutionizing how businesses operate. In this comprehensive guide, we''ll explore the current state of AI automation and what the future holds.

## Current State of AI Automation

Today''s AI tools are capable of handling complex tasks that once required human intervention. From customer service chatbots to predictive analytics, businesses are finding innovative ways to leverage AI for competitive advantage.

## Key Benefits

- **Increased Efficiency**: AI can process data and complete tasks 24/7 without breaks
- **Cost Reduction**: Automated processes reduce the need for manual labor
- **Better Decision Making**: AI provides data-driven insights for strategic decisions
- **Scalability**: AI systems can easily scale with business growth

## What''s Next?

The future promises even more sophisticated AI capabilities, including advanced natural language processing, computer vision, and predictive modeling that will further transform business operations.',
'Discover how AI automation is reshaping business operations and what innovations are coming next in this comprehensive overview.',
'published', NOW() - INTERVAL '7 days', 'admin-1'),

('Building Your First AI Agent', 'A step-by-step guide to creating intelligent automation', 'building-first-ai-agent', '/images/blog/ai-agent.jpg',
'# Building Your First AI Agent

Creating your first AI agent might seem daunting, but with the right approach, it''s more accessible than you think. This guide will walk you through the essential steps.

## Planning Your Agent

Before diving into development, clearly define what you want your AI agent to accomplish:

- What specific tasks will it handle?
- What data sources will it need?
- How will it interact with users?

## Choosing the Right Tools

The AI landscape offers numerous tools and platforms. Consider factors like:

- **Ease of use**: How technical is your team?
- **Scalability**: Will the solution grow with your needs?
- **Integration**: How well does it work with your existing systems?

## Implementation Best Practices

1. Start simple and iterate
2. Test thoroughly with real data
3. Plan for edge cases
4. Monitor performance continuously

## Common Pitfalls to Avoid

- Overcomplicating the initial design
- Insufficient training data
- Poor error handling
- Neglecting user experience',
'Learn how to build your first AI agent with this practical, step-by-step guide covering planning, tools, and best practices.',
'published', NOW() - INTERVAL '14 days', 'admin-1'),

('AI Ethics in Automation', 'Navigating the responsible development of AI systems', 'ai-ethics-automation', '/images/blog/ai-ethics.jpg',
'# AI Ethics in Automation

As AI becomes more prevalent in business automation, it''s crucial to consider the ethical implications of these powerful technologies.

## Key Ethical Considerations

### Transparency
Users should understand when they''re interacting with AI systems and how decisions are made.

### Fairness
AI systems must be designed to avoid bias and provide equitable outcomes for all users.

### Privacy
Personal data must be protected and used responsibly in AI training and operations.

### Accountability
Clear lines of responsibility must be established for AI decisions and actions.

## Best Practices for Ethical AI

1. **Diverse Development Teams**: Include varied perspectives in AI development
2. **Regular Audits**: Continuously monitor AI systems for bias and errors
3. **Clear Policies**: Establish guidelines for AI use and development
4. **User Education**: Help users understand AI capabilities and limitations

## The Business Case for Ethical AI

Ethical AI isn''t just morally right—it''s good business:

- Builds trust with customers and stakeholders
- Reduces legal and regulatory risks
- Improves long-term sustainability
- Enhances brand reputation',
'Explore the important ethical considerations in AI automation and learn best practices for responsible AI development.',
'published', NOW() - INTERVAL '21 days', 'admin-1');

-- Seed style guides
INSERT INTO style_guides (platform, name, content, is_active) VALUES 
('blog', 'Free Beer Studio Blog Style', '# Blog Writing Style Guide

## Tone and Voice
- Professional yet approachable
- Technical but accessible
- Confident and authoritative
- Helpful and educational

## Content Structure
- Start with a compelling hook
- Use clear headings and subheadings
- Include practical examples
- End with actionable takeaways

## Technical Content
- Explain complex concepts simply
- Use analogies when helpful
- Include code examples when relevant
- Link to additional resources', true),

('substack', 'Substack Newsletter Style', '# Newsletter Style Guide

## Format
- Personal, conversational tone
- Shorter paragraphs for readability
- Include weekly insights
- Add personal anecdotes when relevant

## Content Mix
- 40% industry insights
- 30% practical tips
- 20% company updates
- 10% personal thoughts

## Call-to-Actions
- Encourage replies and engagement
- Share actionable next steps
- Invite newsletter sharing', true);

-- Seed feed sources
INSERT INTO feed_sources (url, type, name, is_active) VALUES 
('https://techcrunch.com/category/artificial-intelligence/feed/', 'rss', 'TechCrunch AI', true),
('https://venturebeat.com/ai/feed/', 'rss', 'VentureBeat AI', true),
('https://www.artificialintelligence-news.com/feed/', 'rss', 'AI News', true);

-- Seed some sample ideas
INSERT INTO ideas (input_type, input_value, title, canonical_url, summary, key_points, status) VALUES 
('url', 'https://techcrunch.com/2024/01/15/ai-automation-trends/', 'Latest AI Automation Trends Reshaping Industries', 'https://techcrunch.com/2024/01/15/ai-automation-trends/', 
'Recent developments in AI automation are transforming multiple industries, with particular emphasis on intelligent process automation and machine learning integration. Companies are increasingly adopting AI-powered solutions to streamline operations, reduce costs, and improve customer experiences across various sectors.',
'["Intelligent process automation gaining widespread adoption", "Machine learning integration becoming standard practice", "Cost reduction and efficiency improvements driving adoption", "Customer experience enhancement through AI tools"]',
'new'),

('text', 'The importance of ethical AI development in business automation cannot be overstated. As companies integrate more AI systems, they must consider bias, transparency, and accountability.', 
'Ethical Considerations in Business AI Implementation', null,
'As businesses rapidly adopt AI automation technologies, the importance of ethical development practices becomes paramount. Organizations must address potential bias in algorithms, ensure transparency in AI decision-making processes, and establish clear accountability frameworks to maintain trust and compliance.',
'["Algorithm bias prevention is critical for fair outcomes", "Transparency builds user trust and regulatory compliance", "Clear accountability frameworks essential for responsible AI", "Ethical AI practices support long-term business sustainability"]',
'new'),

('url', 'https://example.com/ai-future-workforce', 'How AI Will Transform the Future Workforce', 'https://example.com/ai-future-workforce',
'The integration of artificial intelligence into workplace environments is creating new opportunities while reshaping traditional job roles. Rather than replacing humans entirely, AI is augmenting human capabilities and creating demand for new skill sets focused on human-AI collaboration.',
'["AI augments rather than replaces human workers", "New skill requirements emerging for AI collaboration", "Reskilling and upskilling become business priorities", "Human creativity and emotional intelligence remain valuable"]',
'approved');

-- Seed app settings
INSERT INTO app_settings (key, value, description) VALUES 
('site_title', '"Free Beer Studio"', 'Main site title'),
('site_description', '"AI Automation Agency - We help businesses automate with artificial intelligence"', 'Site meta description'),
('contact_email', '"hello@freebeer.ai"', 'Primary contact email for forms'),
('openai_model', '"gpt-4o-mini"', 'Default OpenAI model for content generation'),
('newsletter_enabled', 'true', 'Enable newsletter signup functionality'),
('analytics_enabled', 'true', 'Enable analytics tracking');
