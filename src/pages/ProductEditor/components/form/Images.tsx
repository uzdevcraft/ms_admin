import { useRef } from 'react';
import { ActionIcon, Badge, Group, Image, Loader, Stack, Text, Tooltip, UnstyledButton } from '@mantine/core';
import { IconPlus, IconStar, IconX } from '@tabler/icons-react';
import cx from 'clsx';
import { useController } from 'react-hook-form';

import { getApiError, mediaUrl, toast } from '@common/utils';
import { productEditor } from '@/locale/uz';
import { useUploadMultiple } from '@/modules/files/hooks/useUploadMultiple';
import type { CreateFormValues } from '@modules/products/forms';

import classes from './Form.module.css';

const ACCEPT = 'image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp';
const isImage = (file: File) =>
  ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type) || /\.(png|jpe?g|webp)$/i.test(file.name);

/** Section 04: several images; the first one is the main image. */
const Images = () => {
  const {
    field,
    fieldState: { error }
  } = useController<CreateFormValues, 'imageUrls'>({ name: 'imageUrls' });
  const upload = useUploadMultiple();
  const input = useRef<HTMLInputElement>(null);

  const urls = field.value ?? [];

  const handleFiles = (list: FileList | null) => {
    const files = Array.from(list ?? []);
    if (input.current) input.current.value = '';
    if (!files.length) return;

    if (files.some(file => !isImage(file))) {
      toast.error(productEditor.imageTypeError);
      return;
    }

    upload.mutate(files, {
      onSuccess: uploaded => field.onChange([...urls, ...uploaded]),
      onError: uploadError => toast.error(getApiError(uploadError).message || uploadError.message)
    });
  };

  const makeMain = (index: number) => field.onChange([urls[index], ...urls.filter((_, i) => i !== index)]);
  const removeAt = (index: number) => field.onChange(urls.filter((_, i) => i !== index));

  return (
    <Stack gap="xs">
      <div className={classes.images}>
        {urls.map((url, index) => (
          <div key={url} className={classes.imageTile}>
            <Image src={mediaUrl(url)} alt="" w="100%" h="100%" fit="cover" />
            {index === 0 && (
              <Badge className={classes.imageBadge} size="sm" color="blue" radius="sm" variant="filled">
                {productEditor.mainImage}
              </Badge>
            )}
            <Group gap={4} className={classes.imageActions}>
              {index > 0 && (
                <Tooltip label={productEditor.makeMain} withArrow>
                  <ActionIcon
                    variant="white"
                    size="sm"
                    onClick={() => makeMain(index)}
                    aria-label={productEditor.makeMain}
                  >
                    <IconStar size={14} />
                  </ActionIcon>
                </Tooltip>
              )}
              <Tooltip label={productEditor.removeImage} withArrow>
                <ActionIcon
                  variant="white"
                  color="red"
                  size="sm"
                  onClick={() => removeAt(index)}
                  aria-label={productEditor.removeImage}
                >
                  <IconX size={14} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </div>
        ))}

        <UnstyledButton
          type="button"
          className={cx(classes.addTile, { [classes.addTileError]: error })}
          onClick={() => input.current?.click()}
          disabled={upload.isPending}
        >
          {upload.isPending ? <Loader size="sm" /> : <IconPlus size={22} stroke={1.5} />}
          {upload.isPending ? productEditor.uploading : productEditor.addImage}
        </UnstyledButton>
        <input
          ref={input}
          type="file"
          accept={ACCEPT}
          multiple
          hidden
          onChange={event => handleFiles(event.currentTarget.files)}
        />
      </div>
      <Text size="xs" c={error ? 'red' : 'dimmed'}>
        {error?.message ?? productEditor.imagesHint}
      </Text>
    </Stack>
  );
};

export default Images;
