import { Link } from 'react-router-dom';
import { CheckCircle, Rocket, Users, Zap, TrendingUp, BookOpen, Code, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

export default function LearnPage() {
  const features = [
    {
      icon: BookOpen,
      title: 'Complete Learning Platform',
      description: 'Access comprehensive strategies, cutting-edge tools, and resources to master AI automation.',
    },
    {
      icon: Users,
      title: 'Expert Mentorship',
      description: 'Learn from professional AI operators who have built successful automation businesses.',
    },
    {
      icon: Code,
      title: 'Ready-to-Use Tools',
      description: 'Client-ready templates, prompts, and automation workflows you can deploy immediately.',
    },
    {
      icon: TrendingUp,
      title: 'Business Growth Support',
      description: 'Get help acquiring clients and scaling your AI automation practice.',
    },
    {
      icon: Zap,
      title: 'Hands-On Projects',
      description: 'Build real-world automations and AI solutions through practical exercises.',
    },
    {
      icon: Lightbulb,
      title: 'Innovation Community',
      description: 'Join a thriving community of AI practitioners and entrepreneurs.',
    },
  ];

  const curriculum = [
    { week: 1, title: 'AI Fundamentals', description: 'Understanding AI, ML basics, and automation principles' },
    { week: 2, title: 'Prompt Engineering', description: 'Master the art of crafting effective AI prompts' },
    { week: 3, title: 'Workflow Automation', description: 'Build automated systems using modern AI tools' },
    { week: 4, title: 'Agent Development', description: 'Create intelligent agents that work autonomously' },
    { week: 5, title: 'Business Strategy', description: 'Position yourself as an AI automation expert' },
    { week: 6, title: 'Client Acquisition', description: 'Build your pipeline and land your first clients' },
    { week: 7, title: 'Project Delivery', description: 'Execute projects efficiently and professionally' },
    { week: 8, title: 'Scaling Your Practice', description: 'Grow your business and automate your operations' },
  ];

  const careerPaths = [
    {
      title: 'Builders',
      description: 'Create AI-powered products and MVPs',
      icon: Code,
      skills: ['Product Development', 'System Architecture', 'API Integration', 'No-Code Platforms'],
    },
    {
      title: 'Automators',
      description: 'Design and implement business automations',
      icon: Zap,
      skills: ['Process Optimization', 'Workflow Design', 'Integration Strategy', 'Efficiency Gains'],
    },
    {
      title: 'Consultants',
      description: 'Guide businesses through AI transformation',
      icon: Lightbulb,
      skills: ['Strategy Development', 'Change Management', 'Training & Adoption', 'ROI Analysis'],
    },
  ];

  const tools = [
    'OpenAI', 'Anthropic Claude', 'Make.com', 'n8n', 'Zapier',
    'Cursor', 'GitHub Copilot', 'Perplexity', 'ChatGPT', 'Gemini',
    'Airtable', 'Notion', 'Slack', 'Discord',
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Former Marketing Manager',
      company: 'Tech Startup',
      quote: 'Within 3 months of starting the program, I landed my first client and built a $5K/month automation that saves them 20 hours weekly. The mentorship was invaluable.',
      image: 'https://i.pravatar.cc/150?img=1',
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Independent Consultant',
      company: 'AI Solutions',
      quote: 'The curriculum took me from AI curious to AI confident. Now I\'m running a 6-figure automation practice and helping businesses transform their operations.',
      image: 'https://i.pravatar.cc/150?img=13',
    },
    {
      name: 'Emily Taylor',
      role: 'Business Coach',
      company: 'Growth Partners',
      quote: 'Learning to build AI automations completely changed my coaching practice. I can now offer so much more value to my clients and charge premium rates.',
      image: 'https://i.pravatar.cc/150?img=5',
    },
  ];

  return (
    <div className="min-h-screen bg-jet-black text-cloud-white">
      <Header />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-vapor-purple/10 to-smoky-lavender/10"></div>
        <div className="relative py-20 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge className="mb-6 bg-launch-orange/20 text-launch-orange border-launch-orange">
                Next Cohort Starts Soon
              </Badge>
              <h1 className="text-4xl sm:text-6xl font-bold font-['Architects_Daughter'] mb-6">
                Master <span className="text-launch-orange">AI Automation</span>
                <br />
                Build Your Future
              </h1>
              <p className="text-xl sm:text-2xl text-rocket-gray max-w-3xl mx-auto mb-8">
                Transform your career with comprehensive AI automation training, expert mentorship, and a thriving community of innovators.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="bg-launch-orange hover:bg-launch-orange/90 text-jet-black font-bold"
                  asChild
                >
                  <Link to="/contact">Apply Now</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-vapor-purple text-vapor-purple hover:bg-vapor-purple/10"
                >
                  Learn More
                </Button>
              </div>
              <div className="mt-12 flex items-center justify-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 5, 8, 9, 10, 12].map((i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/40?img=${i}`}
                      alt="Student"
                      className="w-10 h-10 rounded-full border-2 border-jet-black"
                    />
                  ))}
                </div>
                <span className="text-rocket-gray">Trusted by 500+ AI Practitioners</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What You Get Section */}
      <div className="py-20 bg-gray-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold font-['Architects_Daughter'] mb-4">
              What You <span className="text-vapor-purple">Get</span>
            </h2>
            <p className="text-xl text-rocket-gray max-w-2xl mx-auto">
              Everything you need to launch and grow a successful AI automation practice
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-gray-900/50 border-vapor-purple/30 hover:border-vapor-purple/60 transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-vapor-purple/20 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-vapor-purple" />
                    </div>
                    <CardTitle className="text-cloud-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-rocket-gray">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Market Opportunity */}
      <div className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold font-['Architects_Daughter'] mb-4">
              The AI <span className="text-launch-orange">Opportunity</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-vapor-purple/10 to-smoky-lavender/10 border-vapor-purple/30 text-center">
              <CardHeader>
                <div className="text-5xl font-bold text-launch-orange mb-2">$260B</div>
                <CardTitle className="text-cloud-white">Market Size by 2033</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-rocket-gray">
                  The AI automation market is experiencing explosive growth
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-vapor-purple/10 to-smoky-lavender/10 border-vapor-purple/30 text-center">
              <CardHeader>
                <div className="text-5xl font-bold text-vapor-purple mb-2">$200+</div>
                <CardTitle className="text-cloud-white">Hourly Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-rocket-gray">
                  Average rates for skilled AI automation consultants
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-vapor-purple/10 to-smoky-lavender/10 border-vapor-purple/30 text-center">
              <CardHeader>
                <div className="text-5xl font-bold text-smoky-lavender mb-2">85%</div>
                <CardTitle className="text-cloud-white">Business Need</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-rocket-gray">
                  Of businesses are actively seeking AI automation solutions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Career Paths */}
      <div className="py-20 bg-gray-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold font-['Architects_Daughter'] mb-4">
              Choose Your <span className="text-vapor-purple">Path</span>
            </h2>
            <p className="text-xl text-rocket-gray max-w-2xl mx-auto">
              Three proven career paths for AI automation professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {careerPaths.map((path, index) => {
              const Icon = path.icon;
              return (
                <Card key={index} className="bg-gray-900/50 border-vapor-purple/30 hover:border-launch-orange/60 transition-all duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full bg-launch-orange/20 flex items-center justify-center mb-4 mx-auto">
                      <Icon className="w-8 h-8 text-launch-orange" />
                    </div>
                    <CardTitle className="text-cloud-white text-center text-2xl">{path.title}</CardTitle>
                    <CardDescription className="text-rocket-gray text-center">
                      {path.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {path.skills.map((skill, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-vapor-purple flex-shrink-0" />
                          <span className="text-sm text-rocket-gray">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold font-['Architects_Daughter'] mb-4">
              8-Week <span className="text-launch-orange">Program</span>
            </h2>
            <p className="text-xl text-rocket-gray max-w-2xl mx-auto">
              Structured curriculum designed to take you from beginner to expert
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {curriculum.map((item) => (
              <Card key={item.week} className="bg-gradient-to-br from-vapor-purple/5 to-smoky-lavender/5 border-vapor-purple/30 hover:border-vapor-purple/60 transition-all duration-300">
                <CardHeader>
                  <Badge className="w-fit bg-launch-orange/20 text-launch-orange border-launch-orange mb-2">
                    Week {item.week}
                  </Badge>
                  <CardTitle className="text-cloud-white text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-rocket-gray">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Tools & Technologies */}
      <div className="py-20 bg-gray-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold font-['Architects_Daughter'] mb-4">
              Master the <span className="text-vapor-purple">Stack</span>
            </h2>
            <p className="text-xl text-rocket-gray max-w-2xl mx-auto">
              Learn to work with cutting-edge AI tools and platforms
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {tools.map((tool, index) => (
              <Badge 
                key={index} 
                className="px-6 py-3 bg-gray-900/50 border-vapor-purple/30 text-cloud-white hover:border-vapor-purple/60 transition-all"
              >
                {tool}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold font-['Architects_Daughter'] mb-4">
              Success <span className="text-launch-orange">Stories</span>
            </h2>
            <p className="text-xl text-rocket-gray max-w-2xl mx-auto">
              Hear from graduates who transformed their careers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-900/50 border-vapor-purple/30">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full border-2 border-vapor-purple"
                    />
                    <div>
                      <div className="font-bold text-cloud-white">{testimonial.name}</div>
                      <div className="text-sm text-rocket-gray">{testimonial.role}</div>
                      <div className="text-xs text-vapor-purple">{testimonial.company}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-rocket-gray italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-vapor-purple/10 to-smoky-lavender/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 rounded-full bg-launch-orange/20 flex items-center justify-center mx-auto mb-8">
            <Rocket className="w-10 h-10 text-launch-orange" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-['Architects_Daughter'] mb-6">
            Ready to <span className="text-launch-orange">Launch</span> Your AI Career?
          </h2>
          <p className="text-xl text-rocket-gray mb-8 max-w-2xl mx-auto">
            Join the next cohort and start building your future in AI automation. Limited spots available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-launch-orange hover:bg-launch-orange/90 text-jet-black font-bold text-lg px-8"
              asChild
            >
              <Link to="/contact">Apply for Next Cohort</Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-vapor-purple text-vapor-purple hover:bg-vapor-purple/10 text-lg px-8"
              asChild
            >
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
