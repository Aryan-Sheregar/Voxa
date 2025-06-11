import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mic, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate sending reset email
    setTimeout(() => {
      setIsEmailSent(true);
      setIsLoading(false);
    }, 2000);
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-500 text-white mx-auto mb-4">
              <Mic className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Check Your Email</h1>
          </div>

          {/* Success Message */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Reset Link Sent!</h2>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <strong>{email}</strong>. 
              Please check your email and follow the instructions to reset your password.
            </p>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              
              <button
                onClick={() => setIsEmailSent(false)}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Send Another Email
              </button>
              
              <Link
                to="/signin"
                className="block w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors text-center"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-500 text-white mx-auto mb-4">
            <Mic className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-600 mt-2">Enter your email to receive a reset link</p>
        </div>

        {/* Forgot Password Form */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sending Reset Link...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/signin" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-500 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Need help?</h3>
            <p className="text-xs text-gray-600">
              If you're having trouble accessing your account, contact our support team for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;