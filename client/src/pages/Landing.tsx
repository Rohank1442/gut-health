import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Activity, 
  TrendingUp, 
  Sparkles, 
  Brain, 
  Target, 
  CheckCircle2, 
  BarChart3 
} from 'lucide-react';

export default function LandingPage() {
  // Initialize the navigate function
  const navigate = useNavigate();

  // Helper function to handle navigation
  const handleStartClick = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Track Your Gut Health Journey with AI-Powered Insights
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your digestive wellness with intelligent food tracking, personalized gut health scores, 
            and science-backed recommendations. Understand your fiber intake, probiotic consumption, and food diversity—all in one place.
          </p>
          <button 
            onClick={handleStartClick}
            className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition inline-flex items-center gap-2"
          >
            Start Tracking Free <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-sm text-gray-500 mt-4">No credit card required • Free forever</p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything You Need for Better Digestive Health
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 border border-gray-200 rounded-lg">
            <Activity className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Daily Gut Score</h3>
            <p className="text-gray-600">
              Get an instant gut health score (0-100) based on your daily food intake. Our AI analyzes your fiber, 
              probiotics, food diversity, and processed food consumption to give you actionable insights.
            </p>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg">
            <BarChart3 className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Comprehensive Tracking</h3>
            <p className="text-gray-600">
              Monitor 6 key gut health metrics: fiber intake (grams), food diversity score, probiotic consumption, 
              processed food levels, and digestive comfort—all automatically calculated from your food diary.
            </p>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg">
            <Sparkles className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">AI-Powered Analysis</h3>
            <p className="text-gray-600">
              Simply log what you eat in plain English. Our smart AI parses your meals and automatically 
              extracts nutritional information—no manual entry or calorie counting needed.
            </p>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg">
            <TrendingUp className="w-12 h-12 text-orange-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Weekly Trends</h3>
            <p className="text-gray-600">
              Track your progress over time with detailed weekly summaries. See if your fiber intake is improving, 
              identify your best and worst days, and understand long-term patterns in your gut health.
            </p>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg">
            <Brain className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Personalized Tips</h3>
            <p className="text-gray-600">
              Receive daily, science-backed recommendations tailored to your specific gut health scores. 
              Learn what foods to add, what to reduce, and how to optimize your digestive wellness.
            </p>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg">
            <Target className="w-12 h-12 text-red-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Food Diary Made Easy</h3>
            <p className="text-gray-600">
              Log breakfast, lunch, dinner, and snacks with timestamps. Edit or delete entries anytime. 
              Your complete food history helps identify patterns and trigger foods for better digestion.
            </p>
          </div>
        </div>
      </div>

      {/* Why Gut Health Matters */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-green-50 to-blue-50">
        <h2 className="text-3xl font-bold text-center mb-8">
          Why Gut Health Tracking Matters
        </h2>
        <div className="max-w-4xl mx-auto text-lg text-gray-700 space-y-6">
          <p>
            Your gut microbiome—the community of trillions of bacteria in your digestive system—plays a crucial role 
            in your overall health. Research shows that gut health impacts everything from digestion and immunity to 
            mood and weight management.
          </p>
          <p>
            <strong className="text-green-700">Fiber</strong> acts as fuel for beneficial gut bacteria, supporting 
            their growth and the production of short-chain fatty acids (SCFAs) like butyrate, which reduce inflammation 
            and improve gut barrier function. Adults need 25-38g of fiber daily, but most people only get half that amount.
          </p>
          <p>
            <strong className="text-blue-700">Probiotics</strong> are beneficial live bacteria found in fermented foods 
            like yogurt, kefir, sauerkraut, and kimchi. They help maintain a balanced gut microbiome, support immune 
            function, and may improve digestive symptoms like bloating and irregular bowel movements.
          </p>
          <p>
            <strong className="text-purple-700">Food diversity</strong> matters because different plant foods feed 
            different beneficial bacteria. Studies show that people who eat 30+ different plant foods per week have 
            more diverse, healthier gut microbiomes than those eating fewer varieties.
          </p>
          <p>
            By tracking these metrics daily, you gain awareness of your eating patterns and can make informed decisions 
            to optimize your digestive wellness. Small, consistent improvements in gut health can lead to better energy, 
            clearer skin, stronger immunity, and improved mental clarity.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">
          How GutHealth Works
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="font-semibold mb-2">Sign Up Free</h3>
            <p className="text-gray-600 text-sm">Create your account in seconds—no payment required</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="font-semibold mb-2">Log Your Meals</h3>
            <p className="text-gray-600 text-sm">Simply type what you ate—our AI handles the analysis</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="font-semibold mb-2">Get Your Score</h3>
            <p className="text-gray-600 text-sm">Receive instant feedback on your gut health metrics</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              4
            </div>
            <h3 className="font-semibold mb-2">Improve Daily</h3>
            <p className="text-gray-600 text-sm">Follow personalized tips to optimize your digestive health</p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-blue-50 to-white">
        <h2 className="text-3xl font-bold text-center mb-12">
          What You'll Achieve with GutHealth
        </h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            "Understand exactly how much fiber you're consuming daily",
            "Identify probiotic-rich foods in your diet",
            "Track food diversity across breakfast, lunch, dinner, and snacks",
            "Monitor your processed food intake",
            "Spot patterns between what you eat and how you feel",
            "Get science-based tips tailored to your eating habits",
            "Build sustainable habits for long-term gut wellness",
            "Make informed food choices backed by data"
          ].map((benefit, index) => (
            <div key={index} className="flex gap-3 items-start">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <p className="text-gray-700">{benefit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-green-600 text-white rounded-2xl my-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Gut Health?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of people taking control of their digestive wellness with data-driven insights
          </p>
          <button 
            onClick={handleStartClick}
            className="bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition inline-flex items-center gap-2"
          >
            Start Your Free Journey <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-500 text-sm border-t">
        <p>© 2024 GutHealth. Track your gut health, improve your life.</p>
        <p className="mt-2">Fiber tracking • Probiotic monitoring • Food diversity analysis • Digestive wellness insights</p>
      </div>
    </div>
  );
}