import { Dialog } from '@headlessui/react';

export default function ConfirmDialog({ isOpen, onCancel, onConfirm, message }) {
  return (
    <Dialog open={isOpen} onClose={onCancel} className="fixed z-50 inset-0 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="bg-white p-6 rounded-xl shadow-xl z-50">
        <Dialog.Title className="text-lg font-bold mb-2">Are you sure?</Dialog.Title>
        <Dialog.Description className="mb-4">{message || 'This action cannot be undone.'}</Dialog.Description>
        <div className="flex gap-4 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </Dialog>
  );
}
