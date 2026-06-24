import type { Admin } from '../types';

/**
 * Magic Store admin accounts — edit usernames and passwords here manually.
 * Only these 3 accounts can access the admin panel.
 */
export const ADMINS: Admin[] = [
  {
    id: '1',
    username: 'admin_super',
    password: 'MagicStore2024!',
    name: 'Super Admin',
  },
  {
    id: '2',
    username: 'admin_ops',
    password: 'Ops@Magic2024',
    name: 'Operations Admin',
  },
  {
    id: '3',
    username: 'admin_support',
    password: 'Support#MS2024',
    name: 'Support Admin',
  },
];
