export function Field({ label, error, required, hint, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700">
                {label}
                {required && <span className="ml-0.5 text-[#E11D23]">*</span>}
            </label>
            <div className="mt-1.5">{children}</div>
            {hint && !error && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
            {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
        </div>
    );
}

export const inputClass =
    'block w-full rounded-lg border-slate-300 text-sm text-slate-900 shadow-sm transition focus:border-[#E11D23] focus:ring-[#E11D23]';

export function Input({ error, ...props }) {
    return <input {...props} className={`${inputClass} ${error ? 'border-red-400' : ''}`} />;
}

export function Textarea({ error, rows = 3, ...props }) {
    return <textarea rows={rows} {...props} className={`${inputClass} ${error ? 'border-red-400' : ''}`} />;
}

export function Select({ error, children, ...props }) {
    return (
        <select {...props} className={`${inputClass} ${error ? 'border-red-400' : ''}`}>
            {children}
        </select>
    );
}
