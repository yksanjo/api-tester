'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Plus, Clock, Trash2, Copy, Check, Send, Activity, Code, Globe } from 'lucide-react';

const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

const sampleApis = [
  { name: 'JSONPlaceholder', url: 'https://jsonplaceholder.typicode.com/posts/1', method: 'GET' },
  { name: 'Cat Facts', url: 'https://catfact.ninja/fact', method: 'GET' },
  { name: 'Random User', url: 'https://randomuser.me/api/', method: 'GET' },
];

export default function APITester() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const [headers, setHeaders] = useState([{ key: 'Content-Type', value: 'application/json' }]);
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [responseTime, setResponseTime] = useState(0);
  const [status, setStatus] = useState<number | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'headers' | 'body' | 'history'>('headers');
  const [copied, setCopied] = useState(false);

  const addHeader = () => setHeaders([...headers, { key: '', value: '' }]);
  const removeHeader = (index: number) => setHeaders(headers.filter((_, i) => i !== index));
  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const sendRequest = async () => {
    setLoading(true);
    const startTime = Date.now();
    
    try {
      const requestHeaders: Record<string, string> = {};
      headers.forEach(h => {
        if (h.key && h.value) requestHeaders[h.key] = h.value;
      });

      const options: RequestInit = { method, headers: requestHeaders };
      if (method !== 'GET' && body) {
        options.body = body;
      }

      const res = await fetch(url, options);
      const data = await res.json();
      const endTime = Date.now();
      
      setResponse(data);
      setStatus(res.status);
      setResponseTime(endTime - startTime);
      
      setHistory([{ method, url, status: res.status, time: new Date().toLocaleTimeString(), response: data }, ...history.slice(0, 9)]);
    } catch (error: any) {
      setResponse({ error: error.message });
      setStatus(500);
    } finally {
      setLoading(false);
    }
  };

  const copyResponse = () => {
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadFromHistory = (item: any) => {
    setMethod(item.method);
    setUrl(item.url);
    setResponse(item.response);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-emerald-400" />
            <h1 className="text-xl font-bold">API Tester</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> REST API Testing</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* URL Bar */}
          <div className="flex gap-2">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 font-mono font-bold focus:outline-none focus:border-emerald-500"
            >
              {methods.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter API URL..."
              className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={sendRequest}
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 px-6 rounded-lg font-semibold flex items-center gap-2"
            >
              {loading ? <Activity className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              Send
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-slate-700">
            {(['headers', 'body', 'history'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium capitalize ${activeTab === tab ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-slate-800 rounded-lg border border-slate-700">
            {activeTab === 'headers' && (
              <div className="p-4 space-y-3">
                {headers.map((header, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      placeholder="Key"
                      value={header.key}
                      onChange={(e) => updateHeader(i, 'key', e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm"
                    />
                    <input
                      placeholder="Value"
                      value={header.value}
                      onChange={(e) => updateHeader(i, 'value', e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm"
                    />
                    <button onClick={() => removeHeader(i)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                <button onClick={addHeader} className="flex items-center gap-1 text-emerald-400 text-sm"><Plus className="w-4 h-4" /> Add Header</button>
              </div>
            )}

            {activeTab === 'body' && (
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder='{"key": "value"}'
                className="w-full h-48 bg-slate-900 border-0 p-4 font-mono text-sm resize-none focus:outline-none"
              />
            )}

            {activeTab === 'history' && (
              <div className="p-4 space-y-2">
                {history.length === 0 ? <p className="text-slate-500 text-sm">No requests yet</p> : history.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => loadFromHistory(item)}
                    className="flex items-center justify-between p-3 bg-slate-900 rounded cursor-pointer hover:bg-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${item.method === 'GET' ? 'bg-blue-500' : item.method === 'POST' ? 'bg-green-500' : item.method === 'DELETE' ? 'bg-red-500' : 'bg-yellow-500'}`}>{item.method}</span>
                      <span className="text-sm truncate max-w-xs">{item.url}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className={item.status < 400 ? 'text-green-400' : 'text-red-400'}>{item.status}</span>
                      <span>{item.time}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Response */}
          {response && (
            <div className="bg-slate-800 rounded-lg border border-slate-700">
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-400">Response</span>
                  {status && (
                    <span className={`px-2 py-1 rounded text-xs font-bold ${status < 300 ? 'bg-green-500' : status < 400 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                      {status}
                    </span>
                  )}
                  {responseTime > 0 && (
                    <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{responseTime}ms</span>
                  )}
                </div>
                <button onClick={copyResponse} className="text-slate-400 hover:text-white flex items-center gap-1 text-sm">
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="p-4 overflow-auto max-h-96 text-sm font-mono">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Code className="w-4 h-4" /> Sample APIs</h3>
            <div className="space-y-2">
              {sampleApis.map((api, i) => (
                <button
                  key={i}
                  onClick={() => { setMethod(api.method); setUrl(api.url); }}
                  className="w-full text-left p-3 bg-slate-900 rounded hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500">{api.method}</span>
                    <span className="text-sm font-medium">{api.name}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 truncate">{api.url}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
            <h3 className="font-semibold mb-3">Quick Tips</h3>
            <ul className="text-xs text-slate-400 space-y-2">
              <li>• Use JSON body for POST/PUT requests</li>
              <li>• Add headers like Authorization Bearer tokens</li>
              <li>• Response time shows API latency</li>
              <li>• History stores last 10 requests</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
