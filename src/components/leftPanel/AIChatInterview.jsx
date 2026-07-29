import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw, CheckCircle, UploadCloud, Cpu } from 'lucide-react';
import { runRecruiterInterviewStep, getSelectedProvider, getSelectedGPTModel, getStoredOpenAIKey, getStoredApiKey } from '../../services/geminiService';

export default function AIChatInterview({ resumeData, setResumeData, onOpenUpload }) {
  const [messages, setMessages] = useState([
    {
      id: 'msg_1',
      sender: 'recruiter',
      text: "Hi Alex! I'm Sarah, your Executive AI Career Coach. I've parsed your initial profile. Let me help you optimize your resume to stand out to hiring managers at top tech companies. You can chat with me, or click 'Import Document' to upload your existing PDF/Word resume directly!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeEngineInfo, setActiveEngineInfo] = useState({ provider: 'Local AI', model: 'Smart Engine' });
  const [quickReplies, setQuickReplies] = useState([
    "Boosted system throughput by 58%",
    "Led team of 5 engineers",
    "Optimized vector search latency"
  ]);
  const [lastUpdatedSection, setLastUpdatedSection] = useState(null);
  const messagesEndRef = useRef(null);

  const checkActiveEngine = () => {
    const prov = getSelectedProvider();
    const oKey = getStoredOpenAIKey();
    const gKey = getStoredApiKey();

    if (prov === 'local') {
      setActiveEngineInfo({ provider: 'Local Engine', model: 'Offline AI' });
    } else if (prov === 'openai' || (prov === 'auto' && oKey && oKey.startsWith('sk-'))) {
      setActiveEngineInfo({ provider: 'OpenAI GPT', model: getSelectedGPTModel() });
    } else if (prov === 'gemini' || (prov === 'auto' && gKey && gKey.startsWith('AIzaSy'))) {
      setActiveEngineInfo({ provider: 'Google Gemini', model: 'gemini-2.0-flash' });
    } else {
      setActiveEngineInfo({ provider: 'Smart Local AI', model: 'Fallback' });
    }
  };

  useEffect(() => {
    checkActiveEngine();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await runRecruiterInterviewStep({
        chatHistory: messages,
        userMessage: text,
        currentResume: resumeData
      });

      if (response.providerUsed) {
        setActiveEngineInfo({
          provider: response.providerUsed === 'openai' ? 'OpenAI GPT' : 'Google Gemini',
          model: response.modelUsed || 'active'
        });
      }

      if (response.updatedResume) {
        setResumeData(response.updatedResume);
        setLastUpdatedSection('Work Experience & Metrics');
        setTimeout(() => setLastUpdatedSection(null), 4000);
      }

      const recruiterMsg = {
        id: 'msg_' + (Date.now() + 1),
        sender: 'recruiter',
        text: response.replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, recruiterMsg]);
      if (response.suggestedQuickReplies && response.suggestedQuickReplies.length > 0) {
        setQuickReplies(response.suggestedQuickReplies);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [
        ...prev,
        {
          id: 'msg_err_' + Date.now(),
          sender: 'recruiter',
          text: "I got that detail! Let me know if you want to focus on expanding your technical skills or detailing another position.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestartChat = () => {
    setMessages([
      {
        id: 'msg_init',
        sender: 'recruiter',
        text: "Interview reset! Tell me about your target job title and your top 3 core skills, or upload your resume file.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setQuickReplies([
      "Targeting Senior AI Engineer",
      "Focusing on Full Stack Architecture",
      "Highlighting Leadership Skills"
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[500px]">
      
      {/* Recruiter Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/60 rounded-t-2xl flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-glow-cyan">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100">Sarah Vance</h3>
              <span className="px-1.5 py-0.5 text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded flex items-center gap-1">
                <Cpu className="w-2.5 h-2.5 text-emerald-400" />
                {activeEngineInfo.provider} ({activeEngineInfo.model})
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Conducting live AI resume interview</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenUpload && (
            <button
              onClick={onOpenUpload}
              title="Upload existing resume file"
              className="px-2.5 py-1.5 text-xs font-semibold text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 rounded-xl transition-all flex items-center gap-1.5"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Import Document</span>
            </button>
          )}

          <button
            onClick={handleRestartChat}
            title="Restart Interview Session"
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors text-xs flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Real-time Update Toast Banner */}
      {lastUpdatedSection && (
        <div className="px-4 py-2 bg-brand-500/10 border-b border-brand-500/20 text-xs text-brand-300 flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Resume Canvas Updated in background: <strong className="text-white">{lastUpdatedSection}</strong></span>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-950/40">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.sender === 'user' 
                ? 'bg-slate-800 text-brand-400 border border-slate-700' 
                : 'bg-brand-600/20 text-brand-400 border border-brand-500/30'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-brand-600 text-white rounded-tr-none shadow-glow-cyan'
                : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg'
            }`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <span className={`block mt-1 text-[10px] ${msg.sender === 'user' ? 'text-brand-200' : 'text-slate-500'}`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3 animate-fadeIn">
            <div className="w-8 h-8 rounded-full bg-brand-600/20 text-brand-400 border border-brand-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-slate-400 ml-1 font-medium">Sarah is synthesizing resume JSON...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      {quickReplies.length > 0 && !isLoading && (
        <div className="p-3 bg-slate-900/80 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 shrink-0 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Quick Answer:</span>
          </div>
          {quickReplies.map((reply, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(reply)}
              className="px-3 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-brand-600/30 border border-slate-700/80 hover:border-brand-500/50 rounded-full shrink-0 transition-all text-left truncate max-w-[240px]"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 rounded-b-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
            placeholder="Tell Sarah about a project, metric, degree, or skill..."
            className="w-full py-3 pl-4 pr-12 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="absolute right-2 p-2 text-white bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:hover:bg-brand-600 rounded-lg shadow-glow-cyan transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
