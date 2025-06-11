import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, Mic, Calendar as CalendarIcon } from 'lucide-react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('month'); // month, week, day

  // Mock events data
  const events = [
    {
      id: '1',
      title: 'Team Standup',
      date: '2024-01-15',
      time: '09:00',
      duration: 30,
      type: 'meeting',
      color: 'bg-blue-500'
    },
    {
      id: '2',
      title: 'Client Presentation',
      date: '2024-01-15',
      time: '14:00',
      duration: 60,
      type: 'presentation',
      color: 'bg-indigo-500'
    },
    {
      id: '3',
      title: 'Voice Planning Session',
      date: '2024-01-15',
      time: '16:30',
      duration: 15,
      type: 'voxa',
      color: 'bg-purple-500'
    },
    {
      id: '4',
      title: 'Project Review',
      date: '2024-01-16',
      time: '10:00',
      duration: 90,
      type: 'meeting',
      color: 'bg-orange-500'
    }
  ];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Calendar</h1>
            <p className="text-gray-600">Manage your schedule and voice planning sessions</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors">
              <Mic className="w-4 h-4" />
              <span>Quick Plan</span>
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-gray-900 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Add Event</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => navigateMonth(-1)}
                      className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigateMonth(1)}
                      className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {['month', 'week', 'day'].map((viewType) => (
                    <button
                      key={viewType}
                      onClick={() => setView(viewType)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        view === viewType
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Days of Week Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {daysOfWeek.map((day) => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentDate).map((date, index) => {
                  const dayEvents = getEventsForDate(date);
                  
                  return (
                    <div
                      key={index}
                      onClick={() => date && setSelectedDate(date)}
                      className={`min-h-[100px] p-2 border border-gray-200 rounded-lg cursor-pointer transition-colors ${
                        date
                          ? isSelected(date)
                            ? 'bg-blue-50 border-blue-300'
                            : isToday(date)
                            ? 'bg-gray-100 border-gray-300'
                            : 'hover:bg-gray-50'
                          : 'cursor-default'
                      }`}
                    >
                      {date && (
                        <>
                          <div className={`text-sm font-medium mb-1 ${
                            isToday(date) ? 'text-blue-600' : 'text-gray-900'
                          }`}>
                            {date.getDate()}
                          </div>
                          <div className="space-y-1">
                            {dayEvents.slice(0, 2).map((event) => (
                              <div
                                key={event.id}
                                className={`text-xs p-1 rounded text-white truncate ${event.color}`}
                              >
                                {event.title}
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="text-xs text-gray-600">
                                +{dayEvents.length - 2} more
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Events */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-500" />
                Today's Events
              </h3>
              
              <div className="space-y-3">
                {getEventsForDate(selectedDate).length > 0 ? (
                  getEventsForDate(selectedDate).map((event) => (
                    <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-3 h-3 rounded-full mt-1 ${event.color}`}></div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(event.time)}</span>
                          <span>({event.duration}m)</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm">No events scheduled</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors">
                  <Mic className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Voice Planning</div>
                    <div className="text-xs text-gray-600">Create tasks from voice</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors">
                  <Plus className="w-5 h-5 text-indigo-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Add Meeting</div>
                    <div className="text-xs text-gray-600">Schedule new event</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors">
                  <CalendarIcon className="w-5 h-5 text-purple-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Sync Calendar</div>
                    <div className="text-xs text-gray-600">Import external events</div>
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

export default Calendar;