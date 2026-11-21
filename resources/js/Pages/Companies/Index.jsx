import { Link } from '@inertiajs/react';
import { Building2, Plus, ChevronRight } from 'lucide-react';
import PortalLayout from '@/Layouts/PortalLayout';
import SearchInput from '@/Components/UI/SearchInput';
import Pagination from '@/Components/UI/Pagination';
import EmptyState from '@/Components/UI/EmptyState';
import Flash from '@/Components/UI/Flash';

export default function Index({ companies, filters, total }) {
    const searching = Boolean(filters?.search);

    return (
        <PortalLayout
            title="Companies"
            subtitle={`${total} trucking ${total === 1 ? 'company' : 'companies'} on file`}
            actions={
                <Link
                    href="/companies/create"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#E11D23] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c4161b]"
                >
                    <Plus className="h-4 w-4" />
                    Add Company
                </Link>
            }
        >
            <Flash />

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <SearchInput
                        value={filters?.search ?? ''}
                        placeholder="Search name, DOT, MC or city"
                        routeName="/companies"
                        extra={{ status: filters?.status }}
                    />

                    <div className="flex gap-1">
                        {[
                            { key: undefined, label: 'All' },
                            { key: 'active', label: 'Active' },
                            { key: 'inactive', label: 'Inactive' },
                        ].map(({ key, label }) => (
                            <Link
                                key={label}
                                href={`/companies${key ? `?status=${key}` : ''}`}
                                preserveScroll
                                className={[
                                    'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                                    (filters?.status ?? undefined) === key
                                        ? 'bg-[#E11D23] text-white'
                                        : 'text-slate-600 hover:bg-slate-100',
                                ].join(' ')}
                            >
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>

                {companies.data.length === 0 ? (
                    <EmptyState
                        icon={Building2}
                        title={searching ? 'No companies match that search' : 'No companies yet'}
                        description={
                            searching
                                ? 'Try a different name, DOT number or city.'
                                : 'Add your first trucking company to get started.'
                        }
                        actionLabel={searching ? null : 'Add Company'}
                        actionHref={searching ? null : '/companies/create'}
                    />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 text-left">
                                        <th className="px-4 py-3 font-semibold text-slate-700">Company</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700">DOT / MC</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700">Location</th>
                                        <th className="px-4 py-3 text-right font-semibold text-slate-700">Drivers</th>
                                        <th className="px-4 py-3 text-right font-semibold text-slate-700">Vehicles</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
                                        <th className="w-10" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {companies.data.map((company) => (
                                        <tr key={company.id} className="group hover:bg-slate-50">
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={`/companies/${company.id}`}
                                                    className="font-medium text-slate-900 hover:text-[#E11D23]"
                                                >
                                                    {company.name}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 text-slate-500">
                                                <div>{company.dot_number || '—'}</div>
                                                <div className="text-xs text-slate-400">{company.mc_number || ''}</div>
                                            </td>
                                            <td className="px-4 py-3 text-slate-500">
                                                {[company.city, company.state].filter(Boolean).join(', ') || '—'}
                                            </td>
                                            <td className="px-4 py-3 text-right tabular-nums text-slate-600">
                                                {company.drivers_count}
                                            </td>
                                            <td className="px-4 py-3 text-right tabular-nums text-slate-600">
                                                {company.vehicles_count}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={[
                                                        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                                                        company.active
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : 'bg-slate-100 text-slate-500',
                                                    ].join(' ')}
                                                >
                                                    {company.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-2">
                                                <Link href={`/companies/${company.id}`} aria-label={`Open ${company.name}`}>
                                                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Pagination
                            links={companies.links}
                            from={companies.from}
                            to={companies.to}
                            total={companies.total}
                        />
                    </>
                )}
            </div>
        </PortalLayout>
    );
}
