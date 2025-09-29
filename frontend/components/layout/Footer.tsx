import { Link } from 'react-router-dom';
import { Rocket, Mail, Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-jet-black border-t border-rocket-gray/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-vapor-purple/20 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-vapor-purple" />
              </div>
              <span className="text-xl font-bold text-cloud-white font-['Architects_Daughter']">
                Free Beer Studio
              </span>
            </div>
            <p className="text-rocket-gray max-w-md mb-6">
              We help businesses automate with artificial intelligence, creating smarter workflows and better customer experiences.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-rocket-gray hover:text-vapor-purple">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-rocket-gray hover:text-vapor-purple">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-rocket-gray hover:text-vapor-purple">
                <Github className="w-5 h-5" />
              </a>
              <a href="mailto:hello@freebeer.ai" className="text-rocket-gray hover:text-vapor-purple">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-cloud-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/pricing" className="text-rocket-gray hover:text-cloud-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-rocket-gray hover:text-cloud-white">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-rocket-gray hover:text-cloud-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-rocket-gray hover:text-cloud-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-cloud-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-rocket-gray">
                <span className="block">Email:</span>
                <a href="mailto:hello@freebeer.ai" className="text-vapor-purple hover:text-smoky-lavender">
                  hello@freebeer.ai
                </a>
              </li>
              <li className="text-rocket-gray">
                <span className="block">Business Hours:</span>
                <span>Mon-Fri 9AM-6PM CST</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-rocket-gray/20 mt-8 pt-8 text-center">
          <p className="text-rocket-gray">
            © {new Date().getFullYear()} Free Beer Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
