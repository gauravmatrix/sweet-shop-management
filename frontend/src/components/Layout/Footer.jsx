import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Github, 
  Twitter, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin,
  Shield,
  CreditCard,
  Truck,
  Package
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Shop: [
      { name: 'All Sweets', path: '/sweets' },
      { name: 'Chocolate', path: '/sweets?category=chocolate' },
      { name: 'Candy', path: '/sweets?category=candy' },
      { name: 'Indian Sweets', path: '/sweets?category=indian' },
      { name: 'Featured Items', path: '/sweets?featured=true' },
    ],
    Support: [
      { name: 'Help Center', path: '/help' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'Shipping Info', path: '/shipping' },
      { name: 'Returns & Exchanges', path: '/returns' },
      { name: 'FAQs', path: '/faq' },
    ],
    Company: [
      { name: 'About Us', path: '/about' },
      { name: 'Careers', path: '/careers' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Blog', path: '/blog' },
    ],
    Features: [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Inventory', path: '/sweets' },
      { name: 'Reports', path: '/reports' },
      { name: 'Admin Panel', path: '/admin/dashboard' },
      { name: 'API Docs', path: '/swagger' },
    ],
  };

  const features = [
    {
      icon: <Shield size={24} />,
      title: 'Secure Payments',
      description: '100% secure & encrypted transactions'
    },
    {
      icon: <Truck size={24} />,
      title: 'Fast Delivery',
      description: 'Free delivery on orders above ₹499'
    },
    {
      icon: <Package size={24} />,
      title: 'Quality Guarantee',
      description: 'Fresh sweets with quality assurance'
    },
    {
      icon: <CreditCard size={24} />,
      title: 'Easy Returns',
      description: '30-day return policy'
    }
  ];

  return (
    <footer className="bg-gradient-to-b from-sweet-dark to-sweet-dark/95 text-white mt-16">
      {/* Feature Strip */}
      <div className="bg-gradient-to-r from-sweet-primary/20 to-sweet-accent/20 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="text-sweet-accent">
                    {feature.icon}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                  <p className="text-sm text-white/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-sweet-primary to-sweet-accent rounded-xl">
                <Package className="text-white" size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-heading font-bold">
                  Sweet Shop 🍬
                </h2>
                <p className="text-white/80">Management System</p>
              </div>
            </div>
            <p className="text-white/70 mb-6 max-w-md">
              Your one-stop solution for managing sweet inventory, purchases, and 
              customer relationships. Made with ❤️ for sweet lovers worldwide.
            </p>
            <div className="flex space-x-4 mb-6">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="mailto:contact@sweetshop.com"
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xl font-semibold mb-4 text-white">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-white/70 hover:text-sweet-accent transition-colors flex items-center space-x-2"
                    >
                      <span className="w-1.5 h-1.5 bg-sweet-accent rounded-full opacity-0 group-hover:opacity-100"></span>
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Phone className="text-sweet-accent" size={20} />
              </div>
              <div>
                <p className="text-sm text-white/70">Call Us</p>
                <p className="font-semibold">+91 98765 43210</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Mail className="text-sweet-accent" size={20} />
              </div>
              <div>
                <p className="text-sm text-white/70">Email Us</p>
                <p className="font-semibold">contact@sweetshop.com</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <MapPin className="text-sweet-accent" size={20} />
              </div>
              <div>
                <p className="text-sm text-white/70">Visit Us</p>
                <p className="font-semibold">123 Sweet Street, Mumbai</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="text-white/70">Made with</span>
            <Heart className="text-red-500 fill-current" size={16} />
            <span className="text-white/70">by Sweet Shop Team</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <p className="text-sm text-white/70">
              © {currentYear} Sweet Shop Management System. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <Link to="/privacy" className="text-white/70 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-white/70 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-white/70 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Tech Stack Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <span className="px-3 py-1 bg-sweet-primary/20 text-sweet-primary rounded-full text-xs font-medium">
            React 18
          </span>
          <span className="px-3 py-1 bg-sweet-secondary/20 text-sweet-secondary rounded-full text-xs font-medium">
            Django REST
          </span>
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium">
            PostgreSQL
          </span>
          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
            Tailwind CSS
          </span>
          <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-xs font-medium">
            JWT Auth
          </span>
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
            React Query
          </span>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 p-3 bg-gradient-to-r from-sweet-primary to-sweet-accent text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-40"
        aria-label="Back to top"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;