import { Link } from 'react-router-dom';
import { Bot, Sparkles, Workflow, Clock, TrendingUp, Users, CheckCircle2, ArrowRight, Zap, Target, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

export default function AutomatePage() {
  return (
    <div className="min-h-screen bg-jet-black text-cloud-white">
      <Header />

      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-vapor-purple/10 via-launch-orange/5 to-transparent"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8 flex justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-launch-orange to-vapor-purple flex items-center justify-center shadow-2xl shadow-launch-orange/25">
                <Bot className="w-12 h-12 text-cloud-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-['Architects_Daughter'] mb-6">
              Transform Your Business
              <span className="block text-launch-orange">With AI Automation</span>
            </h1>
            <p className="text-xl sm:text-2xl text-rocket-gray max-w-3xl mx-auto mb-8">
              Harness the power of artificial intelligence to streamline operations, reduce costs, and unlock new growth opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/contact">
                <Button size="lg" className="bg-white border-2 border-black text-black hover:bg-black/10 shadow-[0_4px_14px_rgb(0,0,0,0.25)]">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/portfolio">
                <Button size="lg" className="bg-white border-2 border-black text-black hover:bg-black/10 shadow-[0_4px_14px_rgb(0,0,0,0.25)]">
                  View Success Stories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-rocket-gray/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-['Architects_Daughter'] mb-4">
              The Power of AI Automation
            </h2>
            <p className="text-xl text-rocket-gray max-w-2xl mx-auto">
              Discover how intelligent automation transforms every aspect of your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-vapor-purple/5 border-2 border-vapor-purple/40 shadow-lg">
              <div className="w-16 h-16 rounded-full bg-vapor-purple/20 flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-vapor-purple" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-black">Save Time</h3>
              <p className="text-black">
                Automate repetitive tasks and free your team to focus on high-value strategic work that drives growth.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-launch-orange/5 border-2 border-launch-orange/40 shadow-lg">
              <div className="w-16 h-16 rounded-full bg-launch-orange/20 flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-launch-orange" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-black">Increase Efficiency</h3>
              <p className="text-black">
                Process more work with fewer errors, reducing operational costs while improving output quality.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-smoky-lavender/5 border-2 border-smoky-lavender/40 shadow-lg">
              <div className="w-16 h-16 rounded-full bg-smoky-lavender/20 flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-smoky-lavender" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-black">Enhance Customer Experience</h3>
              <p className="text-black">
                Deliver faster, more personalized service with AI-powered customer interactions and insights.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-launch-orange/5 border-2 border-launch-orange/40 shadow-lg">
              <div className="w-16 h-16 rounded-full bg-launch-orange/20 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-launch-orange" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-black">Intelligent Insights</h3>
              <p className="text-black">
                Make data-driven decisions with AI-powered analytics that uncover hidden patterns and opportunities.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-vapor-purple/5 border-2 border-vapor-purple/40 shadow-lg">
              <div className="w-16 h-16 rounded-full bg-vapor-purple/20 flex items-center justify-center mb-4">
                <Workflow className="w-8 h-8 text-vapor-purple" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-black">Seamless Integration</h3>
              <p className="text-black">
                Connect AI automation with your existing tools and workflows for effortless implementation.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-smoky-lavender/5 border-2 border-smoky-lavender/40 shadow-lg">
              <div className="w-16 h-16 rounded-full bg-smoky-lavender/20 flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-smoky-lavender" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-black">Scale with Confidence</h3>
              <p className="text-black">
                Grow your business without proportionally growing your operational overhead and costs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-['Architects_Daughter'] mb-4">
              Our AI Automation Solutions
            </h2>
            <p className="text-xl text-rocket-gray max-w-2xl mx-auto">
              Custom-built intelligent systems designed for your unique business needs
            </p>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="w-12 h-12 rounded-full bg-vapor-purple/20 flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6 text-vapor-purple" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-black">Intelligent Chatbots & Virtual Assistants</h3>
                <p className="text-black mb-4">
                  Deploy AI-powered conversational agents that handle customer inquiries 24/7, qualify leads, and provide instant support across multiple channels.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-vapor-purple mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-black">Natural language understanding</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-vapor-purple mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-black">Multi-language support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-vapor-purple mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-black">Seamless handoff to human agents</span>
                  </li>
                </ul>
              </div>
              <div className="h-64 rounded-xl bg-gradient-to-br from-vapor-purple/20 to-smoky-lavender/20 border-2 border-vapor-purple/40 flex items-center justify-center">
                <Bot className="w-32 h-32 text-vapor-purple opacity-50" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="order-2 lg:order-1 h-64 rounded-xl bg-gradient-to-br from-launch-orange/20 to-vapor-purple/20 border-2 border-launch-orange/40 flex items-center justify-center">
                <Workflow className="w-32 h-32 text-launch-orange opacity-50" />
              </div>
              <div className="order-1 lg:order-2">
                <div className="w-12 h-12 rounded-full bg-launch-orange/20 flex items-center justify-center mb-4">
                  <Workflow className="w-6 h-6 text-launch-orange" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-black">Process Automation</h3>
                <p className="text-black mb-4">
                  Streamline complex workflows with intelligent automation that learns and adapts to your business processes.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-launch-orange mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-black">Document processing & data extraction</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-launch-orange mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-black">Automated reporting & analytics</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-launch-orange mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-black">Workflow orchestration</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="w-12 h-12 rounded-full bg-smoky-lavender/20 flex items-center justify-center mb-4">
                  <Lightbulb className="w-6 h-6 text-smoky-lavender" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-black">Predictive Analytics & Insights</h3>
                <p className="text-black mb-4">
                  Leverage machine learning to forecast trends, identify opportunities, and make proactive business decisions.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-smoky-lavender mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-black">Customer behavior prediction</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-smoky-lavender mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-black">Sales forecasting</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-smoky-lavender mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-black">Risk assessment & fraud detection</span>
                  </li>
                </ul>
              </div>
              <div className="h-64 rounded-xl bg-gradient-to-br from-smoky-lavender/20 to-vapor-purple/20 border-2 border-smoky-lavender/40 flex items-center justify-center">
                <Lightbulb className="w-32 h-32 text-smoky-lavender opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-rocket-gray/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-['Architects_Daughter'] mb-4">
              How We Work
            </h2>
            <p className="text-xl text-rocket-gray max-w-2xl mx-auto">
              Our proven process for delivering AI automation solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-vapor-purple text-cloud-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-2 text-black">Discover</h3>
              <p className="text-black">
                We analyze your workflows to identify automation opportunities and define success metrics.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-launch-orange text-cloud-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-2 text-black">Design</h3>
              <p className="text-black">
                Create a custom AI solution architecture tailored to your specific needs and systems.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-smoky-lavender text-cloud-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-2 text-black">Deploy</h3>
              <p className="text-black">
                Implement and integrate the solution with comprehensive testing and team training.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-vapor-purple text-cloud-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-bold mb-2 text-black">Optimize</h3>
              <p className="text-black">
                Continuously monitor, refine, and enhance the system for maximum performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-vapor-purple/10 to-smoky-lavender/10 rounded-2xl p-8 lg:p-12 border-2 border-black shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <Zap className="w-12 h-12 text-launch-orange mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold font-['Architects_Daughter'] mb-4 text-black">
              Ready to Automate Your Success?
            </h2>
            <p className="text-xl text-black mb-8 max-w-2xl mx-auto">
              Let's discuss how AI automation can transform your business operations and drive exponential growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-white border-2 border-black text-black hover:bg-black/10 shadow-[0_4px_14px_rgb(0,0,0,0.25)]">
                  Schedule a Consultation
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" className="bg-white border-2 border-black text-black hover:bg-black/10 shadow-[0_4px_14px_rgb(0,0,0,0.25)]">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
