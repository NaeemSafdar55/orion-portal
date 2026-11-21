import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { MapPin, Phone, Mail, Hash, IdCard, User, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import PortalLayout from '@/Layouts/PortalLayout';
import ConfirmDialog from '@/Components/UI/ConfirmDialog';
import Flash from '@/Components/UI/Flash';

function Detail({ icon: Icon, label, value }) {
    return (
        <div className="flex gap-3">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#E11D23]" strokeWidth={1.8} />
            <div className="min-w-0">
                <p className="text-xs text-slate-400">{label}</p>
                <p className="truncate text-sm text-slate-800">{value || '—'}</p>
            </div>
        </div>
    );
}

export default function Show({ company, drivers, vehicles }) {
    const [confirming, setConfirming] = useState(false);
    const [processing, setProcessing] = useState(false);

    const remove = () => {
        setProcessing(true);
        router.delete(`/companies/${company.id}`, {
            onFinish: () => setProcessing(false),
        });
    };

    const address = [
        company.address_line_1,
        company.address_line_2,
        [company.city, company.state].filter(Boolean).join(', '),
        company.postal_code,
    ].filter(Boolean).join(', ');

    return (
        <PortalLayout
            title={company.name}
            subtitle={`${company.drivers_count} drivers, ${company.vehicles_count} vehicles`}
            actions={
                <>
                    <Link
                        href="/companies"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Link>
                    <Link
                        href={`/companies/${company.id}/edit`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#E11D23] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c4161b]"
                    >
                        <Pencil className="h-4 w-4" />
                        Edit
                    </Link>
                    <button
                        type="button"
                        onClick={() => setConfirming(true)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:border-red-300 hover:text-[#E11D23]"
                    >
                        <Trash2 className="h-4 w-4" />
                        Remove
                    </button>
                </>
            }
        >
            <Flash />

            <div className="grid gap-5 lg:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-1">
                    <h2 className="text-sm font-semibold text-slate-900">Company details</h2>

                    <div className="mt-5 space-y-4">
                        <Detail icon={MapPin} label="Address" value={address} />
                        <Detail icon={Phone} label="Phone" value={company.phone} />
                        <Detail icon={Mail} label="Email" value={company.email} />
                        <Detail icon={User} label="Contact" value={company.contact_name} />
                        <Detail icon={IdCard} label="DOT number" value={company.dot_number} />
                        <Detail icon={Hash} label="MC number" value={company.mc_number} />
                    </div>

                    {company.notes && (
                        <div className="mt-5 border-t border-slate-100 pt-4">
                            <p className="text-xs text-slate-400">Notes</p>
                            <p className="mt-1 whitespace-pre-line text-sm text-slate-700">{company.notes}</p>
                        </div>
                    )}
                </div>

                <div className="space-y-5 lg:col-span-2">
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
                            <h2 className="text-sm font-semibold text-slate-900">
                                Drivers <span className="text-slate-400">({company.drivers_count})</span>
                            </h2>
                            <Link href={`/drivers?company=${company.id}`} className="text-xs font-medium text-[#E11D23] hover:underline">
                                View all
                            </Link>
                        </div>

                        {drivers.length === 0 ? (
                            <p className="px-5 py-8 text-center text-sm text-slate-400">No drivers yet</p>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {drivers.map((driver) => (
                                    <li key={driver.id}>
                                        <Link
                                            href={`/drivers/${driver.id}`}
                                            className="flex items-center justify-between px-5 py-3 hover:bg-slate-50"
                                        >
                                            <span className="text-sm font-medium text-slate-800">
                                                {driver.first_name} {driver.last_name}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                Class {driver.license_class || '—'} · {driver.license_state || '—'}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
                            <h2 className="text-sm font-semibold text-slate-900">
                                Vehicles <span className="text-slate-400">({company.vehicles_count})</span>
                            </h2>
                            <Link href={`/vehicles?company=${company.id}`} className="text-xs font-medium text-[#E11D23] hover:underline">
                                View all
                            </Link>
                        </div>

                        {vehicles.length === 0 ? (
                            <p className="px-5 py-8 text-center text-sm text-slate-400">No vehicles yet</p>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {vehicles.map((vehicle) => (
                                    <li key={vehicle.id}>
                                        <Link
                                            href={`/vehicles/${vehicle.id}`}
                                            className="flex items-center justify-between px-5 py-3 hover:bg-slate-50"
                                        >
                                            <span className="text-sm font-medium text-slate-800">
                                                Unit {vehicle.unit_number || '—'}
                                                <span className="ml-2 font-normal text-slate-400">{vehicle.vin}</span>
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {[vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ')}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={confirming}
                title={`Remove ${company.name}?`}
                message="The company and its records will be hidden from the portal. Nothing is permanently destroyed, so it can be restored if this was a mistake."
                processing={processing}
                onConfirm={remove}
                onCancel={() => setConfirming(false)}
            />
        </PortalLayout>
    );
}
