import React, { useState } from 'react';
import { Search, Filter, Calendar, Clock, Play, Trash2, Download } from 'lucide-react';
import AudioPlayer from '../components/AudioPlayer';

const History = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Mock history data
  const historyItems = [
    {
      id: '1',
      date: '2024-01-15',
      time: '09:30 AM',
      title: 'Morning Planning Session',
      duration: '2:45',
      tasksGenerated: 5,
      audioUrl: 'https://cdn.freesound.org/previews/722/722223_15301361-lq.mp3',
      transcript: 'Today I need to prepare for the client presentation, review the quarterly reports, and schedule team meetings...'
    },
    {
      id: '2',
      date: '2024-01-14',
      time: '02:15 PM',
      title: 'Afternoon Task Update',
      duration: '1:30',
      tasksGenerated: 3,
      audioUrl: 'https://cdn.freesound.org/previews/722/722223_15301361-lq.mp3',
      transcript: 'Quick update on my afternoon tasks. Need to follow up with the marketing team and finish the budget review...'
    },
    {
      id: '3',
      date: '2024-01-13',
      time: '08:45 AM',
      title: 'Weekly Goals Planning',
      duration: '4:20',
      tasksGenerated: 8,
      audioUrl: 'https://cdn.freesound.org/previews/722/722223_15301361-lq.mp3',
      transcript: 'Planning my week ahead. Focus areas include product development, team coordination, and client relationships...'
    },
    {
      id: '4',
      date: '2024-01-12',
      time: '11:20 AM',
      title: 'Project Milestone Review',
      duration: '3:15',
      tasksGenerated: 6,
      audioUrl: 'https://cdn.freesound.org/previews/722/722223_15301361-lq.mp3',
      transcript: 'Reviewing our project milestones and identifying next steps for the development team...'
    }
  ];

  const filteredItems = historyItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.transcript.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'today') return item.date === '2024-01-15' && matchesSearch;
    if (selectedFilter === 'week') return matchesSearch;
    
    return matchesSearch;
  });

  const handlePlayAudio = (item) => {
    if (currentAudio?.id === item.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentAudio(item);
      setIsPlaying(true);
    }
  };

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Voice History</h1>
          <p className="text-gray-600">Review your past planning sessions and generated tasks</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search sessions or transcripts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              
              <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="space-y-4 mb-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-6 hover:bg-gray-50 transition-colors shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{item.time}</span>
                    </div>
                    <span>Duration: {item.duration}</span>
                    <span>{item.tasksGenerated} tasks generated</span>
                  </div>
                  <p className="text-gray-700 text-sm line-clamp-2">{item.transcript}</p>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handlePlayAudio(item)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    <span>Play</span>
                  </button>
                  
                  <button className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  
                  <button className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Audio Player */}
        {currentAudio && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-white rounded-xl p-4 shadow-2xl border border-gray-200">
              <div className="mb-2">
                <h4 className="text-sm font-medium text-gray-900">{currentAudio.title}</h4>
                <p className="text-xs text-gray-600">{currentAudio.date} at {currentAudio.time}</p>
              </div>
              <AudioPlayer 
                audioUrl={currentAudio.audioUrl} 
                isPlaying={isPlaying} 
                onPlayToggle={handlePlayToggle} 
              />
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;