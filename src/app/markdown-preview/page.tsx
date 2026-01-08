import { MarkdownPreviewPage } from 'components/pages/markdown-preview';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Markdown 미리보기 | WooBottle Labs',
  description: 'Markdown 텍스트를 실시간으로 작성하고 렌더링된 결과를 미리볼 수 있는 도구입니다. GitHub, Notion, 블로그 등에서 사용할 수 있는 Markdown 문서를 빠르게 작성할 수 있습니다.',
  keywords: ['Markdown', '마크다운', '미리보기', 'Markdown 에디터', 'Markdown 렌더링'],
  openGraph: {
    title: 'Markdown 미리보기',
    description: 'Markdown 텍스트를 실시간으로 작성하고 미리볼 수 있는 도구',
    type: 'website',
  },
};

export default function MarkdownPreviewRoute() {
  return <MarkdownPreviewPage />;
}
