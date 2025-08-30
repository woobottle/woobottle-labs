'use client';

import React from 'react';
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';
import AppLayout from '../../components/AppLayout';

export default function StatisticsPage() {
  const StatCard = ({ icon: Icon, title, value, change, color }: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: string;
    change: string;
    color: string;
  }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/20 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-sm text-green-600 font-medium">{change}</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-1">{value}</h3>
      <p className="text-gray-600">{title}</p>
    </div>
  );

  return (
    <AppLayout>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          통계 분석
        </h1>
        <p className="text-gray-600 text-lg">
          상세한 텍스트 및 사용 통계를 확인하세요
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={BarChart3}
          title="총 분석된 텍스트"
          value="1,234"
          change="+12%"
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          icon={TrendingUp}
          title="이번 주 사용량"
          value="456"
          change="+8%"
          color="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          icon={PieChart}
          title="평균 글자수"
          value="2,856"
          change="+5%"
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          icon={Activity}
          title="활성 사용자"
          value="89"
          change="+15%"
          color="bg-gradient-to-br from-orange-500 to-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Placeholder 1 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            일별 사용량 추이
          </h3>
          <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">차트가 곧 추가될 예정입니다</p>
            </div>
          </div>
        </div>

        {/* Chart Placeholder 2 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            언어별 사용 분포
          </h3>
          <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">차트가 곧 추가될 예정입니다</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            최근 활동
          </h3>
          <div className="space-y-4">
            {[
              { time: '5분 전', action: '글자수 카운터 사용', count: '1,250자' },
              { time: '1시간 전', action: '계산기 사용', count: '15회 계산' },
              { time: '2시간 전', action: '글자수 카운터 사용', count: '890자' },
              { time: '오늘 오전', action: '통계 페이지 방문', count: '3분 체류' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-800">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
                <span className="text-sm font-medium text-blue-600">{activity.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            성능 지표
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">평균 응답 시간</span>
              <span className="font-semibold text-green-600">12ms</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">서버 가동률</span>
              <span className="font-semibold text-green-600">99.9%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '99.9%' }}></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">사용자 만족도</span>
              <span className="font-semibold text-blue-600">4.8/5.0</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '96%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
