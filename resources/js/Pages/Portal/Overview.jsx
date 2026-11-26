import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Building2, TriangleAlert, UserRound, Truck, FileWarning, ArrowRight } from 'lucide-react';
import PortalLayout from '@/Layouts/PortalLayout';
import Flash from '@/Components/UI/Flash';

const GROUPS = [
    {
        key: 'companies',
        label: 'All Companies',
        icon: Building2,
        href: '/companies',
        linkLabel: 'Open companies',
        detail: 'Every trucking company on file. Open one to see its address, DOT and MC numbers, contacts, and the drivers and vehicles underneath it.',
    },
    {
        key: 'alerts',
        label: 'All Alerts',
        icon: TriangleAlert,
        detail: 'Companies with something expired or due soon, grouped by company. The document tables from your wireframe are built in Milestone 3.',
        pending: 'Milestone 3',
    },
    {
        key: 'drivers',
        label: 'Driver Alerts',
        icon: UserRound,
        href: '/drivers',
        linkLabel: 'Open drivers',
        detail: 'Driver records are live, searchable by name or license number. The count here is drivers with an expired or expiring document. Attaching the documents themselves is Milestone 3.',
    },
    {
        key: 'vehicles',
        label: 'Vehicle Alerts',
        icon: Truck,
        href: '/vehicles',
        linkLabel: 'Open vehicles',
        detail: 'Vehicle records are live, searchable by VIN, unit number or plate. The count here is vehicles with an expired or expiring document. Registration and inspection documents arrive in Milestone 3.',
    },
    {
        key: 'other',
        label: 'Other Alerts',
        icon: FileWarning,
        detail: 'Company level documents such as IFTA and MCS-150. Built in Milestone 3.',
        pending: 'Milestone 3',
    },
];

function StatCard({ icon: Icon, label, value, href }) {
    return (
        <Link
            href={href}
            className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 transition-colors hover:border-slate-300"
        >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-[#E11D23]/10">
                <Icon className="h-5 w-5 text-slate-500 group-hover:text-[#E11D23]" strokeWidth={1.8} />
            </span>

            <span className="flex-1">
                <span className="block text-2xl font-bold tabular-nums leading-none text-slate-900">{value}</span>
                <span className="mt-1 block text-xs uppercase tracking-wide text-slate-400">{label}</span>
            </span>

            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500" />
        </Link>
    );
}

export default function Overview({ stats = {}, totals = {} }) {
    const [selected, setSelected] = useState('companies');
    const active = GROUPS.find((g) => g.key === selected) ?? GROUPS[0];

    return (
        <PortalLayout title="Overview" subtitle="Compliance status across all companies">
            <Flash />

            {/* Totals, now that these records exist */}
            <div className="mb-5 grid gap-4 sm:grid-cols-3">
                <StatCard icon={Building2} label="Companies" value={totals.companies ?? 0} href="/companies" />
                <StatCard icon={UserRound} label="Drivers" value={totals.drivers ?? 0} href="/drivers" />
                <StatCard icon={Truck} label="Vehicles" value={totals.vehicles ?? 0} href="/vehicles" />
            </div>

            <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="space-y-2">
                        {GROUPS.map(({ key, label, icon: Icon }) => {
                            const isActive = key === selected;

                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setSelected(key)}
                                    aria-pressed={isActive}
                                    className={[
                                        'flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors',
                                        isActive ? 'bg-[#E11D23] text-white' : 'bg-slate-50 text-slate-800 hover:bg-slate-100',
                                    ].join(' ')}
                                >
                                    <Icon className="h-5 w-5 shrink-0" strokeWidth={1.8} />
                                    <span className="flex-1">
                                        <span className="block text-sm font-semibold">{label}</span>
                                        <span className={`block text-xs ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                                            {stats[key] ?? 0} items
                                        </span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white px-6 py-10 sm:px-10">
                    <div className="mx-auto max-w-md text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                            <active.icon className="h-6 w-6 text-slate-400" strokeWidth={1.6} />
                        </div>

                        <h2 className="mt-5 text-base font-semibold text-slate-900">{active.label}</h2>

                        <p className="mt-1 text-sm font-medium text-slate-500">
                            {stats[active.key] ?? 0} {stats[active.key] === 1 ? 'item' : 'items'}
                        </p>

                        {active.pending && (
                            <span className="mt-4 inline-block rounded-full bg-[#E11D23]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#E11D23]">
                                {active.pending}
                            </span>
                        )}

                        <p className="mt-4 text-sm leading-relaxed text-slate-600">{active.detail}</p>

                        {active.href && (
                            <Link
                                href={active.href}
                                className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-[#E11D23] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c4161b]"
                            >
                                {active.linkLabel}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </PortalLayout>
    );
}
