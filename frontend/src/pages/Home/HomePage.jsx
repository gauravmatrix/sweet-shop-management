import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { sweetAPI } from '../../services/api';
import { 
  Candy, ShoppingBag, BarChart3, Users, Shield, 
  Zap, TrendingUp, Star, Gift, Sparkles, ArrowRight,
  Package, CheckCircle
} from 'lucide-react';

const HomePage = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [featuredSweets, setFeaturedSweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [statsRes, featuredRes] = await Promise.all([
        sweetAPI.getStats(),
        sweetAPI.getFeatured()
      ]);
      
      setStats(statsRes.data);
      setFeaturedSweets(featuredRes.data.results || featuredRes.data);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <ShoppingBag className="text-sweet-primary" size={24} />,
      title: 'Easy Inventory Management',
      description: 'Track and manage your sweet inventory with real-time updates.',
      color: 'from-sweet-primary/20 to-pink-100'
    },
    {
      icon: <BarChart3 className="text-sweet-secondary" size={24} />,
      title: 'Smart Analytics',
      description: 'Get insights with detailed sales and inventory reports.',
      color: 'from-sweet-secondary/20 to-emerald-100'
    },
    {
      icon: <Users className="text-sweet-accent" size={24} />,
      title: 'Multi-User Access',
      description: 'Collaborate with your team with role-based permissions.',
      color: 'from-sweet-accent/20 to-yellow-100'
    },
    {
      icon: <Shield className="text-purple-500" size={24} />,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with regular backups.',
      color: 'from-purple-500/20 to-purple-100'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Account',
      description: 'Sign up in under 2 minutes',
      icon: '👤'
    },
    {
      number: '02',
      title: 'Add Your Sweets',
      description: 'Upload your sweet inventory',
      icon: '🍬'
    },
    {
      number: '03',
      title: 'Start Managing',
      description: 'Track purchases and stock',
      icon: '📊'
    },
    {
      number: '04',
      title: 'Grow Business',
      description: 'Use insights to expand',
      icon: '🚀'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sweet-primary"></div>
          <p className="mt-4 text-sweet-dark font-sweet">Loading sweet goodness... 🍬</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sweet-primary via-pink-500 to-sweet-accent py-20 lg:py-32">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-48 -translate-x-48"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
              <Sparkles className="text-white" size={20} />
              <span className="text-white font-semibold">Trusted by Sweet Shops Worldwide</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Manage Your <span className="text-yellow-300">Sweet Shop</span> Like Never Before
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/90 mb-10 max-w-3xl mx-auto">
              The complete solution for inventory management, sales tracking, and business growth.
              Everything you need to run a successful sweet shop in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <Link
                  to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-sweet-primary text-lg font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-sweet-primary text-lg font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2" size={20} />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white text-lg font-bold rounded-xl hover:bg-white/10 transition-all duration-300"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
            
            <div className="mt-12 flex items-center justify-center space-x-8 text-white/80">
              <div className="flex items-center space-x-2">
                <CheckCircle size={20} />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle size={20} />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle size={20} />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="py-16 bg-sweet-light">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-sweet-light">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-sweet-primary/10 rounded-lg">
                    <Package className="text-sweet-primary" size={24} />
                  </div>
                  <TrendingUp className="text-green-500" size={20} />
                </div>
                <h3 className="text-3xl font-bold text-sweet-dark mb-2">
                  {stats.total_sweets?.toLocaleString() || '0'}
                </h3>
                <p className="text-sweet-dark/70">Total Sweets</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-sweet-light">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-sweet-secondary/10 rounded-lg">
                    <ShoppingBag className="text-sweet-secondary" size={24} />
                  </div>
                  <Zap className="text-yellow-500" size={20} />
                </div>
                <h3 className="text-3xl font-bold text-sweet-dark mb-2">
                  ₹{stats.total_value ? parseInt(stats.total_value).toLocaleString() : '0'}
                </h3>
                <p className="text-sweet-dark/70">Inventory Value</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-sweet-light">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-sweet-accent/10 rounded-lg">
                    <BarChart3 className="text-sweet-accent" size={24} />
                  </div>
                  <Star className="text-blue-500" size={20} />
                </div>
                <h3 className="text-3xl font-bold text-sweet-dark mb-2">
                  {stats.in_stock?.toLocaleString() || '0'}
                </h3>
                <p className="text-sweet-dark/70">In Stock Items</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-sweet-light">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <Users className="text-purple-500" size={24} />
                  </div>
                  <Gift className="text-pink-500" size={20} />
                </div>
                <h3 className="text-3xl font-bold text-sweet-dark mb-2">
                  {stats.by_category?.length || '0'}
                </h3>
                <p className="text-sweet-dark/70">Categories</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-sweet-dark mb-6">
              Everything You Need to <span className="text-sweet-primary">Succeed</span>
            </h2>
            <p className="text-xl text-sweet-dark/70">
              Powerful features designed specifically for sweet shop owners and managers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`bg-gradient-to-br ${feature.color} p-6 rounded-2xl border border-white/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl`}
              >
                <div className="mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-sweet-dark mb-3">
                  {feature.title}
                </h3>
                <p className="text-sweet-dark/70">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Sweets */}
      {featuredSweets.length > 0 && (
        <section className="py-20 bg-sweet-light/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold text-sweet-dark mb-4">
                  Featured <span className="text-sweet-primary">Sweets</span>
                </h2>
                <p className="text-sweet-dark/70">
                  Our most popular and delicious sweets
                </p>
              </div>
              <Link
                to="/sweets"
                className="inline-flex items-center space-x-2 sweet-btn-primary"
              >
                <span>View All</span>
                <ArrowRight size={20} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredSweets.slice(0, 3).map((sweet) => (
                <div key={sweet.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="h-48 bg-gradient-to-r from-sweet-primary/20 to-sweet-accent/20 flex items-center justify-center">
                    <Candy size={64} className="text-sweet-primary/50" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-sweet-dark">{sweet.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        sweet.category === 'chocolate' ? 'badge-chocolate' :
                        sweet.category === 'candy' ? 'badge-candy' :
                        sweet.category === 'cake' ? 'badge-cake' :
                        sweet.category === 'cookie' ? 'badge-cookie' :
                        sweet.category === 'dessert' ? 'badge-dessert' : 'badge-indian'
                      }`}>
                        {sweet.category_display || sweet.category}
                      </span>
                    </div>
                    <p className="text-sweet-dark/70 mb-4 line-clamp-2">
                      {sweet.description || 'Delicious sweet treat'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-sweet-primary">
                          ₹{sweet.price}
                        </span>
                        <span className="text-sm text-sweet-dark/50 ml-2">per piece</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        sweet.quantity > 10 ? 'badge-available' :
                        sweet.quantity > 0 ? 'badge-low-stock' : 'badge-out-of-stock'
                      }`}>
                        {sweet.quantity > 10 ? 'In Stock' : sweet.quantity > 0 ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-sweet-dark mb-6">
              Get Started in <span className="text-sweet-primary">4 Easy Steps</span>
            </h2>
            <p className="text-xl text-sweet-dark/70">
              Simple setup, powerful results
            </p>
          </div>
          
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-sweet-primary via-sweet-secondary to-sweet-accent transform -translate-y-1/2"></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-sweet-primary to-sweet-accent rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 relative z-10">
                    {step.icon}
                  </div>
                  <div className="text-5xl font-bold text-sweet-light mb-4">{step.number}</div>
                  <h3 className="text-xl font-bold text-sweet-dark mb-3">{step.title}</h3>
                  <p className="text-sweet-dark/70">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/register"
              className="inline-flex items-center space-x-3 sweet-btn-primary px-8 py-4 text-lg"
            >
              <Candy size={24} />
              <span>Start Your Sweet Journey</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-sweet-primary to-sweet-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Sweet Shop?
            </h2>
            <p className="text-xl text-white/90 mb-10">
              Join thousands of sweet shop owners who are already managing their business smarter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-sweet-primary text-lg font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
              >
                Start Free Trial
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white text-lg font-bold rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                Schedule a Demo
              </Link>
            </div>
            <p className="text-white/70 mt-6 text-sm">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;