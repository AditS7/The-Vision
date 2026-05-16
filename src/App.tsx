import { useState, useRef, useEffect } from 'react';
import { Loader2, Sparkles, Download, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

const RATIOS: { id: AspectRatio; label: string; icon: React.ReactNode }[] = [
  { 
    id: '1:1', 
    label: 'Square', 
    icon: <div className="w-4 h-4 border-2 border-current rounded-[3px]" /> 
  },
  { 
    id: '16:9', 
    label: 'Landscape', 
    icon: <div className="w-5 h-3 border-2 border-current rounded-[3px]" /> 
  },
  { 
    id: '9:16', 
    label: 'Portrait', 
    icon: <div className="w-3 h-5 border-2 border-current rounded-[3px]" /> 
  },
];

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [prompt]);

  // Intro Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    // On mobile, scroll to canvas area gracefully
    if (window.innerWidth < 768) {
      setTimeout(() => {
        canvasRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }

    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, aspectRatio }),
      });

      if (!response.ok) {
        let errorMsg = "Generation failed";
        try {
          const errData = await response.json();
          errorMsg = errData.error || errorMsg;
        } catch {
          errorMsg = await response.text();
        }
        throw new Error(errorMsg);
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedImage(imageUrl);
    } catch (err: any) {
      console.error('Generation Error:', err);
      setError(err.message || 'An error occurred while generating the image.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const a = document.createElement('a');
    a.href = generatedImage;
    a.download = `generation-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div
             key="intro"
             initial={{ opacity: 1 }}
             exit={{ opacity: 0, filter: "blur(20px)", scale: 1.05 }}
             transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
             className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg-base text-white overflow-hidden pointer-events-auto"
          >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50" />
              
              <motion.div
                 initial={{ opacity: 0, scale: 0.5 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 2.5, ease: "easeOut" }}
                 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.03] rounded-full blur-[100px] pointer-events-none"
              />

              <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                 className="relative z-10 flex flex-col items-center"
              >
                  <div className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center mb-6 overflow-hidden relative">
                     <motion.div 
                       initial={{ rotate: 0 }}
                       animate={{ rotate: 360 }}
                       transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                       className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent" 
                     />
                     <div className="absolute inset-[1px] bg-bg-base rounded-full" />
                     <Sparkles className="w-6 h-6 text-white relative z-10" />
                  </div>
                  
                  <div className="overflow-hidden">
                     <motion.h1 
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                        className="font-display text-4xl tracking-[0.2em] font-light mb-4 text-center ml-[0.2em]"
                     >
                        THE VISION
                     </motion.h1>
                  </div>

                  <motion.div 
                     initial={{ width: 0, opacity: 0 }}
                     animate={{ width: "100%", opacity: 1 }}
                     transition={{ duration: 1.5, ease: "easeInOut", delay: 0.6 }}
                     className="h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent w-full max-w-[200px]"
                  />

                  <div className="overflow-hidden mt-4 flex flex-col items-center">
                     <motion.p 
                        initial={{ y: "-100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1 }}
                        className="text-[10px] font-semibold tracking-[0.3em] uppercase text-white/40 mb-2"
                     >
                        AI Image Generation
                     </motion.p>
                     <motion.p
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
                        className="text-[8px] font-medium tracking-[0.3em] uppercase text-white/20"
                     >
                        Developed by Adit
                     </motion.p>
                  </div>
              </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-bg-base text-white flex flex-col md:flex-row font-sans selection:bg-white/30 selection:text-white">
      {/* Sidebar Controls */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full md:w-[380px] lg:w-[420px] flex-shrink-0 border-b md:border-b-0 md:border-r border-white/5 bg-bg-panel/50 backdrop-blur-3xl flex flex-col h-auto md:h-screen md:sticky md:top-0 z-20"
      >
        <div className="p-6 md:p-8 border-b border-white/5">
          <h1 className="font-display text-3xl font-light tracking-tight mb-1">The Vision</h1>
          <p className="text-white/40 text-[10px] font-semibold tracking-[0.2em] uppercase">AI Image Generation</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10">
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-semibold tracking-[0.15em] uppercase text-white/50">
                Prompt Directive
              </label>
              {prompt.length > 0 && (
                <button 
                  onClick={() => setPrompt('')}
                  className="text-[10px] uppercase tracking-wider text-white/30 hover:text-white/70 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl blur-sm" />
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your vision..."
                className="relative w-full min-h-[120px] bg-white/5 border border-white/10 rounded-2xl p-5 text-sm md:text-base leading-relaxed text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all resize-none shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-semibold tracking-[0.15em] uppercase text-white/50">
              Format Matrix
            </label>
            <div className="grid grid-cols-3 gap-3">
              {RATIOS.map((ratio) => (
                <button
                  key={ratio.id}
                  onClick={() => setAspectRatio(ratio.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${
                    aspectRatio === ratio.id 
                      ? 'border-white/40 bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]' 
                      : 'border-white/5 bg-transparent hover:bg-white/5 text-white/40 hover:text-white/80'
                  }`}
                >
                  <div className="mb-3 opacity-80">{ratio.icon}</div>
                  <span className="text-[10px] font-medium tracking-wider uppercase">{ratio.label}</span>
                  <span className="text-[9px] text-white/30 tracking-widest mt-1">{ratio.id}</span>
                </button>
              ))}
            </div>
          </div>
          
        </div>

        <div className="p-6 md:p-8 pt-0 mt-auto border-t border-white/5 bg-bg-panel/50 backdrop-blur-md">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="group relative w-full h-14 rounded-2xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-opacity focus:outline-none"
          >
            <div className="absolute inset-0 bg-white" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            
            <div className="relative h-full flex items-center justify-center gap-2 text-black font-medium tracking-wide">
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Vision</span>
                </>
              )}
            </div>
          </button>
        </div>
      </motion.div>

      {/* Main Canvas Area */}
      <div 
        ref={canvasRef}
        className="flex-1 flex flex-col items-center justify-center min-h-[100dvh] md:min-h-screen relative p-6 md:p-12 overflow-hidden bg-bg-base"
      >
        {/* Atmospheric grid & glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-[100px]" />
          
          {isGenerating && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/[0.04] rounded-full blur-[80px]" 
            />
          )}
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl backdrop-blur-xl shadow-2xl max-w-lg w-[calc(100%-3rem)] md:w-auto text-sm"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center mt-10 md:mt-0">
          <AnimatePresence mode="wait">
            {generatedImage ? (
              <motion.div
                key="image"
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(20px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group relative inline-flex flex-col max-h-full max-w-full"
              >
                <div className="relative rounded-lg shadow-2xl ring-1 ring-white/10 overflow-hidden bg-black/40">
                  <img 
                    src={generatedImage} 
                    alt="Generated by AI" 
                    className="w-auto h-auto max-w-full max-h-[70vh] md:max-h-[85vh] object-contain"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full transition-all hover:scale-105 active:scale-95 shadow-2xl"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm font-medium tracking-wide">Save High-Res</span>
                    </button>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-white/30">
                    Resolution Scale {aspectRatio}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-white/20"
              >
                <div className="w-24 h-24 border border-white/5 border-dashed rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 opacity-20" />
                </div>
                <p className="font-display text-lg font-light tracking-wide">Awaiting Directive</p>
                <p className="text-sm text-white/30 mt-2 max-w-[280px] text-center font-light leading-relaxed">
                  Enter a descriptive prompt in the matrix panel to synthesize a new vision.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
    </>
  );
}

