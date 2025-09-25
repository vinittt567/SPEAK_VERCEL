import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function NavigationTest() {
  const navigate = useNavigate();
  const location = useLocation();

  const testRoutes = [
    { name: 'Home', path: '/' },
    { name: 'Chat', path: '/chat' },
    { name: 'Booking', path: '/booking' },
    { name: 'Forum', path: '/forum' },
    { name: 'Resources', path: '/resources' },
    { name: 'Gamification', path: '/gamification' },
    { name: 'Admin', path: '/admin' },
    { name: 'Counselor Panel', path: '/panel/counselor' },
    { name: 'Institute Panel', path: '/panel/institute' },
    { name: 'Admin Login', path: '/login/admin' },
  ];

  const testNavigation = (path: string) => {
    console.log(`🧪 Testing navigation to: ${path}`);
    try {
      navigate(path);
      console.log(`✅ Navigation successful to: ${path}`);
    } catch (error) {
      console.error(`❌ Navigation failed to: ${path}`, error);
    }
  };

  const testVapiNavigation = (page: string) => {
    console.log(`🎙️ Testing Vapi navigation to: ${page}`);
    if ((window as any).vapiNavigate) {
      const result = (window as any).vapiNavigate(page);
      console.log(`Vapi navigation result:`, result);
    } else {
      console.error('❌ Vapi navigation not available. Make sure VapiWidget is loaded.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>🧭 Navigation Test Page</CardTitle>
          <Badge variant="outline">Current: {location.pathname}</Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* React Router Navigation Test */}
          <div>
            <h3 className="text-lg font-semibold mb-3">React Router Navigation Test</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {testRoutes.map((route) => (
                <Button
                  key={route.path}
                  variant="outline"
                  size="sm"
                  onClick={() => testNavigation(route.path)}
                  className={location.pathname === route.path ? 'bg-primary text-primary-foreground' : ''}
                >
                  {route.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Vapi Navigation Test */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Vapi Voice Navigation Test</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                'home', 'chat', 'booking', 'forum', 
                'resources', 'admin', 'counselor-panel', 'institute-panel', 'login-admin'
              ].map((page) => (
                <Button
                  key={page}
                  variant="secondary"
                  size="sm"
                  onClick={() => testVapiNavigation(page)}
                >
                  Voice → {page}
                </Button>
              ))}
            </div>
          </div>

          {/* Console Commands */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Console Commands</h3>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm mb-2">Open browser console (F12) and try these commands:</p>
              <code className="text-xs block space-y-1">
                <div>window.vapiNavigate("home") // Should go to /</div>
                <div>window.vapiNavigate("chat") // Should go to /chat</div>
                <div>window.vapiNavigate("booking") // Should go to /booking</div>
                <div>window.vapiNavigate("forum") // Should go to /forum</div>
                <div>window.vapiNavigate("resources") // Should go to /resources</div>
                <div>window.vapiNavigate("admin") // Should go to /admin</div>
                <div>window.vapiNavigate("counselor-panel") // Should go to /panel/counselor</div>
                <div>window.vapiNavigate("institute-panel") // Should go to /panel/institute</div>
                <div>window.vapiNavigate("login-admin") // Should go to /login/admin</div>
                <div>window.testVapiNavigation() // Shows available commands</div>
              </code>
            </div>
          </div>

          {/* Debug Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Debug Information</h3>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="text-sm space-y-1">
                <p><strong>Current Path:</strong> {location.pathname}</p>
                <p><strong>Vapi Available:</strong> {(window as any).vapiNavigate ? '✅ Yes' : '❌ No'}</p>
                <p><strong>Test Available:</strong> {(window as any).testVapiNavigation ? '✅ Yes' : '❌ No'}</p>
                <p><strong>User Agent:</strong> {navigator.userAgent.substring(0, 50)}...</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Voice Navigation Instructions</h3>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm mb-2">Try saying these voice commands:</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>"Take me to booking"</li>
                <li>"Go to forum"</li>
                <li>"Navigate to resources"</li>
                <li>"Show me the admin panel"</li>
                <li>"Take me to gamification"</li>
                <li>"What page am I on?"</li>
              </ul>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}