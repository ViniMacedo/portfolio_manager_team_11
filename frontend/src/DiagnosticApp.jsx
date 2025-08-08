import React, { useState, useEffect } from 'react';

const DiagnosticApp = () => {
  const [tests, setTests] = useState({
    react: { status: 'loading', message: 'Testing React...' },
    css: { status: 'loading', message: 'Testing CSS...' },
    api: { status: 'loading', message: 'Testing API...' },
    imports: { status: 'loading', message: 'Testing imports...' }
  });

  useEffect(() => {
    const runTests = async () => {
      // Test React
      setTests(prev => ({
        ...prev,
        react: { status: 'success', message: 'React is working ✓' }
      }));

      // Test CSS/Tailwind
      const testElement = document.createElement('div');
      testElement.className = 'bg-blue-500';
      document.body.appendChild(testElement);
      const styles = window.getComputedStyle(testElement);
      const backgroundColor = styles.backgroundColor;
      document.body.removeChild(testElement);
      
      if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        setTests(prev => ({
          ...prev,
          css: { status: 'success', message: 'CSS/Tailwind is working ✓' }
        }));
      } else {
        setTests(prev => ({
          ...prev,
          css: { status: 'error', message: 'CSS/Tailwind not working ✗' }
        }));
      }

      // Test imports
      try {
        const { fetchPortfolioById } = await import('./services/api.js');
        setTests(prev => ({
          ...prev,
          imports: { status: 'success', message: 'API imports working ✓' }
        }));

        // Test API
        try {
          await fetchPortfolioById(1);
          setTests(prev => ({
            ...prev,
            api: { status: 'success', message: 'Backend API accessible ✓' }
          }));
        } catch (error) {
          setTests(prev => ({
            ...prev,
            api: { status: 'warning', message: `Backend API not accessible (${error.message}) ⚠️` }
          }));
        }
      } catch (error) {
        setTests(prev => ({
          ...prev,
          imports: { status: 'error', message: `Import error: ${error.message} ✗` }
        }));
      }
    };

    runTests();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Portfolio Manager Diagnostics
        </h1>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-6">System Tests</h2>
          
          <div className="space-y-4">
            {Object.entries(tests).map(([testName, result]) => (
              <div key={testName} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <span className="text-white capitalize font-medium">{testName}</span>
                <span className={`font-mono text-sm ${getStatusColor(result.status)}`}>
                  {result.message}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-white/20">
            <button 
              onClick={() => window.location.href = '/?app=main'} 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Try Loading Main App
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/70 text-sm">
            If all tests pass, the main app should work. If some fail, check the console for details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticApp;
