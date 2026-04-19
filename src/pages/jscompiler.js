import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import {
  Box,
  Typography,
  Paper,
  Tab,
  Tabs,
  useTheme,
  useMediaQuery,
  Button,
  CircularProgress,
} from '@mui/material';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const DEFAULT_CODE = `// Example JavaScript code
const numbers = [1, 2, 3, 4];
const doubled = numbers.map((n) => n * 2);

console.log("Doubled:", doubled);
console.warn("This is a sample warning");

doubled.reduce((sum, value) => sum + value, 0);`;

const Compiler = () => {
  // Suppress ResizeObserver loop errors (caused by Monaco on resize)
  useEffect(() => {
    const handler = (e) => {
      if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    };
    window.addEventListener('error', handler);
    return () => window.removeEventListener('error', handler);
  }, []);

  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState('');
  const [consoleMessages, setConsoleMessages] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const consoleContainerRef = useRef(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleEditorDidMount = () => {
    setIsEditorReady(true);
  };

  const formatValue = (value) => {
    if (typeof value === 'string') {
      return value;
    }
    if (typeof value === 'undefined') {
      return 'undefined';
    }
    try {
      return JSON.stringify(value, null, 2);
    } catch (error) {
      return String(value);
    }
  };

  const executeCode = () => {
    if (isRunning) {
      return;
    }

    setIsRunning(true);
    const runStart = Date.now();

    window.requestAnimationFrame(() => {
      const nextConsoleMessages = [];

      const pushMessage = (type, args) => {
        const message = args.map((item) => formatValue(item)).join(' ');
        nextConsoleMessages.push({
          type,
          message
        });
      };

      const originalConsoleLog = console.log;
      const originalConsoleWarn = console.warn;
      const originalConsoleError = console.error;

      console.log = (...args) => {
        pushMessage('log', args);
        originalConsoleLog(...args);
      };
      console.warn = (...args) => {
        pushMessage('warn', args);
        originalConsoleWarn(...args);
      };
      console.error = (...args) => {
        pushMessage('error', args);
        originalConsoleError(...args);
      };

      let nextOutput = '';

      try {
        const result = eval(code);
        nextOutput = typeof result === 'undefined'
          ? '✅ Execution completed successfully.'
          : formatValue(result);
      } catch (error) {
        const errorMessage = `❌ Error: ${error.message}`;
        nextOutput = errorMessage;
        nextConsoleMessages.push({ type: 'error', message: errorMessage });
        setActiveTab(1);
      } finally {
        console.log = originalConsoleLog;
        console.warn = originalConsoleWarn;
        console.error = originalConsoleError;
      }

      setOutput(nextOutput);
      setConsoleMessages(nextConsoleMessages);
      const elapsed = Date.now() - runStart;
      const minimumRunningStateMs = 300;
      const remainingDelay = Math.max(0, minimumRunningStateMs - elapsed);

      window.setTimeout(() => {
        setIsRunning(false);
      }, remainingDelay);
    });
  };

  const resetEditor = () => {
    setCode(DEFAULT_CODE);
    setOutput('');
    setConsoleMessages([]);
    setActiveTab(0);
  };

  const clearConsole = () => {
    setConsoleMessages([]);
  };

  useEffect(() => {
    if (activeTab === 1 && consoleContainerRef.current) {
      consoleContainerRef.current.scrollTop = consoleContainerRef.current.scrollHeight;
    }
  }, [consoleMessages, activeTab]);

  useEffect(() => {
    if (!isEditorReady) {
      return;
    }

    const timer = setTimeout(() => {
      executeCode();
    }, 500);

    return () => clearTimeout(timer);
  }, [code, isEditorReady]);

  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 130px)',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #eef2f5 100%)',
          p: isMobile ? 2 : 3,
          gap: 2.5
        }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid rgba(226, 232, 240, 0.8)',
            backgroundColor: '#ffffff',
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1.5,
            flexWrap: 'wrap',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.2px' }}>
            JavaScript Playground
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Button
              onClick={executeCode}
              disabled={isRunning || !isEditorReady}
              variant="contained"
              size="small"
              startIcon={isRunning ? <CircularProgress size={14} sx={{ color: '#ffffff' }} /> : null}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8rem',
                px: 2,
                bgcolor: '#f97316',
                boxShadow: '0 4px 12px rgba(249, 115, 22, 0.25)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#ea580c',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 16px rgba(249, 115, 22, 0.35)'
                }
              }}
            >
              {isRunning ? 'Running...' : '▶ Run'}
            </Button>
            <Button
              onClick={resetEditor}
              variant="outlined"
              size="small"
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8rem',
                borderColor: '#cbd5e1',
                color: '#475569',
                '&:hover': {
                  borderColor: '#94a3b8',
                  backgroundColor: '#f8fafc',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              ↺ Reset
            </Button>
            <Button
              onClick={clearConsole}
              variant="outlined"
              size="small"
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8rem',
                borderColor: '#cbd5e1',
                color: '#475569',
                '&:hover': {
                  borderColor: '#94a3b8',
                  backgroundColor: '#f8fafc',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              ⌧ Clear
            </Button>
          </Box>
        </Paper>

        <Box
          sx={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: 2.5
          }}
        >
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              border: '1px solid rgba(226, 232, 240, 0.8)',
              backgroundColor: '#ffffff',
              boxShadow: '0 8px 20px rgba(0,0,0,0.04)',
              overflow: isMobile ? 'visible' : 'hidden',
              transition: 'box-shadow 0.2s ease',
              '&:hover': {
                boxShadow: '0 12px 28px rgba(0,0,0,0.06)'
              }
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1.2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
                backgroundColor: '#fafcff'
              }}
            >
              <Typography sx={{ color: '#0f172a', fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.2 }}>
                ✏️ JavaScript Editor
              </Typography>
              <Typography sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.7rem', fontFamily: 'monospace' }}>
                ES6+
              </Typography>
            </Box>

            <Box
              sx={{
                flex: isMobile ? '0 0 auto' : 1,
                height: isMobile ? '250px' : 'auto',
                minHeight: isMobile ? 'auto' : 600,
                overflow: 'hidden',
                touchAction: 'pan-y',
                bgcolor: '#0f172a',
                '& .monaco-editor, & .monaco-editor .overflow-guard, & .monaco-editor textarea': {
                  touchAction: 'pan-y !important',
                },
                '& .monaco-editor .scrollbar': {
                  touchAction: 'auto !important',
                },
              }}
            >
              <Editor
                height="100%"
                language="javascript"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: !isMobile },
                  fontSize: isMobile ? 13 : 14,
                  fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                  lineHeight: 23,
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 16, bottom: 16 },
                  lineNumbersMinChars: isMobile ? 3 : 4,
                  smoothScrolling: true,
                  cursorBlinking: 'smooth',
                  renderWhitespace: 'selection',
                  scrollbar: {
                    vertical: 'visible',
                    horizontal: 'visible',
                    useShadows: false,
                    verticalHasArrows: false,
                    horizontalHasArrows: false,
                  },
                }}
              />
            </Box>
          </Paper>

          {/* Output/Console Panel - Fixed to take remaining height on mobile */}
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              border: '1px solid rgba(226, 232, 240, 0.8)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.04)',
              overflow: 'hidden',
              backgroundColor: '#ffffff',
              transition: 'box-shadow 0.2s ease',
              flex: 1, // Allow this panel to grow
              minHeight: isMobile ? '300px' : 'auto', // Ensure minimum height on mobile
              '&:hover': {
                boxShadow: '0 12px 28px rgba(0,0,0,0.06)'
              }
            }}
          >
            <Box sx={{ borderBottom: '1px solid rgba(148, 163, 184, 0.2)', backgroundColor: '#fafcff' }}>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant={isMobile ? 'fullWidth' : 'standard'}
                sx={{
                  minHeight: 44,
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    minHeight: 44,
                    color: '#64748b'
                  },
                  '& .Mui-selected': {
                    color: '#f97316'
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#f97316',
                    height: 3,
                    borderRadius: '3px 3px 0 0'
                  }
                }}
              >
                <Tab label="📤 Output" />
                <Tab label="📟 Console" />
              </Tabs>
            </Box>

            {activeTab === 0 ? (
              <Box
                sx={{
                  flex: 1,
                  p: 2,
                  overflowY: 'auto',
                  bgcolor: '#ffffff',
                  color: '#0f172a',
                  fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                  whiteSpace: 'pre-wrap',
                  fontSize: isMobile ? '0.8rem' : '0.88rem',
                  lineHeight: 1.6,
                  borderTop: '1px solid #f1f5f9'
                }}
              >
                {output ? (
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <Typography component="span" sx={{ color: '#10b981', fontWeight: 600, fontSize: '1rem' }}>
                      ▸
                    </Typography>
                    <Typography component="span" sx={{ wordBreak: 'break-word' }}>
                      {output}
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
                    <Typography variant="body2">✨ Run your code to see the output</Typography>
                  </Box>
                )}
              </Box>
            ) : (
              <Box
                ref={consoleContainerRef}
                sx={{
                  flex: 1,
                  p: 2,
                  overflowY: 'auto',
                  bgcolor: '#0f172a',
                  fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                  fontSize: isMobile ? '0.8rem' : '0.85rem',
                  lineHeight: 1.6
                }}
              >
                {consoleMessages.length === 0 ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                      🟢 Console output will appear here
                    </Typography>
                  </Box>
                ) : (
                  consoleMessages.map((entry, index) => (
                    <Box
                      key={`${entry.type}-${index}`}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1,
                        mb: 1.2,
                        pb: 0.5,
                        borderBottom: index !== consoleMessages.length - 1 ? '1px solid rgba(71, 85, 105, 0.3)' : 'none',
                        color: entry.type === 'error'
                          ? '#f87171'
                          : entry.type === 'warn'
                            ? '#fbbf24'
                            : '#e2e8f0',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}
                    >
                      <Typography component="span" sx={{ 
                        fontWeight: 600, 
                        fontSize: '0.7rem',
                        color: entry.type === 'error'
                          ? '#f87171'
                          : entry.type === 'warn'
                            ? '#fbbf24'
                            : '#38bdf8',
                        minWidth: '45px'
                      }}>
                        {entry.type === 'error' ? '✗' : entry.type === 'warn' ? '⚠' : '›'}
                      </Typography>
                      <Typography component="span" sx={{ flex: 1 }}>
                        {entry.message}
                      </Typography>
                    </Box>
                  ))
                )}
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default Compiler;