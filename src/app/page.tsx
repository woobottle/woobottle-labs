'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Trash2, FileText, Type, Hash, AlignLeft, Clock, Clipboard } from 'lucide-react';

export default function Home() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    lines: 0,
    paragraphs: 0,
    koreanChars: 0,
    englishChars: 0
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    
    // Korean character detection (Hangul range)
    const koreanChars = (text.match(/[\u3131-\u3163\uac00-\ud7af]/g) || []).length;
    const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
    
    // Word counting - considering Korean spacing
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    
    // Line counting
    const lines = text === '' ? 0 : text.split('\n').length;
    
    // Paragraph counting
    const paragraphs = text.trim() === '' ? 0 : text.trim().split(/\n\s*\n/).filter(p => p.trim()).length;

    setStats({
      characters,
      charactersNoSpaces,
      words,
      lines,
      paragraphs,
      koreanChars,
      englishChars
    });
  }, [text]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleClear = () => {
    setText('');
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch (err) {
      console.error('Failed to paste text: ', err);
    }
  };

  const getCharacterLimitColor = (count: number) => {
    if (count < 100) return 'text-gray-600';
    if (count < 500) return 'text-blue-600';
    if (count < 1000) return 'text-green-600';
    if (count < 2000) return 'text-amber-600';
    return 'text-red-600';
  };

  const StatCard = ({ icon: Icon, label, value, color = "text-gray-700" }: {
    icon: React.ComponentType<any>;
    label: string;
    value: number;
    color?: string;
  }) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/20 hover:shadow-md transition-all duration-300 hover:bg-white/80">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="text-sm text-gray-600 font-medium">{label}</p>
          <p className={`text-2xl font-bold ${color}`}>{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            글자수 카운터
          </h1>
          <p className="text-gray-600 text-lg">
            실시간으로 글자, 단어, 줄 수를 계산합니다
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Text Input Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    텍스트 입력
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="px-3 py-1.5 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors duration-200 flex items-center gap-1"
                    >
                      <Copy className="w-4 h-4" />
                      {copied ? '복사됨!' : '복사'}
                    </button>
                    <button
                      onClick={handleClear}
                      className="px-3 py-1.5 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-200 flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      지우기
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full h-96 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-400"
                  placeholder="여기에 텍스트를 입력하거나 붙여넣어 주세요...
                  
한글, 영어, 숫자 등 모든 문자를 지원합니다.
실시간으로 글자수가 계산됩니다."
                  style={{ 
                    lineHeight: '1.6',
                    fontSize: '16px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans KR", sans-serif'
                  }}
                />
                
                {/* Character count indicator */}
                <div className="mt-3 text-right">
                  <span className={`text-sm font-medium ${getCharacterLimitColor(stats.characters)}`}>
                    {stats.characters.toLocaleString()} 글자
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Hash className="w-5 h-5" />
                통계
              </h3>
              
              <div className="space-y-4">
                <StatCard 
                  icon={Type} 
                  label="전체 글자" 
                  value={stats.characters}
                  color={getCharacterLimitColor(stats.characters)}
                />
                
                <StatCard 
                  icon={Type} 
                  label="공백 제외" 
                  value={stats.charactersNoSpaces}
                />
                
                <StatCard 
                  icon={FileText} 
                  label="단어" 
                  value={stats.words}
                />
                
                <StatCard 
                  icon={AlignLeft} 
                  label="줄" 
                  value={stats.lines}
                />
                
                <StatCard 
                  icon={FileText} 
                  label="문단" 
                  value={stats.paragraphs}
                />
              </div>
            </div>

            {/* Language Statistics */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                언어별 통계
              </h3>
              
              <div className="space-y-4">
                <StatCard 
                  icon={Type} 
                  label="한글" 
                  value={stats.koreanChars}
                  color="text-blue-600"
                />
                
                <StatCard 
                  icon={Type} 
                  label="영어" 
                  value={stats.englishChars}
                  color="text-green-600"
                />
              </div>
            </div>

            {/* Reading Time Estimate */}
            {text.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  읽기 시간 예상
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    빠르게: <span className="font-semibold text-blue-600">
                      {Math.ceil(stats.characters / 500)}분
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    보통: <span className="font-semibold text-green-600">
                      {Math.ceil(stats.characters / 300)}분
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}