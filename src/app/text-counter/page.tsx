"use client";

import React, { useState, useEffect } from "react";
import {
  Copy,
  Trash2,
  FileText,
  Type,
  Hash,
  AlignLeft,
  Clock,
} from "lucide-react";
import AppLayout from "../../components/AppLayout";

export default function TextCounterPage() {
  const [text, setText] = useState("");
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    lines: 0,
    paragraphs: 0,
    koreanChars: 0,
    englishChars: 0,
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;

    const koreanChars = (text.match(/[\u3131-\u3163\uac00-\ud7af]/g) || [])
      .length;
    const englishChars = (text.match(/[a-zA-Z]/g) || []).length;

    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const lines = text === "" ? 0 : text.split("\n").length;
    const paragraphs =
      text.trim() === ""
        ? 0
        : text
            .trim()
            .split(/\n\s*\n/)
            .filter((p) => p.trim()).length;

    setStats({
      characters,
      charactersNoSpaces,
      words,
      lines,
      paragraphs,
      koreanChars,
      englishChars,
    });
  }, [text]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleClear = () => {
    setText("");
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    label: string;
    value: number;
  }) => (
    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[#0A0A0A] border border-[#1A1A1A]">
          <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-sm text-[#A3A3A3] font-medium">{label}</p>
          <p className="text-2xl font-semibold text-white">
            {value.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout>
      <div className="mb-10">
        <div className="text-xs text-[#525252] uppercase tracking-[0.2em] mb-3">
          TEXT
        </div>
        <h1 className="text-3xl font-semibold text-white">글자수 카운터</h1>
        <p className="mt-2 text-[#A3A3A3]">실시간 텍스트 분석</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Text Input Section */}
        <div className="lg:col-span-2">
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-[#1A1A1A]">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" strokeWidth={1.5} />
                  텍스트 입력
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 text-sm bg-white text-black rounded-lg transition-colors duration-150 flex items-center gap-1"
                  >
                    <Copy className="w-4 h-4" strokeWidth={1.5} />
                    {copied ? "복사됨!" : "복사"}
                  </button>
                  <button
                    onClick={handleClear}
                    className="px-3 py-1.5 text-sm bg-[#0A0A0A] border border-[#1A1A1A] text-white rounded-lg transition-colors duration-150 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                    지우기
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-96 p-4 border border-[#1A1A1A] rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-white transition-colors duration-150 bg-[#0A0A0A] text-white placeholder-[#525252]"
                placeholder="여기에 텍스트를 입력하거나 붙여넣어 주세요..."
                style={{
                  lineHeight: "1.6",
                  fontSize: "16px",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans KR", sans-serif',
                }}
              />

              <div className="mt-3 text-right">
                <span className="text-sm font-medium text-[#A3A3A3]">
                  {stats.characters.toLocaleString()} 글자
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="space-y-6">
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Hash className="w-5 h-5" strokeWidth={1.5} />
              통계
            </h3>

            <div className="space-y-4">
              <StatCard
                icon={Type}
                label="전체 글자"
                value={stats.characters}
              />
              <StatCard
                icon={Type}
                label="공백 제외"
                value={stats.charactersNoSpaces}
              />
              <StatCard icon={FileText} label="단어" value={stats.words} />
              <StatCard icon={AlignLeft} label="줄" value={stats.lines} />
              <StatCard icon={FileText} label="문단" value={stats.paragraphs} />
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5" strokeWidth={1.5} />
              언어별 통계
            </h3>

            <div className="space-y-4">
              <StatCard icon={Type} label="한글" value={stats.koreanChars} />
              <StatCard icon={Type} label="영어" value={stats.englishChars} />
            </div>
          </div>

          {text.length > 0 && (
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                읽기 시간 예상
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-[#A3A3A3]">
                  빠르게:{" "}
                  <span className="font-semibold text-white">
                    {Math.ceil(stats.characters / 500)}분
                  </span>
                </p>
                <p className="text-sm text-[#A3A3A3]">
                  보통:{" "}
                  <span className="font-semibold text-white">
                    {Math.ceil(stats.characters / 300)}분
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
