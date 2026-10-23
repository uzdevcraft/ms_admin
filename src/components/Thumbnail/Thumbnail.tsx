import { IconPhoto } from '@tabler/icons-react';

import { ImagePreview } from '@/components/ImagePreview';

import classes from './Thumbnail.module.scss';

type IProps = {
  /** Already resolved image URL (e.g. via mediaUrl); empty shows a placeholder. */
  src?: string | null;
  alt: string;
  size?: number;
};

/** Square image for table rows: click-to-preview when present, neutral placeholder otherwise. */
const Thumbnail = ({ src, alt, size = 44 }: IProps) =>
  src ? (
    <ImagePreview src={src} alt={alt} w={size} h={size} radius="md" fit="cover" className={classes.image} />
  ) : (
    <span className={classes.placeholder} style={{ width: size, height: size }} aria-hidden>
      <IconPhoto size={Math.round(size * 0.4)} stroke={1.5} />
    </span>
  );

export default Thumbnail;
