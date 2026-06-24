import { Button, Group, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function PageHeader({ title, description, actionLabel, onAction }: PageHeaderProps) {
  return (
    <div className={styles.header}>
      <div>
        <Text className={styles.title}>{title}</Text>
        {description && <Text className={styles.description}>{description}</Text>}
      </div>
      {actionLabel && onAction && (
        <Group>
          <Button leftSection={<IconPlus size={16} />} onClick={onAction}>
            {actionLabel}
          </Button>
        </Group>
      )}
    </div>
  );
}
