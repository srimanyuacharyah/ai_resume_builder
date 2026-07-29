import React, { useState, useEffect } from 'react';
import { X, Key, Check, ShieldCheck, RefreshCw, Eye, EyeOff, ExternalLink, Activity, AlertTriangle, Cpu, Sparkles } from 'lucide-react';
import { 
  getStoredApiKey, 
  setStoredApiKey, 
  getStoredOpenAIKey, 
  setStoredOpenAIKey, 
  getSelectedProvider, 
  setSelectedProvider, 
  getSelectedGPTModel, 
  setSelectedGPTModel, 
  DEFAULT_GEMINI_KEY, 
  DEFAULT_OPENAI_KEY, 
  testApiKeyConnection 
} from '../services/geminiService';

export default function SettingsModal({ isOpen, onClose }) {
  const [provider, setProvider] = useState('auto'); // 'openai' | 'gemini' | 'local' | 'auto'
  const [openaiKey, setOpenaiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [gptModel, setGptModel] = useState('gpt-4o-mini');
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testStatus, setTestStatus] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setProvider(getSelectedProvider());
      setOpenaiKey(getStoredOpenAIKey());
      setGeminiKey(getStoredApiKey());
      setGptModel(getSelectedGPTModel());
      setSavedSuccess(false);
      setTestStatus(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTestStatus({ loading: true });
    let keyToTest = geminiKey;
    let targetProv = provider;

    if (provider === 'openai' || (openaiKey && openaiKey.startsWith('sk-'))) {
      keyToTest = openaiKey;
      targetProv = 'openai';
    }

    const res = await testApiKeyConnection(keyToTest, targetProv);
    if (res.success) {
      setTestStatus({ loading: false, success: true, message: res.message });
    } else {
      setTestStatus({ loading: false, success: false, error: res.error });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSelectedProvider(provider);
    setStoredOpenAIKey(openaiKey);
    setStoredApiKey(geminiKey);
    setSelectedGPTModel(gptModel);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleResetDefaults = () => {
    setProvider('auto');
    setOpenaiKey(DEFAULT_OPENAI_KEY);
    setGeminiKey(DEFAULT_GEMINI_KEY);
    setGptModel('gpt-4o-mini');
    setSelectedProvider('auto');
    setStoredOpenAIKey(DEFAULT_OPENAI_KEY);
    setStoredApiKey(DEFAULT_GEMINI_KEY);
    setSelectedGPTModel('gpt-4o-mini');
    setSavedSuccess(true);
    setTestStatus(null);
    setTimeout(() => setSavedSuccess(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">AI Model & Recruiter Settings</h3>
              <p className="text-xs text-slate-400">Configure OpenAI GPT, Google Gemini, or Smart Local AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 rounded-lg hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
          
          {/* Provider Selector Tabs */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Select AI Engine / Provider
            </label>
            <div className="grid grid-cols-4 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setProvider('openai')}
                className={`py-2 px-2 font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  provider === 'openai' 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> OpenAI GPT
              </button>
              <button
                type="button"
                onClick={() => setProvider('gemini')}
                className={`py-2 px-2 font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  provider === 'gemini' 
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Key className="w-3.5 h-3.5" /> Gemini
              </button>
              <button
                type="button"
                onClick={() => setProvider('auto')}
                className={`py-2 px-2 font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  provider === 'auto' 
                    ? 'bg-slate-800 text-white border border-slate-700 shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Auto (Best)
              </button>
              <button
                type="button"
                onClick={() => setProvider('local')}
                className={`py-2 px-2 font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  provider === 'local' 
                    ? 'bg-slate-800 text-amber-300 border border-amber-500/30 shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Smart Local
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">Client-Side Key Protection:</span> Your API keys are saved strictly in local browser storage. Need an OpenAI key?{' '}
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noreferrer"
                className="text-emerald-400 hover:underline font-bold inline-flex items-center gap-1"
              >
                OpenAI Platform <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* OpenAI Configuration Block */}
          <div className={`space-y-3 p-4 rounded-xl border transition-all ${
            provider === 'openai' || provider === 'auto' ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-950/30 border-slate-800/50 opacity-60'
          }`}>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                OpenAI API Key & Model
              </label>
              <span className="text-[10px] text-slate-500 font-mono">sk-...</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 relative flex items-center">
                <input
                  type={showKey ? "text" : "password"}
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-proj-..."
                  className="w-full px-3.5 py-2 pl-9 pr-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500 font-mono transition-all"
                />
                <Key className="absolute left-3 w-3.5 h-3.5 text-slate-500" />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2.5 p-1 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              <select
                value={gptModel}
                onChange={(e) => setGptModel(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
              >
                <option value="gpt-4o-mini">gpt-4o-mini (Fast & Smart)</option>
                <option value="gpt-4o">gpt-4o (Flagship Omni)</option>
                <option value="gpt-4-turbo">gpt-4-turbo</option>
                <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
              </select>
            </div>
          </div>

          {/* Gemini Configuration Block */}
          <div className={`space-y-3 p-4 rounded-xl border transition-all ${
            provider === 'gemini' || provider === 'auto' ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-950/30 border-slate-800/50 opacity-60'
          }`}>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Key className="w-4 h-4 text-brand-400" />
                Google Gemini API Key
              </label>
              <span className="text-[10px] text-slate-500 font-mono">AIzaSy...</span>
            </div>

            <div className="relative flex items-center">
              <input
                type={showKey ? "text" : "password"}
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2 pl-9 pr-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-brand-500 font-mono transition-all"
              />
              <Key className="absolute left-3 w-3.5 h-3.5 text-slate-500" />
            </div>
          </div>

          {/* Connection Test Controls */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testStatus?.loading}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1.5 border border-slate-700 transition-all"
            >
              <Activity className={`w-3.5 h-3.5 ${testStatus?.loading ? 'animate-spin' : ''}`} />
              <span>{testStatus?.loading ? "Testing Connection..." : "Test Selected Connection"}</span>
            </button>

            {testStatus?.success && (
              <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-400" /> {testStatus.message}
              </p>
            )}

            {testStatus?.success === false && (
              <p className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 animate-fadeIn truncate max-w-[280px]" title={testStatus.error}>
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" /> {testStatus.error}
              </p>
            )}
          </div>

          {/* Footer Action buttons */}
          <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Defaults
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-xl shadow-glow-cyan transition-all flex items-center gap-2"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" /> Saved Preferences!
                  </>
                ) : (
                  "Save Settings"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


