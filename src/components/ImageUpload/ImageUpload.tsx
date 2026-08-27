import { useState } from "react";
import { FileInput, Group, Image, Loader, Stack, Text } from "@mantine/core";
import { useUpload } from "@/modules/files/hooks/useUpload";
import getApiError from "@common/utils/getApiError";
import { forms } from "@/locale/uz";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  accept?: string;
}

const DEFAULT_ACCEPT = "image/png,image/jpeg,image/jpg,image/webp";

export default function ImageUpload({
  value,
  onChange,
  error,
  label = forms.imageUrl,
  accept = DEFAULT_ACCEPT,
}: ImageUploadProps) {
  const upload = useUpload();
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (nextFile: File | null) => {
    setFile(nextFile);

    if (!nextFile) {
      onChange("");
      return;
    }

    upload.mutate(nextFile, {
      onSuccess: (url) => onChange(url),
    });
  };

  const uploadError = upload.error
    ? getApiError(upload.error).message
    : undefined;

  return (
    <Stack gap="xs">
      {value ? (
        <Image src={value} alt={label} w={80} h={80} radius="sm" fit="cover" />
      ) : null}

      <FileInput
        label={label}
        accept={accept}
        value={file}
        onChange={handleChange}
        error={error || uploadError}
        disabled={upload.isPending}
        clearable
      />

      {upload.isPending ? (
        <Group gap="xs" align="center">
          <Loader size="xs" />
          <Text size="xs" c="dimmed">
            Rasm yuklanmoqda...
          </Text>
        </Group>
      ) : null}
    </Stack>
  );
}
