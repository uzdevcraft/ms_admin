import { useState } from 'react';
import { Box, Center, FileInput, Group, Image, Loader, Stack, Text } from '@mantine/core';

import { useUpload } from '@/modules/files/hooks/useUpload';
import getApiError from '@common/utils/getApiError';
import { forms } from '@/locale/uz';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  placeholder?: string;
  accept?: string;
}

const DEFAULT_ACCEPT = 'image/png,image/jpeg,image/jpg,image/webp';

export default function ImageUpload({
  value,
  onChange,
  error,
  label = forms.imageUrl,
  placeholder,
  accept = DEFAULT_ACCEPT
}: ImageUploadProps) {
  const upload = useUpload();
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (nextFile: File | null) => {
    setFile(nextFile);

    if (!nextFile) {
      onChange('');
      return;
    }

    upload.mutate(nextFile, {
      onSuccess: url => {
        onChange(url);
      }
    });
  };

  const uploadError = upload.error ? getApiError(upload.error).message : undefined;

  const isLoading = upload.isPending;

  return (
    <Stack gap="xs">
      {value ? (
        <Box pos="relative" w={80} h={80}>
          <Image src={value} alt={label} w={80} h={80} radius="sm" fit="cover" />

          {isLoading && (
            <Center
              pos="absolute"
              inset={0}
              bg="rgba(0, 0, 0, 0.5)"
              style={{
                borderRadius: 'var(--mantine-radius-sm)'
              }}
            >
              <Loader size="sm" />
            </Center>
          )}
        </Box>
      ) : null}

      <FileInput
        label={label}
        placeholder={placeholder}
        accept={accept}
        value={file}
        onChange={handleChange}
        error={error || uploadError}
        disabled={isLoading}
        clearable
      />

      {isLoading && (
        <Group gap="xs" align="center">
          <Loader size="xs" />
          <Text size="xs" c="dimmed">
            Rasm yuklanmoqda...
          </Text>
        </Group>
      )}
    </Stack>
  );
}
