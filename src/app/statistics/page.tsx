"use client";

import React from "react";
import { BarChart3, TrendingUp, PieChart, Activity } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import { ToolHeader } from "widgets/tool-header";

export default function StatisticsPage() {
  const StatCard = ({
    icon: Icon,
    title,
    value,
    change,
  }: {
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    title: string;
    value: string;
    change: string;
  }) => (
    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-lg bg-[#0A0A0A] border border-[#1A1A1A]">
          <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
        </div>
        <span className="text-sm text-[#A3A3A3] font-medium">{change}</span>
      </div>
      <h3 className="text-2xl font-semibold text-white mb-1">{value}</h3>
      <p className="text-[#A3A3A3]">{title}</p>
    </div>
  );

  return (
    <AppLayout>
      <ToolHeader
        eyebrow="STATS"
        title="통계 분석"
        description="텍스트 통계 상세"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={BarChart3}
          title="총 분석된 텍스트"
          value="1,234"
          change="+12%"
        />
        <StatCard
          icon={TrendingUp}
          title="이번 주 사용량"
          value="456"
          change="+8%"
        />
        <StatCard
          icon={PieChart}
          title="평균 글자수"
          value="2,856"
          change="+5%"
        />
        <StatCard
          icon={Activity}
          title="활성 사용자"
          value="89"
          change="+15%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Placeholder 1 */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" strokeWidth={1.5} />
            일별 사용량 추이
          </h3>
          <div className="h-64 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl flex items-center justify-center">
            <div className="text-center">
              <BarChart3
                className="w-16 h-16 mx-auto mb-4 text-[#525252]"
                strokeWidth={1.5}
              />
              <p className="text-[#525252]">차트가 곧 추가될 예정입니다</p>
            </div>
          </div>
        </div>

        {/* Chart Placeholder 2 */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5" strokeWidth={1.5} />
            언어별 사용 분포
          </h3>
          <div className="h-64 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl flex items-center justify-center">
            <div className="text-center">
              <PieChart
                className="w-16 h-16 mx-auto mb-4 text-[#525252]"
                strokeWidth={1.5}
              />
              <p className="text-[#525252]">차트가 곧 추가될 예정입니다</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5" strokeWidth={1.5} />
            최근 활동
          </h3>
          <div className="space-y-4">
            {[
              {
                time: "5분 전",
                action: "글자수 카운터 사용",
                count: "1,250자",
              },
              { time: "1시간 전", action: "계산기 사용", count: "15회 계산" },
              {
                time: "2시간 전",
                action: "글자수 카운터 사용",
                count: "890자",
              },
              {
                time: "오늘 오전",
                action: "통계 페이지 방문",
                count: "3분 체류",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-[#1A1A1A] last:border-b-0"
              >
                <div>
                  <p className="font-medium text-white">{activity.action}</p>
                  <p className="text-sm text-[#525252]">{activity.time}</p>
                </div>
                <span className="text-sm font-medium text-[#A3A3A3]">
                  {activity.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" strokeWidth={1.5} />
            성능 지표
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[#A3A3A3]">평균 응답 시간</span>
              <span className="font-semibold text-white">12ms</span>
            </div>
            <div className="w-full bg-[#1A1A1A] rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full"
                style={{ width: "95%" }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#A3A3A3]">서버 가동률</span>
              <span className="font-semibold text-white">99.9%</span>
            </div>
            <div className="w-full bg-[#1A1A1A] rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full"
                style={{ width: "99.9%" }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#A3A3A3]">사용자 만족도</span>
              <span className="font-semibold text-white">4.8/5.0</span>
            </div>
            <div className="w-full bg-[#1A1A1A] rounded-full h-2">
              <div
                className="bg-[#A3A3A3] h-2 rounded-full"
                style={{ width: "96%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
