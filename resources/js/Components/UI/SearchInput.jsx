import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import { Search, X } from 'lucide-react';

/**
 * Debounced search that updates the URL, so a search can be bookmarked,
 * shared and survives a refresh. preserveState keeps the cursor in the box.
 */
export default function SearchInput({ value = '', placeholder = 'Search', routeName, extra = {} }) {
    const [term, setTerm] = useState(value);
    const first = useRef(true);

    useEffect(() => {
        if (first.current) {
            first.current = false;
            return;
        }

        const timer = setTimeout(() => {
            router.get(
                routeName,
                { ...extra, search: term || undefined },
                { preserveState: true, replace: true, preserveScroll: true },
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [term]);

    return (
        <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
                type="search"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder={placeholder}
                className="block w-full rounded-lg border-slate-300 pl-9 pr-9 text-sm shadow-sm focus:border-[#E11D23] focus:ring-[#E11D23]"
            />
            {term && (
                <button
                    type="button"
                    onClick={() => setTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="Clear search"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
