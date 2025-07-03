
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Mic, MicOff, Info } from 'lucide-react';
// import FeatureGrid from '@/components/FeatureGrid';
// import BottomNavigation from '@/components/BottomNavigation';
// import UpcomingTasks from '@/components/UpcomingTasks';
// import { useTextToSpeech } from '@/hooks/useTextToSpeech';
// import { useVoiceRecording } from '@/hooks/useVoiceRecording';

// const HomeScreen = () => {
//   const navigate = useNavigate();
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [greeting, setGreeting] = useState('');
//   const { speak, stop, isSpeaking } = useTextToSpeech();
//   const { isListening, startListening } = useVoiceRecording();

//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   useEffect(() => {
//     const hour = currentTime.getHours();
//     if (hour < 12) {
//       setGreeting('🌅 Good Morning');
//     } else if (hour < 17) {
//       setGreeting('☀️ Good Afternoon');
//     } else {
//       setGreeting('🌙 Good Evening');
//     }
//   }, [currentTime]);

//   const handleVoiceCommand = () => {
//     if (isListening || isSpeaking) {
//       stop();
//       return;
//     }

//     const welcomeMessage = `${greeting} Harsha! How can I help you today? You can say things like: show me reminders, read today's news, or tell me my horoscope.`;
//     speak(welcomeMessage);
    
//     // Start listening after the welcome message
//     setTimeout(() => {
//       startListening();
//     }, 3000);
//   };

//   const handleTestVoice = () => {
//     const testMessage = "Hello! This is your voice assistant. I can read aloud any content and listen to your voice commands. How does this sound?";
//     speak(testMessage);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-zeroclick-peach to-white pb-[2.5rem]">
//       {/* Header with Greeting */}
//       <div className="px-6 pt-12 pb-6">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold text-zeroclick-blue mb-2">
//             {greeting}, Karan! 
//           </h1>
//           <p className="text-lg text-zeroclick-blue/70 font-medium">
//             {currentTime.toLocaleDateString('en-IN', { 
//               weekday: 'long', 
//               day: 'numeric', 
//               month: 'long' 
//             })}
//           </p>
//         </div>
//       </div>

//       {/* Central Microphone Button */}
//       <div className="flex justify-center mb-8">
//         <button
//           onClick={handleVoiceCommand}
//           className={`mic-button w-24 h-24 flex items-center justify-center ${
//             isListening ? 'animate-pulse bg-red-500' : ''
//           } ${isSpeaking ? 'animate-bounce' : ''}`}
//           aria-label="Voice Command Button"
//         >
//           {isListening ? (
//             <MicOff size={40} className="text-white" />
//           ) : (
//             <Mic size={40} className="text-white" />
//           )}
//         </button>
//       </div>

//       {/* Voice Status */}
//       {(isListening || isSpeaking) && (
//         <div className="text-center mb-6">
//           <p className="text-lg font-bold text-zeroclick-blue">
//             {isSpeaking ? '🔊 Speaking...' : '🎤 Listening...'}
//           </p>
//         </div>
//       )}

//       {/* Test Voice Button */}
//       <div className="flex justify-center mb-6">
//         <button
//           onClick={handleTestVoice}
//           className="bg-zeroclick-mint text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-lg"
//         >
//           🔈 Test Voice
//         </button>
//       </div>

//       {/* Upcoming Tasks */}
//       <UpcomingTasks />

//       {/* Feature Grid */}
//       <FeatureGrid />

//       {/* Gesture Help Button */}
//       {/* <div className="fixed top-10 right-4">
//         <button 
//           className="bg-zeroclick-light-blue rounded-full p-3 shadow-lg"
//           aria-label="Help and Gestures"
//         >
//           <Info size={24} className="text-zeroclick-blue" />
//         </button>
//       </div> */}

//       {/* Bottom Navigation */}
//       <BottomNavigation currentScreen="home" />
//     </div>
//   );
// };

// export default HomeScreen;
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff } from 'lucide-react';
import FeatureGrid from '@/components/FeatureGrid';
import BottomNavigation from '@/components/BottomNavigation';
import UpcomingTasks from '@/components/UpcomingTasks';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';

const HomeScreen = () => {
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const { isListening, transcript, startListening } = useVoiceRecording();

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const hour = now.getHours();
    if (hour < 12) setGreeting('🌅 Good Morning');
    else if (hour < 17) setGreeting('☀️ Good Afternoon');
    else setGreeting('🌙 Good Evening');
  }, [now]);

  const handleVoice = () => {
    if (isListening || isSpeaking) {
      stop();
      return;
    }

    speak(
      `${greeting}, Karan! How can I help you today? You can say things like show me reminders, read today's news, or tell me my horoscope.`
    );
    setTimeout(() => {
      startListening();
    }, 3000);
  };

  useEffect(() => {
    const lower = transcript.toLowerCase();
    if (lower.includes('reminder')) navigate('/reminders');
    if (lower.includes('news')) navigate('/news');
    if (lower.includes('horoscope')) navigate('/horoscope');
  }, [transcript, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zeroclick-peach to-white pb-[2.5rem]">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 text-center">
        <h1 className="text-3xl font-bold text-zeroclick-blue mb-2">
          {greeting}, Karan!
        </h1>
        <p className="text-lg text-zeroclick-blue/70">
          {now.toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </p>
      </div>

      {/* Mic button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={handleVoice}
          className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg ${
            isListening ? 'bg-red-500 animate-pulse' : 'bg-zeroclick-blue'
          } ${isSpeaking ? 'animate-bounce' : ''}`}
        >
          {isListening ? (
            <MicOff size={40} className="text-white" />
          ) : (
            <Mic size={40} className="text-white" />
          )}
        </button>
      </div>

      {/* Status & Transcript */}
      {(isSpeaking || isListening) && (
        <p className="text-center text-lg font-bold text-zeroclick-blue mb-2">
          {isSpeaking ? '🔊 Speaking…' : '🎤 Listening…'}
        </p>
      )}
      {transcript && (
        <p className="text-center text-base text-zeroclick-blue/80 mb-6 italic">
          🗣️ "{transcript}"
        </p>
      )}

      {/* Sections */}
      <UpcomingTasks />
      <FeatureGrid />
      <BottomNavigation currentScreen="home" />
    </div>
  );
};

export default HomeScreen;
