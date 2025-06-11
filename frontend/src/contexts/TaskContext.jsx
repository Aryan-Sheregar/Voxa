import React, { createContext, useContext, useState, useEffect } from 'react';

const TaskContext = createContext(undefined);

// Mock function to simulate processing audio with AI
const mockProcessAudio = async (audioBlob) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Return mock tasks
  return [
    {
      id: '1',
      title: 'Prepare presentation for client meeting',
      description: 'Create slides for the quarterly review',
      priority: 1,
      timeEstimate: '1 hour',
      completed: false,
    },
    {
      id: '2',
      title: "Review team's project progress",
      description: 'Check milestones and address any blockers',
      priority: 2,
      timeEstimate: '30 min',
      completed: false,
    },
    {
      id: '3',
      title: 'Schedule one-on-one meetings',
      description: 'Arrange feedback sessions with team members',
      priority: 2,
      timeEstimate: '15 min',
      completed: false,
    },
    {
      id: '4',
      title: 'Order lunch delivery',
      description: null,
      priority: 3,
      timeEstimate: '5 min',
      completed: false,
    },
  ];
};

// Mock function to simulate generating audio response
const mockGenerateAudio = async () => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return mock audio URL
  return 'https://cdn.freesound.org/previews/722/722223_15301361-lq.mp3';
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingState, setProcessingState] = useState('idle');
  const [processingProgress, setProcessingProgress] = useState(0);

  useEffect(() => {
    // Load tasks from localStorage
    const storedTasks = localStorage.getItem('voxa_tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('voxa_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const toggleTask = (taskId) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const removeTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const processPlan = async (audioBlob) => {
    try {
      setIsProcessing(true);
      setProcessingState('processing');
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 300);
      
      // Process audio with AI
      const newTasks = await mockProcessAudio(audioBlob);
      
      clearInterval(progressInterval);
      setProcessingProgress(100);
      
      // Update state
      setTasks(newTasks);
      setProcessingState('complete');
    } catch (error) {
      console.error('Error processing audio:', error);
    } finally {
      setIsProcessing(false);
      // Reset processing state after a delay
      setTimeout(() => {
        setProcessingState('idle');
        setProcessingProgress(0);
      }, 2000);
    }
  };

  const generateAudioResponse = async () => {
    try {
      setIsProcessing(true);
      setProcessingState('generating');
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 10;
        });
      }, 300);
      
      // Generate audio response
      const audioUrl = await mockGenerateAudio();
      
      clearInterval(progressInterval);
      setProcessingProgress(100);
      setProcessingState('complete');
      
      return audioUrl;
    } catch (error) {
      console.error('Error generating audio:', error);
      return '';
    } finally {
      setIsProcessing(false);
      // Reset processing state after a delay
      setTimeout(() => {
        setProcessingState('idle');
        setProcessingProgress(0);
      }, 2000);
    }
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      addTask,
      toggleTask,
      removeTask,
      processPlan,
      generateAudioResponse,
      isProcessing,
      processingState,
      processingProgress,
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};