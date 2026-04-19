"use client";

import React, { useState } from "react";
import { Button } from "shared/ui/button";
import { Copy, Trash2, FileText, Eye } from "lucide-react";
import { useMarkdownPreview } from "../model/use-markdown-preview";

type ViewMode = "split" | "editor" | "preview";

export const MarkdownPreview: React.FC = () => {
  const { text, html, copied, setText, copyHtml, copyMarkdown, clear } =
    useMarkdownPreview();

  const [viewMode, setViewMode] = useState<ViewMode>("split");

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* 툴바 */}
      <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* 뷰 모드 선택 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#A3A3A3]">보기:</span>
            <div className="flex bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-1">
              <button
                onClick={() => setViewMode("split")}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors duration-150 ${
                  viewMode === "split"
                    ? "bg-white text-black"
                    : "text-[#A3A3A3] hover:text-white"
                }`}
              >
                분할
              </button>
              <button
                onClick={() => setViewMode("editor")}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors duration-150 flex items-center gap-1 ${
                  viewMode === "editor"
                    ? "bg-white text-black"
                    : "text-[#A3A3A3] hover:text-white"
                }`}
              >
                <FileText size={14} strokeWidth={1.5} />
                편집
              </button>
              <button
                onClick={() => setViewMode("preview")}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors duration-150 flex items-center gap-1 ${
                  viewMode === "preview"
                    ? "bg-white text-black"
                    : "text-[#A3A3A3] hover:text-white"
                }`}
              >
                <Eye size={14} strokeWidth={1.5} />
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
              <Copy size={14} strokeWidth={1.5} />
              {copied ? "복사됨!" : "MD 복사"}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={copyHtml}
              className="flex items-center gap-1"
            >
              <Copy size={14} strokeWidth={1.5} />
              HTML 복사
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={clear}
              className="flex items-center gap-1"
            >
              <Trash2 size={14} strokeWidth={1.5} />
              지우기
            </Button>
          </div>
        </div>
      </div>

      {/* 에디터 & 미리보기 */}
      <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] overflow-hidden">
        <div
          className={`grid ${viewMode === "split" ? "md:grid-cols-2" : "grid-cols-1"} min-h-[500px]`}
        >
          {/* 에디터 */}
          {(viewMode === "split" || viewMode === "editor") && (
            <div className="flex flex-col border-b md:border-b-0 md:border-r border-[#1A1A1A]">
              <div className="px-4 py-3 bg-[#0A0A0A] border-b border-[#1A1A1A]">
                <div className="flex items-center gap-2">
                  <FileText
                    size={16}
                    strokeWidth={1.5}
                    className="text-[#525252]"
                  />
                  <span className="text-sm font-medium text-[#A3A3A3]">
                    Markdown
                  </span>
                </div>
              </div>
              <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Markdown을 입력하세요..."
                className="flex-1 p-4 bg-transparent resize-none focus:outline-none font-mono text-sm text-white placeholder-[#525252]"
                spellCheck={false}
              />
            </div>
          )}

          {/* 미리보기 */}
          {(viewMode === "split" || viewMode === "preview") && (
            <div className="flex flex-col">
              <div className="px-4 py-3 bg-[#0A0A0A] border-b border-[#1A1A1A]">
                <div className="flex items-center gap-2">
                  <Eye size={16} strokeWidth={1.5} className="text-[#525252]" />
                  <span className="text-sm font-medium text-[#A3A3A3]">
                    미리보기
                  </span>
                </div>
              </div>
              <div
                className="flex-1 p-4 overflow-auto prose prose-sm prose-invert max-w-none
                  prose-headings:text-white
                  prose-p:text-[#A3A3A3]
                  prose-a:text-white
                  prose-code:bg-[#1A1A1A] prose-code:text-white prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                  prose-pre:bg-[#0A0A0A] prose-pre:border prose-pre:border-[#1A1A1A] prose-pre:text-white
                  prose-blockquote:border-[#1A1A1A] prose-blockquote:bg-[#0A0A0A] prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          )}
        </div>
      </div>

      {/* 단축키 안내 */}
      <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Markdown 문법 가이드
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-3">
            <code className="text-white"># 제목</code>
            <span className="text-[#A3A3A3] ml-2">→ 제목 (H1)</span>
          </div>
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-3">
            <code className="text-white">**굵게**</code>
            <span className="text-[#A3A3A3] ml-2">
              → <strong>굵게</strong>
            </span>
          </div>
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-3">
            <code className="text-white">*기울임*</code>
            <span className="text-[#A3A3A3] ml-2">
              → <em>기울임</em>
            </span>
          </div>
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-3">
            <code className="text-white">- 목록</code>
            <span className="text-[#A3A3A3] ml-2">→ 글머리 기호</span>
          </div>
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-3">
            <code className="text-white">[링크](url)</code>
            <span className="text-[#A3A3A3] ml-2">→ 하이퍼링크</span>
          </div>
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-3">
            <code className="text-white">`코드`</code>
            <span className="text-[#A3A3A3] ml-2">→ 인라인 코드</span>
          </div>
        </div>
      </div>
    </div>
  );
};
