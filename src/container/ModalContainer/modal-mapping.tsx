'use client';

import DeleteConfirmAlert from '@/components/dashboard/DeleteConfirmAlert/DeleteConfirmAlert';
import { TModalView } from '@/types/customModal.types';

export const MODAL_COMPONENTS: Record<TModalView, React.ReactNode> = {
  DELETE_CONFIRM: <DeleteConfirmAlert />,
  STATUS_CHANGE_CONFIRM: null,
  ADD_ADMIN: null,
  EDIT_ADMIN: null,
  VIEW_EBOOK: null,
  SUSPEND_CONFIRM: null,
  WRITE_REVIEW: null,
  NONE: null,
};
