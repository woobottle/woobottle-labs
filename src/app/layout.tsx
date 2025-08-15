import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../shared/lib';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '글자수 카운터 - 실시간 텍스트 분석 도구',
  description: '한글과 영어를 지원하는 실시간 글자수, 단어수, 줄 수 계산기. 텍스트 분석과 읽기 시간 예상 기능을 제공합니다.',
  keywords: '글자수, 단어수, 텍스트 카운터, 한글 카운터, 문자 계산기',
  authors: [{ name: 'Character Counter' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: '글자수 카운터 - 실시간 텍스트 분석 도구',
    description: '한글과 영어를 지원하는 실시간 글자수, 단어수, 줄 수 계산기',
    type: 'website',
    locale: 'ko_KR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors`}>
        <ThemeProvider defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}