import React, { useState } from 'react';
import { ExternalLink, Plus, Settings, CheckCircle, AlertCircle, FolderSync as Sync, Database, FileText, Calendar, Users } from 'lucide-react';

const NotionIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState('');
  const [syncSettings, setSyncSettings] = useState({
    autoSync: true,
    syncTasks: true,
    syncCalendar: false,
    syncNotes: true,
    syncFrequency: 'realtime'
  });

  // Mock Notion workspaces
  const workspaces = [
    { id: '1', name: 'Personal Workspace', icon: '👤' },
    { id: '2', name: 'Work Team', icon: '🏢' },
    { id: '3', name: 'Side Projects', icon: '🚀' }
  ];

  // Mock connected databases
  const connectedDatabases = [
    {
      id: '1',
      name: 'Daily Tasks',
      type: 'tasks',
      icon: '✅',
      lastSync: '2 minutes ago',
      status: 'synced'
    },
    {
      id: '2',
      name: 'Meeting Notes',
      type: 'notes',
      icon: '📝',
      lastSync: '1 hour ago',
      status: 'synced'
    },
    {
      id: '3',
      name: 'Project Calendar',
      type: 'calendar',
      icon: '📅',
      lastSync: 'Failed',
      status: 'error'
    }
  ];

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate connection process
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setSelectedWorkspace('');
  };

  const handleSyncNow = () => {
    // Simulate sync process
    console.log('Syncing with Notion...');
  };

  const renderConnectionSetup = () => (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
        <ExternalLink className="w-10 h-10 text-gray-400" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect to Notion</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Sync your voice-generated tasks and plans directly to your Notion workspace for seamless productivity.
      </p>
      
      <div className="space-y-4 max-w-sm mx-auto">
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
        >
          {isConnecting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <ExternalLink className="w-5 h-5" />
              <span>Connect with Notion</span>
            </>
          )}
        </button>
        
        <p className="text-xs text-gray-500">
          You'll be redirected to Notion to authorize the connection
        </p>
      </div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Sync className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-gray-900 font-medium mb-2">Auto-Sync Tasks</h3>
          <p className="text-gray-600 text-sm">Voice-generated tasks automatically appear in your Notion database</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-gray-900 font-medium mb-2">Rich Formatting</h3>
          <p className="text-gray-600 text-sm">Maintain task priorities, descriptions, and time estimates</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Database className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-gray-900 font-medium mb-2">Multiple Databases</h3>
          <p className="text-gray-600 text-sm">Connect to different Notion databases for various projects</p>
        </div>
      </div>
    </div>
  );

  const renderConnectedView = () => (
    <div className="space-y-8">
      {/* Connection Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold">Connected to Notion</h3>
              <p className="text-blue-700 text-sm">Workspace: {workspaces.find(w => w.id === selectedWorkspace)?.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncNow}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Sync className="w-4 h-4" />
              <span>Sync Now</span>
            </button>
            
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>

      {/* Connected Databases */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Connected Databases</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-gray-900 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Database</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connectedDatabases.map((db) => (
            <div key={db.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{db.icon}</span>
                  <div>
                    <h3 className="text-gray-900 font-medium">{db.name}</h3>
                    <p className="text-gray-600 text-sm capitalize">{db.type}</p>
                  </div>
                </div>
                
                <button className="p-1 text-gray-400 hover:text-gray-900 rounded">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {db.status === 'synced' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${
                    db.status === 'synced' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {db.status === 'synced' ? 'Synced' : 'Error'}
                  </span>
                </div>
                
                <span className="text-xs text-gray-500">{db.lastSync}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sync Settings */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Sync Settings</h2>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sync Frequency</label>
              <select
                value={syncSettings.syncFrequency}
                onChange={(e) => setSyncSettings(prev => ({ ...prev, syncFrequency: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="realtime">Real-time</option>
                <option value="5min">Every 5 minutes</option>
                <option value="15min">Every 15 minutes</option>
                <option value="1hour">Every hour</option>
                <option value="manual">Manual only</option>
              </select>
            </div>
            
            <div className="space-y-4">
              {[
                { key: 'autoSync', label: 'Auto-sync enabled', description: 'Automatically sync changes to Notion' },
                { key: 'syncTasks', label: 'Sync tasks', description: 'Voice-generated tasks sync to Notion' },
                { key: 'syncCalendar', label: 'Sync calendar events', description: 'Calendar events sync both ways' },
                { key: 'syncNotes', label: 'Sync notes', description: 'Voice transcripts sync as notes' }
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="text-gray-900 font-medium">{setting.label}</h4>
                    <p className="text-gray-600 text-sm">{setting.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={syncSettings[setting.key]}
                      onChange={(e) => setSyncSettings(prev => ({ ...prev, [setting.key]: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Notion Integration</h1>
          <p className="text-gray-600">Connect Voxa with your Notion workspace for seamless productivity</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          {isConnected ? renderConnectedView() : renderConnectionSetup()}
        </div>
      </div>
    </div>
  );
};

export default NotionIntegration;