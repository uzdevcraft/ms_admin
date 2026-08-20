import { IconCheck, IconX } from '@tabler/icons-react';
import { Box, Center, Group, PasswordInput, Progress, Text } from '@mantine/core';

import classes from './PasswordStrength.module.scss';

interface PasswordStrengthProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
}

const requirements = [
  { re: /[0-9]/, label: 'Includes number' },
  { re: /[a-z]/, label: 'Includes lowercase letter' },
  { re: /[A-Z]/, label: 'Includes uppercase letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' }
];

function getStrength(password: string) {
  let multiplier = password.length > 6 ? 0 : 1;

  requirements.forEach(req => {
    if (!req.re.test(password)) multiplier += 1;
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

function Requirement({ meets, label }: { meets: boolean; label: string }) {
  return (
    <Text c={meets ? 'teal' : 'red'} size="sm" className={classes.requirement}>
      <Center inline>
        {meets ? <IconCheck size={14} /> : <IconX size={14} />}
        <Box ml={6}>{label}</Box>
      </Center>
    </Text>
  );
}

export const PasswordStrength = ({ value, onChange, error, label = 'Password', ...props }: PasswordStrengthProps) => {
  const strength = getStrength(value);

  return (
    <Box className={classes.wrapper}>
      <PasswordInput
        value={value}
        placeholder="Password"
        onChange={e => onChange(e.currentTarget.value)}
        label={label}
        error={error}
        required
        {...props}
      />

      <Group grow gap={5} mt="xs">
        {[0, 1, 2, 3].map(index => (
          <Progress
            key={index}
            value={value.length > 0 && index === 0 ? 100 : strength >= ((index + 1) / 4) * 100 ? 100 : 0}
            color={strength > 80 ? 'teal' : strength > 50 ? 'yellow' : 'red'}
            size={4}
            className={classes.bar}
          />
        ))}
      </Group>

      <Box mt="sm">
        <Requirement label="Has at least 8 characters" meets={value.length > 5} />
        {requirements.map(req => (
          <Requirement key={req.label} label={req.label} meets={req.re.test(value)} />
        ))}
      </Box>
    </Box>
  );
};

export default PasswordStrength;
