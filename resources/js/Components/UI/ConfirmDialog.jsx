import { useEffect } from 'react';
import { TriangleAlert } from 'lucide-react';

/**
 * Checklist item 18: removing a record asks for confirmation first.
 * Escape closes it, and the cancel button holds focus so an accidental
 * Enter does not delete anything.
 */
export default function ConfirmDialog({ open, title, message, confirmLabel = 'Remove', processing, onConfirm, onCancel }) {
    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && onCancel();
        if (open) document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onCancel]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50" onClick={onCancel} aria-hidden="true" />

            <div role="dialog" aria-modal="true" className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
                        <TriangleAlert className="h-5 w-5 text-[#E11D23]" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                        <p className="mt-1.5 text-sm text-slate-600">{message}</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        type="button"
                        autoFocus
                        onClick={onCancel}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={processing}
                        className="rounded-lg bg-[#E11D23] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c4161b] disabled:opacity-60"
                    >
                        {processing ? 'Removing...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
