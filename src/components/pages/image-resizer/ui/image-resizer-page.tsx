'use client';

import React from 'react';
import { AppLayout } from '../../../../widgets/app-layout';
import { ImageResizer } from '../../../../features/image-resizer';

export const ImageResizerPage: React.FC = () => {
  return (
    <AppLayout>
      <ImageResizer />
    </AppLayout>
  );
};
