import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Vapi from '@vapi-ai/web';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Mic, MicOff, Phone, PhoneOff } from 'lucide-react';

/*
 * VAPI NAVIGATION TOOLS SETUP INSTRUCTIONS:
 * 
 * To enable navigation commands, add these function tools in your Vapi Assistant dashboard:
 * 
 * 1. navigate_to_page:
 *    - Description: "Navigate to a specific page in the SPEAK application"
 *    - Parameters: 
 *      {
 *        "type": "object",
 *        "properties": {
 *          "page": {
 *            "type": "string",
 *            "description": "The page to navigate to",
 *            "enum": ["home", "login", "register", "booking", "chat", "forum", "resources", "gamification", "admin", "counselor-panel", "institute-panel", "test", "anonymous-login"]
 *          },
 *          "message": {
 *            "type": "string", 
 *            "description": "Optional message to display about the navigation"
 *          }
 *        },
 *        "required": ["page"]
 *      }
 *
 * 2. get_current_page:
 *    - Description: "Get information about the current page the user is on"
 *    - Parameters: {"type": "object", "properties": {}, "required": []}
 *
 * Usage examples:
 * - "Take me to the booking page"
 * - "Go to login" 
 * - "Navigate to the forum"
 * - "What page am I on?"
 */

interface VapiWidgetProps {
  apiKey: string;
  assistantId: string;
  config?: Record<string, unknown>;
  className?: string;
  theme?: 'default' | 'mental-health' | 'counseling' | 'dark';
}

interface TranscriptMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

const VapiWidget: React.FC<VapiWidgetProps> = ({ 
  apiKey, 
  assistantId, 
  config = {},
  className = '',
  theme = 'dark'
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);

  // Theme configurations
  const themes = {
    'default': {
      primaryColor: '#12A594',
      secondaryColor: '#f8f9fa',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderColor: '#e5e7eb',
      greeting: 'Hi! I\'m here to help you.',
    },
    'mental-health': {
      primaryColor: '#6366f1',
      secondaryColor: '#f1f5f9',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      borderColor: '#e5e7eb',
      greeting: 'Welcome to SPEAK. I\'m here to listen and support you.',
    },
    'counseling': {
      primaryColor: '#059669',
      secondaryColor: '#ecfdf5',
      backgroundColor: '#ffffff',
      textColor: '#065f46',
      borderColor: '#d1fae5',
      greeting: 'Let\'s begin your counseling session. I\'m here for you.',
    },
    'dark': {
      primaryColor: '#8b5cf6',
      secondaryColor: '#1f2937',
      backgroundColor: '#111827',
      textColor: '#f9fafb',
      borderColor: '#374151',
      greeting: 'Welcome to SPEAK. I\'m here to support you.',
    }
  };

  const currentTheme = themes[theme];

  // Multi-technique navigation function
  const multiNavigate = useCallback((page: string, message?: string) => {
    const routeMap: Record<string, string> = {
      'home': '/',
      'login': '/login',
      'register': '/register',
      'booking': '/booking',
      'chat': '/chat',
      'forum': '/forum',
      'resources': '/resources',
      'gamification': '/gamification',
      'navigation-test': '/navigation-test',
      'admin': '/admin',
      'counselor-panel': '/panel/counselor',
      'institute-panel': '/panel/institute',
      'login-admin': '/login/admin',
      'login-institute': '/login/institute',
      'login-counselor': '/login/counselor',
      'anonymous-login': '/anonymous-login'
    };

    // Validate page parameter
    if (!page || typeof page !== 'string') {
      console.error(`❌ Invalid page parameter: ${page}`);
      return false;
    }

    const cleanPage = page.trim().toLowerCase();
    const route = routeMap[cleanPage];
    
    if (!route) {
      console.error(`❌ Unknown page: "${cleanPage}". Available pages:`, Object.keys(routeMap));
      
      // Add error message to transcript
      setTranscript(prev => [...prev, {
        role: 'assistant',
        text: `Sorry, I don't know how to navigate to "${cleanPage}". Available pages: ${Object.keys(routeMap).join(', ')}`,
        timestamp: new Date()
      }]);
      
      return false;
    }

    console.log(`🚀 MULTI-NAVIGATION attempting to go to ${page} (${route})`);
    
    // Add to transcript immediately
    setTranscript(prev => [...prev, {
      role: 'assistant',
      text: message || `Navigating to ${page}...`,
      timestamp: new Date()
    }]);
    
    // Technique 1: React Router navigate
    try {
      navigate(route);
      console.log(`✅ React Router navigation successful to ${route}`);
      
      // Give a small delay to ensure navigation completes
      setTimeout(() => {
        if (window.location.pathname === route) {
          console.log(`✅ Navigation confirmed: now at ${route}`);
        } else {
          console.warn(`⚠️ Navigation may have failed: expected ${route}, got ${window.location.pathname}`);
        }
      }, 100);
      
      return true;
    } catch (err) {
      console.error('❌ React Router navigation failed:', err);
    }

    // Technique 2: Direct window location
    try {
      window.location.href = route;
      console.log(`✅ Window location navigation to ${route}`);
      return true;
    } catch (err) {
      console.error('❌ Window location failed:', err);
    }

    // Technique 3: History API
    try {
      window.history.pushState({}, '', route);
      window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
      console.log(`✅ History API navigation to ${route}`);
      return true;
    } catch (err) {
      console.error('❌ History API failed:', err);
    }

    // Technique 4: Force reload with new URL
    try {
      window.location.replace(window.location.origin + route);
      console.log(`✅ Force navigation to ${route}`);
      return true;
    } catch (err) {
      console.error('❌ All navigation techniques failed:', err);
    }

    return false;
  }, [navigate, setTranscript]);

  // Handle navigation function calls from Vapi
  const handleNavigationCall = useCallback((functionCall: any) => {
    const { name, arguments: args } = functionCall;
    
    try {
      if (name === 'navigate_to_page') {
        const { page, message } = JSON.parse(args);
        
        console.log(`🔧 Function call navigation to: ${page}`);
        const success = multiNavigate(page, message);
        
        return {
          success: success,
          message: success ? `Successfully navigated to ${page}` : `Failed to navigate to ${page}`,
          route: success ? page : null
        };
      } else if (name === 'get_current_page') {
        const currentPath = location.pathname;
        const currentPage = Object.entries({
          '/': 'home',
          '/login': 'login',
          '/register': 'register',
          '/booking': 'booking',
          '/chat': 'chat',
          '/forum': 'forum',
          '/resources': 'resources',
          '/gamification': 'gamification',
          '/navigation-test': 'navigation-test',
          '/admin': 'admin',
          '/panel/counselor': 'counselor-panel',
          '/panel/institute': 'institute-panel',
          '/login/admin': 'login-admin',
          '/login/institute': 'login-institute',
          '/login/counselor': 'login-counselor',
          '/anonymous-login': 'anonymous-login'
        }).find(([route]) => route === currentPath)?.[1] || 'unknown';
        
        return {
          success: true,
          currentPage: currentPage,
          currentPath: currentPath,
          message: `Currently on ${currentPage} page`
        };
      }
    } catch (error) {
      console.error('❌ Navigation function call error:', error);
      return {
        success: false,
        message: `Navigation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }, [multiNavigate, location]);

  useEffect(() => {
    if (!apiKey) {
      setError('API key is required');
      return;
    }

    if (!assistantId) {
      setError('Assistant ID is required');
      return;
    }

    try {
      console.log('🚀 Initializing Vapi with credentials that worked in HTML');
      console.log('API Key (first 10 chars):', apiKey.substring(0, 10));
      console.log('Assistant ID:', assistantId);
      
      const vapiInstance = new Vapi(apiKey);
      setVapi(vapiInstance);
      setError(null);

      // Create global navigation function for external access
      (window as any).vapiNavigate = (page: string) => {
        console.log(`🌐 Global navigation triggered for: ${page}`);
        return multiNavigate(page, `Global navigation to ${page}`);
      };

      // Test command for console debugging
      (window as any).testVapiNavigation = () => {
        console.log('🧪 Testing Vapi Navigation...');
        console.log('Available pages:', Object.keys({
          'home': '/',
          'login': '/login',
          'register': '/register',
          'booking': '/booking',
          'chat': '/chat',
          'forum': '/forum',
          'resources': '/resources',
          'gamification': '/gamification',
          'navigation-test': '/navigation-test',
          'admin': '/admin'
        }));
        console.log('');
        console.log('Test commands:');
        console.log('- window.vapiNavigate("resources")');
        console.log('- window.vapiNavigate("gamification")');
        console.log('- window.vapiNavigate("navigation-test")');
        console.log('- window.quickNavTest("resources")');
        console.log('');
        console.log('Voice commands to try:');
        console.log('- "Take me to the resources page"');
        console.log('- "Navigate to gamification"');
        console.log('- "Go to booking"');
        console.log('- "What page am I on?"');
      };

      // Quick navigation test
      (window as any).quickNavTest = (page: string) => {
        console.log(`🚀 Quick test navigation to: ${page}`);
        return multiNavigate(page, `Quick test: ${page}`);
      };

      // Test voice command patterns
      (window as any).testVoicePatterns = (testPhrase: string) => {
        console.log(`🎤 Testing voice pattern: "${testPhrase}"`);
        
        const validPages = ['home', 'login', 'register', 'booking', 'chat', 'forum', 'resources', 'gamification', 'navigation-test', 'admin'];
        const triggers = [
          /let me take you to (?:the\s+)?(home|login|register|booking|chat|forum|resources|gamification|admin)/i,
          /i'll navigate you to (?:the\s+)?(home|login|register|booking|chat|forum|resources|gamification|admin)/i,
          /taking you to (?:the\s+)?(home|login|register|booking|chat|forum|resources|gamification|admin)/i,
          /going to (?:the\s+)?(home|login|register|booking|chat|forum|resources|gamification|admin) now/i,
          /navigating to (?:the\s+)?(home|login|register|booking|chat|forum|resources|gamification|admin)/i
        ];

        for (const trigger of triggers) {
          const match = testPhrase.toLowerCase().match(trigger);
          if (match && match[1]) {
            const destination = match[1].trim().toLowerCase();
            if (validPages.includes(destination)) {
              console.log(`✅ Pattern matched: "${match[0]}" → "${destination}"`);
              return multiNavigate(destination, `Voice test: ${testPhrase}`);
            }
          }
        }
        
        console.log(`❌ No pattern matched for: "${testPhrase}"`);
        console.log('Try phrases like: "I\'ll navigate you to resources" or "Taking you to gamification"');
        return false;
      };

      console.log('🛠️ Vapi navigation tools ready! Try: window.testVapiNavigation()');

      // Call lifecycle events
      vapiInstance.on('call-start', () => {
        console.log('✅ Voice session started successfully');
        setIsConnected(true);
        setError(null);
        setCallDuration(0);
      });

      vapiInstance.on('call-end', () => {
        console.log('🔚 Voice session ended');
        setIsConnected(false);
        setIsSpeaking(false);
      });

      // Speech events
      vapiInstance.on('speech-start', () => {
        console.log('🗣️ Assistant speaking');
        setIsSpeaking(true);
      });

      vapiInstance.on('speech-end', () => {
        console.log('🔇 Assistant finished speaking');
        setIsSpeaking(false);
      });

      // Message handling
      vapiInstance.on('message', (message) => {
        console.log('📨 Message received:', message);
        
        if (message.type === 'transcript') {
          setTranscript(prev => [...prev, {
            role: message.role as 'user' | 'assistant',
            text: message.transcript,
            timestamp: new Date()
          }]);
          
          // EXPLICIT NAVIGATION DETECTION - only triggers on clear navigation intent
          if (message.role === 'assistant' && message.transcript) {
            const text = message.transcript.toLowerCase();
            
            // FALLBACK NAVIGATION - detects navigation intent in assistant responses
            const validPages = ['home', 'login', 'register', 'booking', 'chat', 'forum', 'resources', 'gamification', 'navigation-test', 'admin', 'counselor-panel', 'institute-panel', 'anonymous-login'];
            
            // Enhanced patterns to catch more navigation attempts
            const explicitNavigationTriggers = [
              // Direct navigation phrases
              /(?:let me take you to|i'll navigate you to|taking you to|going to|navigating to|opening|accessing) (?:the\s+)?(home|login|register|booking|chat|forum|resources|gamification|admin|resource hub|resource page)/i,
              
              // Resource-specific patterns (since user said "open resources")
              /(?:opening|accessing|going to) (?:the\s+)?resource(?:\s+hub|\s+page|s)?/i,
              /(?:opening|accessing|going to) (?:the\s+)?help(?:\s+section|\s+page|ful materials)?/i,
              
              // Booking patterns
              /(?:opening|accessing|going to) (?:the\s+)?(?:booking|appointment)(?:\s+page|\s+section)?/i,
              
              // Forum patterns  
              /(?:opening|accessing|going to) (?:the\s+)?(?:forum|community)(?:\s+page|\s+section)?/i,
              
              // Chat patterns
              /(?:opening|accessing|going to) (?:the\s+)?(?:chat|conversation)(?:\s+page|\s+section)?/i,
              
              // Gamification patterns
              /(?:opening|accessing|going to) (?:the\s+)?(?:gamification|rewards|points)(?:\s+page|\s+section)?/i,
              
              // Admin patterns
              /(?:opening|accessing|going to) (?:the\s+)?(?:admin|dashboard)(?:\s+panel|\s+page|\s+section)?/i,
              
              // Generic "there" patterns when context suggests navigation
              /(?:guide you there|taking you there|going there)/i
            ];

            for (const trigger of explicitNavigationTriggers) {
              const match = text.match(trigger);
              if (match) {
                let destination = '';
                
                // Handle specific patterns
                if (match[1]) {
                  destination = match[1].trim().toLowerCase();
                } else if (text.includes('resource')) {
                  destination = 'resources';
                } else if (text.includes('booking') || text.includes('appointment')) {
                  destination = 'booking';
                } else if (text.includes('forum') || text.includes('community')) {
                  destination = 'forum';
                } else if (text.includes('chat') || text.includes('conversation')) {
                  destination = 'chat';
                } else if (text.includes('gamification') || text.includes('rewards') || text.includes('points')) {
                  destination = 'gamification';
                } else if (text.includes('admin') || text.includes('dashboard')) {
                  destination = 'admin';
                } else if (text.includes('home')) {
                  destination = 'home';
                }
                
                // Map common variations
                const destinationMap: Record<string, string> = {
                  'resource hub': 'resources',
                  'resource page': 'resources',
                  'helpful materials': 'resources',
                  'help section': 'resources',
                  'appointment': 'booking',
                  'community': 'forum',
                  'conversation': 'chat',
                  'rewards': 'gamification',
                  'points': 'gamification',
                  'dashboard': 'admin'
                };
                
                destination = destinationMap[destination] || destination;
                
                // Validate destination is in our valid pages list
                if (destination && validPages.includes(destination)) {
                  console.log(`🎯 FALLBACK navigation trigger found: "${match[0]}" → "${destination}"`);
                  
                  if (multiNavigate(destination, `Assistant navigation: ${match[0]}`)) {
                    return; // Exit early if navigation successful
                  }
                } else if (destination) {
                  console.log(`⚠️ Invalid navigation destination: "${destination}" from "${match[0]}"`);
                } else {
                  console.log(`🔍 Navigation intent detected but no clear destination: "${match[0]}"`);
                }
              }
            }
          }
        } else if (message.type === 'function-call') {
          console.log('🔧 Function call received:', message);
          
          // Handle navigation function calls
          const result = handleNavigationCall(message.functionCall);
          
          // Send result back to Vapi
          if (result) {
            console.log('📤 Sending function result:', result);
            // Note: In a real implementation, you'd send this back to Vapi
            // For now, we'll just log it and add to transcript if there's a message
            if (result.message) {
              setTranscript(prev => [...prev, {
                role: 'assistant',
                text: result.message,
                timestamp: new Date()
              }]);
            }
          }
        }
      });

      // Enhanced error handling for timeout issues
      vapiInstance.on('error', (error) => {
        console.error('❌ Vapi error occurred:', {
          error,
          message: error.message,
          type: error.type,
          timestamp: new Date().toISOString()
        });
        
        let errorMessage = 'Unknown error';
        if (error.message) {
          errorMessage = error.message;
        } else if (error.type) {
          errorMessage = `Error: ${error.type}`;
        }
        
        // Check for common timeout/connection issues
        if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
          errorMessage = 'Connection timeout. Please check your internet and try again.';
        } else if (errorMessage.includes('microphone') || errorMessage.includes('media')) {
          errorMessage = 'Microphone access denied. Please allow microphone permissions.';
        }
        
        setError(errorMessage);
        setIsConnected(false);
      });

      console.log('✅ Vapi instance created successfully');

      return () => {
        try {
          vapiInstance?.stop();
        } catch (err) {
          console.warn('Warning stopping Vapi:', err);
        }
      };
    } catch (err) {
      console.error('❌ Vapi initialization failed:', err);
      setError(`Initialization failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [apiKey, assistantId]);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  const startCall = useCallback(() => {
    if (!vapi || !assistantId) {
      setError('Voice assistant not ready');
      return;
    }

    try {
      console.log('🎙️ Starting voice session with navigation capabilities...');
      setError(null);
      
      // Start with minimal config - tools should be configured in Vapi dashboard
      vapi.start(assistantId);
      
      console.log('✅ Call started successfully with navigation capabilities');
      console.log('🧭 Navigation handler ready for:', ['home', 'login', 'register', 'booking', 'chat', 'forum', 'resources', 'gamification', 'admin', 'counselor-panel', 'institute-panel', 'test', 'anonymous-login']);
    } catch (err) {
      console.error('❌ Failed to start call:', err);
      const errorMsg = err instanceof Error ? err.message : String(err);
      
      if (errorMsg.includes('assistant')) {
        setError(`Assistant not found. Please verify Assistant ID in Vapi dashboard.`);
      } else if (errorMsg.includes('auth')) {
        setError(`Authentication failed. Please check your API key.`);
      } else {
        setError(`Failed to start: ${errorMsg}`);
      }
    }
  }, [vapi, assistantId]);

  const endCall = useCallback(() => {
    if (vapi) {
      console.log('🔚 Ending voice session...');
      vapi.stop();
    }
  }, [vapi]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    if (isSpeaking) return '#ef4444';
    return currentTheme.primaryColor;
  };

  const getStatusText = () => {
    if (isSpeaking) return 'Assistant Speaking...';
    return 'Listening...';
  };

  if (error) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <Card 
          className="w-96 shadow-2xl"
          style={{ 
            backgroundColor: currentTheme.backgroundColor,
            borderColor: currentTheme.borderColor,
            border: `1px solid ${currentTheme.borderColor}`
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2" style={{ color: '#ef4444' }}>
              <MicOff className="h-4 w-4" />
              <span className="text-sm font-medium">Voice Assistant Error</span>
            </div>
            <p className="text-sm mb-3" style={{ color: '#dc2626' }}>{error}</p>
            
            <div 
              className="p-3 rounded-lg mb-3"
              style={{ backgroundColor: currentTheme.secondaryColor }}
            >
              <p className="text-sm font-medium mb-2" style={{ color: '#f59e0b' }}>💡 Common Issues:</p>
              <ul className="text-xs space-y-1 list-disc list-inside" style={{ color: '#d97706' }}>
                <li><strong>30-second timeout:</strong> Usually microphone permission denied</li>
                <li><strong>Network error:</strong> Check internet connection</li>
                <li><strong>Unknown error:</strong> Try refreshing the page</li>
              </ul>
            </div>
            
            <div className="text-xs space-y-1 mb-3" style={{ color: '#dc2626' }}>
              <p><strong>Debug Info:</strong></p>
              <p>API Key: {apiKey ? `✓ ${apiKey.substring(0, 10)}...` : '✗ Missing'}</p>
              <p>Assistant ID: {assistantId ? `✓ ${assistantId}` : '✗ Missing'}</p>
              <p>Vapi Instance: {vapi ? '✓ Initialized' : '✗ Not initialized'}</p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => setError(null)} 
                variant="outline" 
                size="sm" 
                className="flex-1"
              >
                Retry
              </Button>
              <Button 
                onClick={() => {
                  window.open('https://dashboard.vapi.ai/assistants', '_blank');
                }} 
                variant="default" 
                size="sm" 
                className="flex-1"
              >
                Open Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {!isConnected ? (
        <Button
          onClick={startCall}
          className="h-16 w-16 rounded-full shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl"
          style={{
            backgroundColor: currentTheme.primaryColor,
            color: '#fff',
          }}
          disabled={!vapi || !assistantId}
          title="Start Voice Counseling Session"
        >
          <Mic className="h-6 w-6" />
        </Button>
      ) : (
        <Card 
          className="w-80 shadow-2xl"
          style={{ 
            backgroundColor: currentTheme.backgroundColor,
            borderColor: currentTheme.borderColor,
            border: `1px solid ${currentTheme.borderColor}`
          }}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle 
                className="text-sm font-semibold flex items-center gap-2"
                style={{ color: currentTheme.textColor }}
              >
                <div 
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ backgroundColor: getStatusColor() }}
                />
                Voice Session
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className="text-xs"
                  style={{ 
                    borderColor: currentTheme.borderColor,
                    color: currentTheme.textColor 
                  }}
                >
                  {formatDuration(callDuration)}
                </Badge>
                <Button
                  onClick={endCall}
                  variant="destructive"
                  size="sm"
                  className="h-7 px-2"
                >
                  <PhoneOff className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <p 
              className="text-xs" 
              style={{ color: currentTheme.textColor, opacity: 0.7 }}
            >
              {getStatusText()}
            </p>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div 
              className="max-h-48 overflow-y-auto mb-3 p-2 rounded-lg"
              style={{ backgroundColor: currentTheme.secondaryColor }}
            >
              {transcript.length === 0 ? (
                <p 
                  className="text-xs text-center py-3"
                  style={{ color: currentTheme.textColor, opacity: 0.6 }}
                >
                  Conversation will appear here...
                  <br />
                  <span className="text-xs">Speak naturally to begin</span>
                </p>
              ) : (
                <div className="space-y-2">
                  {transcript.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className="max-w-[85%] p-2 rounded-lg text-xs"
                        style={{
                          backgroundColor: msg.role === 'user' 
                            ? currentTheme.primaryColor 
                            : theme === 'dark' ? '#374151' : '#f3f4f6',
                          color: msg.role === 'user' 
                            ? '#ffffff' 
                            : currentTheme.textColor,
                          borderBottomRightRadius: msg.role === 'user' ? '2px' : undefined,
                          borderBottomLeftRadius: msg.role === 'assistant' ? '2px' : undefined
                        }}
                      >
                        <p className="mb-1">{msg.text}</p>
                        <span 
                          className="text-xs opacity-70"
                          style={{
                            color: msg.role === 'user' 
                              ? 'rgba(255,255,255,0.7)' 
                              : `${currentTheme.textColor}80`
                          }}
                        >
                          {msg.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div 
              className="flex items-center justify-center pt-2"
              style={{ borderTop: `1px solid ${currentTheme.borderColor}` }}
            >
              <div className="flex items-center gap-2 text-xs" style={{ color: currentTheme.textColor, opacity: 0.7 }}>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Confidential Session</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VapiWidget;