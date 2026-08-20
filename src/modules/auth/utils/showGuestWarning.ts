import { toast } from '@/common/utils/toast';
import { GUEST_WARNING_MESSAGE } from '../constants';

const TOAST_ID = 'auth-guest-warning';

function showGuestWarning(message: string = GUEST_WARNING_MESSAGE): void {
  toast.warning(message, { id: TOAST_ID });
}

export default showGuestWarning;