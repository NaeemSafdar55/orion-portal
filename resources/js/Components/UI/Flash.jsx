import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { CircleCheck, X } from 'lucide-react';

/**
 * Shows the success message after saving or removing a record.
 * Clears itself after six seconds.
 */
export default function Flash() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 6000);
            return () => clearTimeout(timer);
        }
    }, [flash?.success]);

    if (!visible || !flash?.success) return null;

    return (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
            <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <p className="flex-1 text-sm font-medium text-emerald-800">{flash.success}</p>
            <button type="button" onClick={() => setVisible(false)} className="text-emerald-600 hover:text-emerald-800">
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}
