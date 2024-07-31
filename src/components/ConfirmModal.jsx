import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

function ConfirmModal({ title, description, onConfirm, onCancel }) {
  return (
    <Dialog className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 flex items-center justify-center bg-black/30">
        <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
          <DialogTitle className="text-lg font-medium leading-6 text-gray-900">
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              className="text-white/90"
              variant="secondary"
              onClick={onCancel}
            >
              Close
            </Button>
            <Button className="text-white/90" onClick={onConfirm}>
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default ConfirmModal;
