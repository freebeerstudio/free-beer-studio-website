import { Link } from 'react-router-dom';
import { Rocket, Zap, Target, ArrowRight, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-jet-black text-cloud-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-vapor-purple/10 to-transparent"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8 flex justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-vapor-purple to-smoky-lavender flex items-center justify-center shadow-2xl shadow-vapor-purple/25">
                <Rocket className="w-12 h-12 text-cloud-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-['Architects_Daughter'] mb-6">
              Launch Your Business
              <span className="block text-launch-orange">Into the AI Future</span>
            </h1>
            <p className="text-xl sm:text-2xl text-rocket-gray max-w-3xl mx-auto mb-8">
              We help businesses automate with artificial intelligence, creating smarter workflows and better customer experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/contact">
                <Button size="lg" className="bg-white border-2 border-black text-black hover:bg-black/10 shadow-[0_4px_14px_rgb(0,0,0,0.25)]">
                  Get Your Quote
                </Button>
              </Link>
              <Link to="/portfolio">
                <Button size="lg" className="bg-white border-2 border-black text-black hover:bg-black/10 shadow-[0_4px_14px_rgb(0,0,0,0.25)]">
                  View Our Work
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-rocket-gray/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-['Architects_Daughter'] mb-4">
              Why Choose Free Beer Studio?
            </h2>
            <p className="text-xl text-rocket-gray max-w-2xl mx-auto">
              We combine cutting-edge AI technology with practical business solutions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-vapor-purple/5 border-2 border-vapor-purple/40 shadow-lg">
              <div className="w-16 h-16 rounded-full bg-vapor-purple/20 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-vapor-purple" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-black">Lightning Fast</h3>
              <p className="text-black">
                Rapid deployment of AI solutions that start delivering value from day one.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-launch-orange/5 border-2 border-launch-orange/40 shadow-lg">
              <div className="w-16 h-16 rounded-full bg-launch-orange/20 flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-launch-orange" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-black">Precision Focused</h3>
              <p className="text-black">
                Tailored solutions that address your specific business challenges and goals.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-smoky-lavender/5 border-2 border-smoky-lavender/40 shadow-lg">
              <div className="w-16 h-16 rounded-full bg-smoky-lavender/20 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-smoky-lavender" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-black">Human-Centered</h3>
              <p className="text-black">
                AI that enhances human capabilities rather than replacing them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-vapor-purple/10 to-smoky-lavender/10 rounded-2xl p-8 lg:p-12 border-2 border-vapor-purple/40 shadow-lg">
            <Star className="w-12 h-12 text-launch-orange mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold font-['Architects_Daughter'] mb-4 text-black">
              Stay Ahead of the AI Curve
            </h2>
            <p className="text-xl text-black mb-8 max-w-2xl mx-auto">
              Get weekly insights on AI automation, industry trends, and practical tips delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-jet-black border-rocket-gray text-cloud-white"
              />
              <Button type="submit" className="bg-launch-orange hover:bg-launch-orange/80">
                Subscribe
              </Button>
            </form>
            <p className="text-sm text-black mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-vapor-purple/10 to-smoky-lavender/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-['Architects_Daughter'] mb-4">
            Ready to Launch Your AI Journey?
          </h2>
          <p className="text-xl text-rocket-gray mb-8 max-w-2xl mx-auto">
            Let's discuss how we can transform your business with intelligent automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-launch-orange hover:bg-launch-orange/80">
                Start Your Project
              </Button>
            </Link>
            <Link to="/portfolio">
              <Button size="lg" variant="outline" className="border-cloud-white text-cloud-white hover:bg-cloud-white/10">
                View Case Studies
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
