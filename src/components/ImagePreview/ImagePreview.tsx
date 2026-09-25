import { useState } from 'react';
import { Image, Modal, UnstyledButton } from '@mantine/core';
import type { ImageProps as MantineImageProps } from '@mantine/core';

type ImagePreviewProps = MantineImageProps & {
  src: string;
  alt?: string;
  title?: string;
};

export default function ImagePreview({ src, alt, title = 'Rasm', ...imageProps }: ImagePreviewProps) {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <UnstyledButton
        onClick={() => setOpened(true)}
        style={{ display: 'inline-block', lineHeight: 0 }}
        aria-label={alt || title}
      >
        <Image src={src} alt={alt} {...imageProps} />
      </UnstyledButton>

      {opened && (
        <Modal opened={opened} onClose={() => setOpened(false)} title={title} centered size="xl">
          <Image src={src} alt={alt} fit="contain" w="100%" />
        </Modal>
      )}
    </>
  );
}
