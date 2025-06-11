import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Mic, 
  Palette, 
  Globe, 
  Download,
  Trash2,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // Profile settings
    name: 'Alex Smith',
    email: 'alex@example.com',
    timezone: 'America/New_York',
    language: 'en',
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    voiceReminders: false,
    dailyDigest: true,
    
    // Voice settings
    voiceLanguage: 'en-US',
    autoTranscribe: true,
    voiceQuality: 'high',
    backgroundNoise: 'medium',
    
    // Privacy settings
    dataRetention: '1year',
    shareAnalytics: false,
    publicProfile: false,
    
    // Appearance settings
    theme: 'light',
    accentColor: 'blue',
    compactMode: false,
    animations: true
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'voice', label: 'Voice & Audio', icon: Mic },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'data', label: 'Data & Storage', icon: Download }
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // Simulate saving settings
    console.log('Saving settings:', settings);
    // Show success message
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => handleSettingChange('name', e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => handleSettingChange('email', e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => handleSettingChange('timezone', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm new password"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
            { key: 'pushNotifications', label: 'Push Notifications', description: 'Browser and mobile notifications' },
            { key: 'voiceReminders', label: 'Voice Reminders', description: 'Audio reminders for tasks' },
            { key: 'dailyDigest', label: 'Daily Digest', description: 'Summary of your daily activities' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="text-gray-900 font-medium">{item.label}</h4>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[item.key]}
                  onChange={(e) => handleSettingChange(item.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderVoiceTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Voice Recognition</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Voice Language</label>
            <select
              value={settings.voiceLanguage}
              onChange={(e) => handleSettingChange('voiceLanguage', e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="es-ES">Spanish</option>
              <option value="fr-FR">French</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Audio Quality</label>
            <select
              value={settings.voiceQuality}
              onChange={(e) => handleSettingChange('voiceQuality', e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low (Faster processing)</option>
              <option value="medium">Medium (Balanced)</option>
              <option value="high">High (Best quality)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Noise Reduction</label>
            <select
              value={settings.backgroundNoise}
              onChange={(e) => handleSettingChange('backgroundNoise', e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h4 className="text-gray-900 font-medium">Auto-transcribe recordings</h4>
          <p className="text-gray-600 text-sm">Automatically convert voice to text</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.autoTranscribe}
            onChange={(e) => handleSettingChange('autoTranscribe', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data & Privacy</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Retention Period</label>
            <select
              value={settings.dataRetention}
              onChange={(e) => handleSettingChange('dataRetention', e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="30days">30 Days</option>
              <option value="3months">3 Months</option>
              <option value="1year">1 Year</option>
              <option value="forever">Forever</option>
            </select>
          </div>
          
          {[
            { key: 'shareAnalytics', label: 'Share Anonymous Analytics', description: 'Help improve Voxa with usage data' },
            { key: 'publicProfile', label: 'Public Profile', description: 'Make your profile visible to others' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="text-gray-900 font-medium">{item.label}</h4>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[item.key]}
                  onChange={(e) => handleSettingChange(item.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Danger Zone</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
            <Trash2 className="w-4 h-4" />
            <span>Delete All Voice Data</span>
          </button>
          
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
            <Trash2 className="w-4 h-4" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme & Display</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              {['light', 'dark', 'auto'].map((theme) => (
                <button
                  key={theme}
                  onClick={() => handleSettingChange('theme', theme)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    settings.theme === theme
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="text-gray-900 font-medium capitalize">{theme}</div>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
            <div className="grid grid-cols-6 gap-2">
              {['blue', 'indigo', 'purple', 'pink', 'orange', 'red'].map((color) => (
                <button
                  key={color}
                  onClick={() => handleSettingChange('accentColor', color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    settings.accentColor === color ? 'border-gray-900' : 'border-gray-300'
                  } bg-${color}-500`}
                />
              ))}
            </div>
          </div>
          
          {[
            { key: 'compactMode', label: 'Compact Mode', description: 'Reduce spacing and padding' },
            { key: 'animations', label: 'Enable Animations', description: 'Smooth transitions and effects' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="text-gray-900 font-medium">{item.label}</h4>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[item.key]}
                  onChange={(e) => handleSettingChange(item.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDataTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-gray-900 font-medium mb-2">Storage Usage</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Voice recordings</span>
                <span className="text-gray-900">2.4 GB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Transcripts</span>
                <span className="text-gray-900">45 MB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Tasks & plans</span>
                <span className="text-gray-900">12 MB</span>
              </div>
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">2.46 GB</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span>Export All Data</span>
            </button>
            
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span>Export Voice Recordings</span>
            </button>
            
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span>Export Transcripts</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileTab();
      case 'notifications': return renderNotificationsTab();
      case 'voice': return renderVoiceTab();
      case 'privacy': return renderPrivacyTab();
      case 'appearance': return renderAppearanceTab();
      case 'data': return renderDataTab();
      default: return renderProfileTab();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account and application preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              {renderTabContent()}
              
              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;