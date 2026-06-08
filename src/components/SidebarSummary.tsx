import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, BookOpen, Quote, Copy, Check, FileDown, ExternalLink, Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";
import { Paper, GeminiSummary } from "../types";

interface SidebarSummaryProps {
  paper: Paper | null;
  summary: GeminiSummary | null;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  isNightMode?: boolean;
}

export default function SidebarSummary({
  paper,
  summary,
  isLoading,
  isOpen,
  onClose,
  isNightMode = false
}: SidebarSummaryProps) {
  const [copied, setCopied] = useState(false);
  const [isImmersive, setIsImmersive] = useState(false);

  if (!isOpen || !paper) return null;

  const handleCopyCitation = () => {
    const citation = `"${paper.title}" by ${paper.authors.join(", ")} (${paper.publishedDate}). Indexed on Editorial Papers.`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-xs cursor-pointer"
        />

        {/* Sliding Panel */}
        <div className={`absolute inset-y-0 right-0 w-full flex justify-end transition-all duration-500 ease-in-out z-10 pointer-events-none ${
          isImmersive ? "pl-0" : "pl-4 sm:pl-10"
        }`}>
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className={`w-full border-l-4 shadow-2xl flex flex-col overflow-y-auto transition-all duration-500 ease-in-out pointer-events-auto ${
              isImmersive ? "max-w-full" : "max-w-2xl"
            } ${
              isNightMode ? "bg-[#0D1017] text-stone-100 border-stone-200" : "bg-[#FCFAF2] text-black border-black"
            }`}
          >
            {/* Editorial Cover Accent Header */}
            <div className={`p-6 relative border-b-2 transition-colors duration-300 ${
              isNightMode ? "bg-[#1E2538] border-stone-200" : "bg-[#EAEAFF] border-black"
            }`}>
              <div className={`w-full ${isImmersive ? "max-w-4xl mx-auto px-6 md:px-12 pr-32 md:pr-40" : ""}`}>
                <div className={`flex items-center gap-2 font-mono text-sm uppercase tracking-widest font-semibold mb-2 ${
                  isNightMode ? "text-[#EAEAFF]" : "text-[#4C49E1]"
                }`}>
                  <Sparkles className="w-4 h-4 fill-current animate-pulse" />
                  <span>Gemini Editorial review</span>
                </div>

                <h2 className={`font-serif text-3xl font-bold leading-tight max-w-[80%] transition-colors duration-300 ${
                  isNightMode ? "text-[#F7F5F0]" : "text-black"
                }`}>
                  {paper.title}
                </h2>

                <p className={`font-sans text-sm mt-3 font-semibold transition-colors duration-300 ${
                  isNightMode ? "text-stone-300" : "text-gray-700"
                }`}>
                  By {paper.authors.join(", ")}
                </p>

                <div className="flex flex-wrap gap-2 mt-4 select-none">
                  <span className={`px-3 py-1 text-xs font-mono font-bold border rounded-sm transition-colors duration-300 ${
                    isNightMode ? "bg-[#141924] border-stone-200 shadow-[1px_1px_0px_#EDEAE0]" : "bg-white border-black shadow-[1px_1px_0px_#000]"
                  }`}>
                    Published: {paper.publishedDate}
                  </span>
                  <span className={`px-3 py-1 text-xs font-mono font-bold border rounded-sm transition-colors duration-300 ${
                    isNightMode ? "bg-amber-900/40 text-amber-200 border-stone-250/50 shadow-[1px_1px_0px_#EDEAE0]" : "bg-amber-200 border-black shadow-[1px_1px_0px_#000]"
                  }`}>
                    ID: {paper.id}
                  </span>
                </div>
              </div>

              {/* Controls at top right */}
              <div className="absolute top-6 right-6 flex items-center gap-3">
                <button
                  onClick={() => setIsImmersive(!isImmersive)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 border-2 font-mono text-[10px] font-bold uppercase tracking-wider rounded-sm transition-all transform active:translate-y-0.5 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-0 ${
                    isNightMode 
                      ? "border-stone-200 bg-[#141924] text-[#EAEAFF] hover:bg-[#FFF275] hover:text-black shadow-[#EDEAE0] hover:shadow-none" 
                      : "border-black bg-white text-black hover:bg-[#FFF275] hover:text-black shadow-[2px_2px_0px_#000] hover:shadow-none"
                  }`}
                  title={isImmersive ? "Exit Full Focus Mode" : "Expand to Full Focus Mode"}
                >
                  {isImmersive ? (
                    <>
                      <Minimize2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Exit Focus</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Full Focus</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onClose}
                  className={`p-1.5 rounded-full border-2 transition-all transform active:scale-95 cursor-pointer ${
                    isNightMode 
                      ? "border-stone-200 bg-[#141924] text-white hover:bg-[#F2545B] hover:text-white shadow-[2px_2px_0px_#EDEAE0]" 
                      : "border-black bg-white hover:bg-[#F2545B] hover:text-white shadow-[2px_2px_0px_#000]"
                  }`}
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Interactive Details */}
            <div className={`flex-1 p-8 space-y-8 transition-all duration-300 ${
              isImmersive ? "max-w-4xl mx-auto w-full px-6 md:px-12" : ""
            }`}>
              {isLoading ? (
                /* Loading State Styled Like Custom Typing or Printing */
                <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 border-4 border-t-amber-500 rounded-full animate-spin border-stone-700"></div>
                    <Sparkles className="w-6 h-6 text-amber-500 absolute top-5 left-5 animate-pulse" />
                  </div>
                  <h3 className={`font-serif text-2xl font-bold italic ${isNightMode ? "text-[#F7F5F0]" : "text-black"}`}>Consulting the Oracle...</h3>
                  <p className={`font-mono text-xs max-w-sm mt-2 leading-relaxed ${isNightMode ? "text-stone-400" : "text-gray-500"}`}>
                    Gemini is processing the paper abstract, identifying high-concept gaps, and drafting standard independent publisher reviews.
                  </p>
                </div>
              ) : summary ? (
                <div className="space-y-8 animate-fade-in">
                  
                  {/* The Editorial Punchy Pitch */}
                  <div className={`border-2 p-5 rounded-md relative overflow-hidden transition-all duration-300 ${
                    isNightMode 
                      ? "bg-[#1A1A10] border-stone-200 shadow-[4px_4px_0px_#EDEAE0]" 
                      : "bg-[#FFFFD0] border-black shadow-[4px_4px_0px_#000]"
                  }`}>
                    <div className={`absolute top-0 right-0 px-3 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${
                      isNightMode ? "bg-[#FFF275] text-black" : "bg-black text-[#FFFFD0]"
                    }`}>
                      The Pitch
                    </div>
                    <p className={`font-serif text-2xl font-semibold italic leading-snug transition-colors duration-300 ${
                      isNightMode ? "text-stone-100" : "text-black"
                    }`}>
                      "{summary.pitch}"
                    </p>
                  </div>

                  {/* Standard Editorial Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Problem Column */}
                    <div className={`border-2 p-5 rounded-md space-y-2 transition-all duration-300 ${
                      isNightMode 
                        ? "bg-[#141924] border-stone-200 shadow-[4px_4px_0px_#EDEAE0]" 
                        : "bg-white border-black shadow-[4px_4px_0px_#000]"
                    }`}>
                      <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#E55934] border-b border-gray-200/20 pb-1 flex items-center gap-1">
                        <span>●</span> The Bottleneck
                      </h4>
                      <p className={`font-sans text-sm leading-relaxed font-normal transition-colors duration-300 ${
                        isNightMode ? "text-stone-300" : "text-gray-800"
                      }`}>
                        {summary.problem}
                      </p>
                    </div>

                    {/* Sauce Column */}
                    <div className={`border-2 p-5 rounded-md space-y-2 transition-all duration-300 ${
                      isNightMode 
                        ? "bg-[#141924] border-stone-200 shadow-[4px_4px_0px_#EDEAE0]" 
                        : "bg-white border-black shadow-[4px_4px_0px_#000]"
                    }`}>
                      <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#4C49E1] border-b border-gray-200/20 pb-1 flex items-center gap-1">
                        <span>●</span> The Secret Sauce
                      </h4>
                      <p className={`font-sans text-sm leading-relaxed font-normal transition-colors duration-300 ${
                        isNightMode ? "text-stone-300" : "text-gray-800"
                      }`}>
                        {summary.sauce}
                      </p>
                    </div>
                  </div>

                  {/* Why It Matters */}
                  <div className={`border-t-2 pt-6 transition-colors duration-300 ${
                    isNightMode ? "border-[#EDEAE0]/20" : "border-black"
                  }`}>
                    <h4 className={`font-serif text-lg font-bold mb-3 transition-colors duration-300 ${
                      isNightMode ? "text-white" : "text-black"
                    }`}>
                      Why This Matters
                    </h4>
                    <p className={`font-sans text-sm leading-relaxed border-l-4 p-4 rounded-r-md transition-colors duration-300 ${
                      isNightMode 
                        ? "bg-[#1E2538]/50 border-[#EAEAFF] text-stone-300" 
                        : "bg-[#EAEAFF]/40 border-[#4C49E1] text-gray-700"
                    }`}>
                      {summary.whyMatters}
                    </p>
                  </div>

                  {/* Three Aha! Insights */}
                  <div>
                    <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#4AA96C] mb-4 flex items-center gap-1">
                      <span>✦</span> Aha! Insights to Remember
                    </h4>
                    <div className="space-y-3">
                      {summary.insights.map((insight, idx) => (
                        <div 
                          key={idx} 
                          className={`flex gap-3 border p-3.5 rounded-sm transition-all duration-300 ${
                            isNightMode 
                              ? "bg-[#141924] border-stone-200/40 shadow-[2px_2px_0px_#EDEAE0]" 
                              : "bg-white border-black shadow-[2px_2px_0px_#000]"
                          }`}
                        >
                          <span className="font-mono font-bold text-amber-500 select-none text-base">
                            0{idx + 1}.
                          </span>
                          <p className={`font-sans text-sm leading-relaxed font-medium transition-colors duration-300 ${
                            isNightMode ? "text-stone-300" : "text-gray-900"
                          }`}>
                            {insight}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Whimsical Curator Note / Ledger Footer */}
                  <div className={`border-2 border-dashed p-5 rounded-md transition-all duration-300 ${
                    isNightMode ? "border-stone-200/30 bg-pink-950/10" : "border-black/40 bg-pink-50/20"
                  }`}>
                    <span className="font-mono text-[10px] text-pink-500 font-bold uppercase tracking-widest block mb-1">
                      Curator's Archive Note
                    </span>
                    <p className={`font-serif text-sm italic leading-relaxed transition-colors duration-300 ${
                      isNightMode ? "text-[#EDEAE0]/90" : "text-gray-800"
                    }`}>
                      "{summary.curatorNote}"
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Footer Editorial Action Panel */}
            <div className={`border-t-2 p-6 sticky bottom-0 transition-colors duration-300 ${
              isNightMode ? "bg-[#0D1017] border-stone-200" : "bg-white border-black"
            }`}>
              <div className={`grid grid-cols-2 gap-4 ${isImmersive ? "max-w-4xl mx-auto w-full px-6 md:px-12" : ""}`}>
                <button
                  onClick={handleCopyCitation}
                  className={`flex items-center justify-center gap-2 px-4 py-3 border-2 font-mono font-bold text-xs uppercase transition-all active:translate-y-0.5 cursor-pointer rounded-sm ${
                    isNightMode 
                      ? "bg-[#141924] border-stone-200 text-white hover:bg-stone-800 shadow-[3px_3px_0px_#EDEAE0] active:shadow-[1px_1px_0px_#EDEAE0]" 
                      : "bg-stone-100 border-black text-black hover:bg-stone-200 shadow-[3px_3px_0px_#000] active:shadow-[1px_1px_0px_#000]"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Citation</span>
                    </>
                  )}
                </button>

                <a
                  href={paper.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center justify-center gap-2 px-4 py-3 border-2 font-sans font-bold text-xs uppercase transition-all active:translate-y-0.5 cursor-pointer rounded-sm text-center ${
                    isNightMode 
                      ? "bg-[#FFF275] border-stone-200 text-black hover:bg-[#ffe240] shadow-[3px_3px_0px_#141924] active:shadow-[1px_1px_0px_#141924]" 
                      : "bg-[#4C49E1] hover:bg-[#3A38C2] text-white border-black shadow-[3px_3px_0px_#000] active:shadow-[1px_1px_0px_#000]"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Read Full PDF</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
