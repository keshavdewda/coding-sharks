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
  CircularProgress
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
          ? 'Execution completed successfully.'
          : formatValue(result);
      } catch (error) {
        const errorMessage = `Error: ${error.message}`;
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
          minHeight: isMobile ? 'auto' : '80vh',
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          p: isMobile ? 1.5 : 2.5,
          gap: 2
        }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            flexWrap: 'wrap'
          }}
        >
          <Typography variant="body2" sx={{ color: '#334155', fontWeight: 600 }}>
            JS Compiler Controls
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              onClick={executeCode}
              disabled={isRunning || !isEditorReady}
              variant="contained"
              size="small"
              startIcon={isRunning ? <CircularProgress size={14} sx={{ color: '#ffffff' }} /> : null}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                bgcolor: '#f97316',
                boxShadow: '0 4px 12px rgba(249, 115, 22, 0.28)',
                transition: '0.2s ease',
                '&:hover': {
                  bgcolor: '#ea580c',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 8px 16px rgba(249, 115, 22, 0.3)'
                }
              }}
            >
              {isRunning ? 'Running...' : 'Run'}
            </Button>
            <Button
              onClick={resetEditor}
              variant="outlined"
              size="small"
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderColor: '#cbd5e1',
                color: '#334155',
                boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
                transition: '0.2s ease',
                '&:hover': {
                  borderColor: '#94a3b8',
                  backgroundColor: '#f8fafc',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 10px rgba(15, 23, 42, 0.12)'
                }
              }}
            >
              Reset
            </Button>
            <Button
              onClick={clearConsole}
              variant="outlined"
              size="small"
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderColor: '#cbd5e1',
                color: '#334155',
                boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
                transition: '0.2s ease',
                '&:hover': {
                  borderColor: '#94a3b8',
                  backgroundColor: '#f8fafc',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 10px rgba(15, 23, 42, 0.12)'
                }
              }}
            >
              Clear Console
            </Button>
          </Box>
        </Paper>

        <Box
          sx={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: 2
          }}
        >
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '8px',
              border: '1px solid #eee',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                px: 1.5,
                py: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(148, 163, 184, 0.25)',
                backgroundColor: '#f8fafc'
              }}
            >
              <Typography sx={{ color: '#1e293b', fontWeight: 600, fontSize: '0.92rem' }}>
                JavaScript Editor
              </Typography>
              <Typography sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.78rem' }}>
                Monaco
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                minHeight: isMobile ? 300 : 560,
                bgcolor: '#0f172a',
                borderTop: '1px solid rgba(148, 163, 184, 0.18)'
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
                  fontFamily: "'Fira Code', Consolas, 'Courier New', monospace",
                  lineHeight: 22,
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 16, bottom: 16 },
                  lineNumbersMinChars: isMobile ? 3 : 4,
                  smoothScrolling: true
                }}
              />
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              border: '1px solid #e2e8f0',
              boxShadow: '0 6px 18px rgba(15, 23, 42, 0.06)',
              overflow: 'hidden',
              borderLeft: '1px solid #eee',
              position: 'relative',
              '&::before': isMobile
                ? undefined
                : {
                    content: '""',
                    position: 'absolute',
                    left: -10,
                    top: 16,
                    bottom: 16,
                    width: 1,
                    backgroundColor: 'rgba(148, 163, 184, 0.28)'
                  }
            }}
          >
            <Box sx={{ borderBottom: '1px solid rgba(148, 163, 184, 0.3)', backgroundColor: '#f8fafc' }}>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant={isMobile ? 'fullWidth' : 'standard'}
                sx={{
                  minHeight: 42,
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    minHeight: 42,
                    color: '#475569'
                  },
                  '& .Mui-selected': {
                    color: '#0f172a'
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#f97316'
                  }
                }}
              >
                <Tab label="Output" />
                <Tab label="Console" />
              </Tabs>
            </Box>

            {activeTab === 0 ? (
              <Box
                sx={{
                  flex: 1,
                  p: '16px',
                  minHeight: isMobile ? 220 : 560,
                  overflowY: 'auto',
                  bgcolor: '#fafafa',
                  color: '#0f172a',
                  fontFamily: "'Fira Code', Consolas, 'Courier New', monospace",
                  whiteSpace: 'pre-wrap',
                  fontSize: isMobile ? '0.78rem' : '0.86rem',
                  lineHeight: 1.6
                }}
              >
                {output || 'Run your code to see output'}
              </Box>
            ) : (
              <Box
                ref={consoleContainerRef}
                sx={{
                  flex: 1,
                  p: isMobile ? 2 : 2.5,
                  minHeight: isMobile ? 220 : 560,
                  overflow: 'auto',
                  bgcolor: '#fafafa',
                  fontFamily: "'Fira Code', Consolas, 'Courier New', monospace",
                  fontSize: isMobile ? '0.78rem' : '0.84rem',
                  lineHeight: 1.55
                }}
              >
                {consoleMessages.length === 0 ? (
                  <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                    Console output will appear here
                  </Typography>
                ) : (
                  consoleMessages.map((entry, index) => (
                    <Box
                      key={`${entry.type}-${index}`}
                      sx={{
                        color:
                          entry.type === 'error'
                            ? '#f44336'
                            : entry.type === 'warn'
                              ? '#ff9800'
                              : 'inherit',
                        mb: 1,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}
                    >
                      {entry.message}
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












