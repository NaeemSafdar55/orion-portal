import { Link, router } from '@inertiajs/react';
import { Truck, Plus, ChevronRight } from 'lucide-react';
import PortalLayout from '@/Layouts/PortalLayout';
import SearchInput from '@/Components/UI/SearchInput';
import Pagination from '@/Components/UI/Pagination';
import EmptyState from '@/Components/UI/EmptyState';
import Flash from '@/Components/UI/Flash';

export default function Index({ vehicles, companies, filters, total }) {
    const searching = Boolean(filters?.search);

    const setCompany = (value) => {
        router.get('/vehicles', {
            ...filters,
            company: value || undefined,
            page: undefined,
        }, { preserveState: true, replace: true, preserveScroll: true });
    };

    return (
        <PortalLayout
            title="Vehicles"
            subtitle={`${total} ${total === 1 ? 'vehicle' : 'vehicles'} across all companies`}
            actions={
                <Link
                    href={`/vehicles/create${filters?.company ? `?company=${filters.company}` : ''}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#E11D23] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c4161b]"
                >
                    <Plus className="h-4 w-4" />
                    Add Vehicle
                </Link>
            }
        >
            <Flash />

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
                    <SearchInput
                        value={filters?.search ?? ''}
                        placeholder="Search VIN, unit number or plate"
                        routeName="/vehicles"
                        extra={{ company: filters?.company, status: filters?.status }}
                    />

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <select
                            value={filters?.company ?? ''}
                            onChange={(e) => setCompany(e.target.value)}
                            className="rounded-lg border-slate-300 text-sm shadow-sm focus:border-[#E11D23] focus:ring-[#E11D23]"
                        >
                            <option value="">All companies</option>
                            {companies.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>

                        <div className="flex gap-1">
                            {[
                                { key: undefined, label: 'All' },
                                { key: 'active', label: 'Active' },
                                { key: 'inactive', label: 'Inactive' },
                            ].map(({ key, label }) => (
                                <Link
                                    key={label}
                                    href={`/vehicles?${new URLSearchParams({
                                        ...(filters?.company ? { company: filters.company } : {}),
                                        ...(key ? { status: key } : {}),
                                    }).toString()}`}
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
                </div>

                {vehicles.data.length === 0 ? (
                    <EmptyState
                        icon={Truck}
                        title={searching ? 'No vehicles match that search' : 'No vehicles yet'}
                        description={searching ? 'Try a different VIN, unit number or plate.' : 'Add a vehicle to get started.'}
                        actionLabel={searching ? null : 'Add Vehicle'}
                        actionHref={searching ? null : '/vehicles/create'}
                    />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 text-left">
                                        <th className="px-4 py-3 font-semibold text-slate-700">Unit / VIN</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700">Company</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700">Vehicle</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700">Plate</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
                                        <th className="w-10" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {vehicles.data.map((vehicle) => (
                                        <tr key={vehicle.id} className="group hover:bg-slate-50">
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={`/vehicles/${vehicle.id}`}
                                                    className="font-medium text-slate-900 hover:text-[#E11D23]"
                                                >
                                                    {vehicle.unit_number ? `Unit ${vehicle.unit_number}` : vehicle.vin}
                                                </Link>
                                                {vehicle.unit_number && (
                                                    <div className="font-mono text-xs text-slate-400">{vehicle.vin}</div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Link href={`/companies/${vehicle.company?.id}`} className="text-slate-500 hover:text-[#E11D23]">
                                                    {vehicle.company?.name ?? '—'}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 text-slate-500">
                                                {[vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ') || '—'}
                                                {vehicle.vehicle_type && (
                                                    <div className="text-xs capitalize text-slate-400">{vehicle.vehicle_type}</div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-slate-500">
                                                {vehicle.license_plate || '—'}
                                                {vehicle.plate_state && (
                                                    <span className="ml-1.5 text-xs text-slate-400">{vehicle.plate_state}</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={[
                                                        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                                                        vehicle.active
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : 'bg-slate-100 text-slate-500',
                                                    ].join(' ')}
                                                >
                                                    {vehicle.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-2">
                                                <Link href={`/vehicles/${vehicle.id}`} aria-label="Open vehicle">
                                                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Pagination links={vehicles.links} from={vehicles.from} to={vehicles.to} total={vehicles.total} />
                    </>
                )}
            </div>
        </PortalLayout>
    );
}
