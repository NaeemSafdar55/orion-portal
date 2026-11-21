import { Link } from '@inertiajs/react';
import { SearchX } from 'lucide-react';

export default function EmptyState({ icon: Icon = SearchX, title, description, actionLabel, actionHref }) {
    return (
        <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Icon className="h-6 w-6 text-slate-400" strokeWidth={1.6} />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900">{title}</h3>
            {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
            {actionLabel && actionHref && (
                <Link
                    href={actionHref}
                    className="mt-5 inline-flex items-center rounded-lg bg-[#E11D23] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c4161b]"
                >
                    {actionLabel}
                </Link>
            )}
        </div>
    );
}
