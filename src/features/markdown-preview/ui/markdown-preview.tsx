'use client';

import React, { useState } from 'react';
import { Button } from 'shared/ui/button';
import { Copy, Trash2, FileText, Eye } from 'lucide-react';
import { useMarkdownPreview } from '../model/use-markdown-preview';

type ViewMode = 'split' | 'editor' | 'preview';

export const MarkdownPreview: React.FC = () => {
  const {
    text,
    html,
    copied,
    setText,
    copyHtml,
    copyMarkdown,
    clear,
  } = useMarkdownPreview();

  const [viewMode, setViewMode] = useState<ViewMode>('split');

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* 툴바 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-4 dark:bg-gray-800/80 dark:border-gray-700/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* 뷰 모드 선택 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">보기:</span>
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'split'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                }`}
              >
                분할
              </button>
              <button
                onClick={() => setViewMode('editor')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1 ${
                  viewMode === 'editor'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                }`}
              >
                <FileText size={14} />
                편집
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1 ${
                  viewMode === 'preview'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                }`}
              >
                <Eye size={14} />
                미리보기
              </button>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={copyMarkdown}
              className="flex items-center gap-1"
            >
              <Copy size={14} />
              {copied ? '복사됨!' : 'MD 복사'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={copyHtml}
              className="flex items-center gap-1"
            >
              <Copy size={14} />
              HTML 복사
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={clear}
              className="flex items-center gap-1"
            >
              <Trash2 size={14} />
              지우기
            </Button>
          </div>
        </div>
      </div>

      {/* 에디터 & 미리보기 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 overflow-hidden dark:bg-gray-800/80 dark:border-gray-700/30">
        <div className={`grid ${viewMode === 'split' ? 'md:grid-cols-2' : 'grid-cols-1'} min-h-[500px]`}>
          {/* 에디터 */}
          {(viewMode === 'split' || viewMode === 'editor') && (
            <div className="flex flex-col border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Markdown</span>
                </div>
              </div>
              <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Markdown을 입력하세요..."
                className="flex-1 p-4 bg-transparent resize-none focus:outline-none font-mono text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400"
                spellCheck={false}
              />
            </div>
          )}

          {/* 미리보기 */}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div className="flex flex-col">
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Eye size={16} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">미리보기</span>
                </div>
              </div>
              <div
                className="flex-1 p-4 overflow-auto prose prose-sm dark:prose-invert max-w-none
                  prose-headings:text-gray-800 dark:prose-headings:text-gray-100
                  prose-p:text-gray-600 dark:prose-p:text-gray-300
                  prose-a:text-blue-600 dark:prose-a:text-blue-400
                  prose-code:bg-gray-100 dark:prose-code:bg-gray-700 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                  prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:text-gray-100
                  prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          )}
        </div>
      </div>

      {/* 단축키 안내 */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-800 p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
          Markdown 문법 가이드
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-3">
            <code className="text-blue-600 dark:text-blue-400"># 제목</code>
            <span className="text-gray-600 dark:text-gray-300 ml-2">→ 제목 (H1)</span>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-3">
            <code className="text-blue-600 dark:text-blue-400">**굵게**</code>
            <span className="text-gray-600 dark:text-gray-300 ml-2">→ <strong>굵게</strong></span>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-3">
            <code className="text-blue-600 dark:text-blue-400">*기울임*</code>
            <span className="text-gray-600 dark:text-gray-300 ml-2">→ <em>기울임</em></span>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-3">
            <code className="text-blue-600 dark:text-blue-400">- 목록</code>
            <span className="text-gray-600 dark:text-gray-300 ml-2">→ 글머리 기호</span>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-3">
            <code className="text-blue-600 dark:text-blue-400">[링크](url)</code>
            <span className="text-gray-600 dark:text-gray-300 ml-2">→ 하이퍼링크</span>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-3">
            <code className="text-blue-600 dark:text-blue-400">`코드`</code>
            <span className="text-gray-600 dark:text-gray-300 ml-2">→ 인라인 코드</span>
          </div>
        </div>
      </div>
    </div>
  );
};
