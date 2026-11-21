import { Link } from '@inertiajs/react';

export default function Pagination({ links, from, to, total }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row">
            <p className="text-sm text-slate-500">
                Showing <span className="font-medium text-slate-700">{from ?? 0}</span> to{' '}
                <span className="font-medium text-slate-700">{to ?? 0}</span> of{' '}
                <span className="font-medium text-slate-700">{total}</span>
            </p>

            <div className="flex flex-wrap gap-1">
                {links.map((link, i) => (
                    link.url === null ? (
                        <span
                            key={i}
                            className="rounded-md px-3 py-1.5 text-sm text-slate-300"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        <Link
                            key={i}
                            href={link.url}
                            preserveScroll
                            preserveState
                            className={[
                                'rounded-md px-3 py-1.5 text-sm transition-colors',
                                link.active
                                    ? 'bg-[#E11D23] font-medium text-white'
                                    : 'text-slate-600 hover:bg-slate-100',
                            ].join(' ')}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    )
                ))}
            </div>
        </div>
    );
}
