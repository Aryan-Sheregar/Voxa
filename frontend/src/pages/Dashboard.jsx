import React, { useState, useRef } from 'react';
import { Mic, MicOff, Play, Pause, CheckCircle, Clock, Plus, Trash2, Edit3 } from 'lucide-react';
import { useTasks } from '../contexts/TaskContext';
import ProcessingIndicator from '../components/ProcessingIndicator';
import AudioPlayer from '../components/AudioPlayer';

const Dashboard = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioResponse, setAudioResponse] = useState(null);
  const [isPlayingResponse, setIsPlayingResponse] = useState(false);
  const recordingInterval = useRef(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const {
    tasks,
    toggleTask,
    removeTask,
    processPlan,
    generateAudioResponse,
    isProcessing,
    processingState,
    processingProgress
  } = useTasks();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        await processPlan(audioBlob);
        
        // Generate audio response
        const responseUrl = await generateAudioResponse();
        setAudioResponse(responseUrl);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      clearInterval(recordingInterval.current);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1: return 'text-red-700 bg-red-100';
      case 2: return 'text-yellow-700 bg-yellow-100';
      case 3: return 'text-green-700 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 1: return 'High';
      case 2: return 'Medium';
      case 3: return 'Low';
      default: return 'Normal';
    }
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">Transform your voice into actionable plans</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Voice Recording Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recording Interface */}
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Voice Planning</h2>
                <p className="text-gray-600">Speak your thoughts and let AI organize them into tasks</p>
              </div>

              {/* Recording Button */}
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                      : 'bg-blue-500 hover:bg-blue-600 hover:scale-105'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isRecording ? (
                    <MicOff className="w-10 h-10 text-white" />
                  ) : (
                    <Mic className="w-10 h-10 text-white" />
                  )}
                </button>

                {isRecording && (
                  <div className="text-center">
                    <div className="text-2xl font-mono text-blue-600 mb-1">
                      {formatTime(recordingTime)}
                    </div>
                    <p className="text-gray-600 text-sm">Recording...</p>
                  </div>
                )}

                {!isRecording && !isProcessing && (
                  <p className="text-gray-600">Click to start recording</p>
                )}
              </div>

              {/* Processing Indicator */}
              {isProcessing && (
                <div className="mt-6">
                  <ProcessingIndicator 
                    state={processingState} 
                    progress={processingProgress} 
                  />
                </div>
              )}

              {/* Audio Response Player */}
              {audioResponse && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">AI Response</h3>
                  <AudioPlayer 
                    audioUrl={audioResponse}
                    isPlaying={isPlayingResponse}
                    onPlayToggle={() => setIsPlayingResponse(!isPlayingResponse)}
                  />
                </div>
              )}
            </div>

            {/* Tasks List */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Today's Tasks</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Add Task</span>
                </button>
              </div>

              {tasks.length === 0 ? (
                <div className="text-center py-12">
                  <Mic className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No tasks yet</h3>
                  <p className="text-gray-500">Start by recording your voice to generate tasks</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingTasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-1 w-5 h-5 rounded border-2 border-gray-300 hover:border-blue-500 transition-colors flex items-center justify-center"
                      >
                        {task.completed && <CheckCircle className="w-4 h-4 text-blue-500" />}
                      </button>
                      
                      <div className="flex-1">
                        <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                            {getPriorityLabel(task.priority)}
                          </span>
                          {task.timeEstimate && (
                            <div className="flex items-center gap-1 text-gray-500 text-xs">
                              <Clock className="w-3 h-3" />
                              <span>{task.timeEstimate}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => removeTask(task.id)}
                          className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Today's Progress</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Tasks</span>
                  <span className="text-gray-900 font-medium">{tasks.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Completed</span>
                  <span className="text-blue-600 font-medium">{completedTasks.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Remaining</span>
                  <span className="text-orange-600 font-medium">{pendingTasks.length}</span>
                </div>
                
                {tasks.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="text-gray-900">{Math.round((completedTasks.length / tasks.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(completedTasks.length / tasks.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Completed Today</h3>
                <div className="space-y-2">
                  {completedTasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-600 text-sm line-through truncate">{task.title}</span>
                    </div>
                  ))}
                  {completedTasks.length > 3 && (
                    <p className="text-gray-500 text-sm text-center mt-2">
                      +{completedTasks.length - 3} more completed
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors">
                  <Mic className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Voice Planning</div>
                    <div className="text-xs text-gray-600">Record new tasks</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors">
                  <Plus className="w-5 h-5 text-indigo-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Add Task</div>
                    <div className="text-xs text-gray-600">Create manually</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;