import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Truck, Hash, Calendar, CircleDot, FileText, Building2, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import PortalLayout from '@/Layouts/PortalLayout';
import ConfirmDialog from '@/Components/UI/ConfirmDialog';
import Flash from '@/Components/UI/Flash';

function Detail({ icon: Icon, label, value, mono }) {
    return (
        <div className="flex gap-3">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#E11D23]" strokeWidth={1.8} />
            <div className="min-w-0">
                <p className="text-xs text-slate-400">{label}</p>
                <p className={`break-words text-sm text-slate-800 ${mono ? 'font-mono' : ''}`}>{value || '—'}</p>
            </div>
        </div>
    );
}

export default function Show({ vehicle }) {
    const [confirming, setConfirming] = useState(false);
    const [processing, setProcessing] = useState(false);

    const remove = () => {
        setProcessing(true);
        router.delete(`/vehicles/${vehicle.id}`, { onFinish: () => setProcessing(false) });
    };

    const label = vehicle.unit_number ? `Unit ${vehicle.unit_number}` : vehicle.vin;

    return (
        <PortalLayout
            title={label}
            subtitle={[[vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' '), vehicle.company?.name].filter(Boolean).join(' · ')}
            actions={
                <>
                    <Link
                        href="/vehicles"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Link>
                    <Link
                        href={`/vehicles/${vehicle.id}/edit`}
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

            <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h2 className="text-sm font-semibold text-slate-900">Vehicle</h2>

                    <div className="mt-5 space-y-4">
                        <Detail icon={Truck} label="VIN" value={vehicle.vin} mono />
                        <Detail icon={Hash} label="Unit number" value={vehicle.unit_number} />
                        <Detail icon={Truck} label="Make and model" value={[vehicle.make, vehicle.model].filter(Boolean).join(' ')} />
                        <Detail icon={Calendar} label="Year" value={vehicle.year} />
                        <Detail icon={CircleDot} label="Tire size" value={vehicle.tire_size} />
                        <Detail icon={FileText} label="Type" value={vehicle.vehicle_type} />
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h2 className="text-sm font-semibold text-slate-900">Registration</h2>

                    <div className="mt-5 space-y-4">
                        <Detail icon={FileText} label="License plate" value={[vehicle.license_plate, vehicle.plate_state].filter(Boolean).join(' · ')} />

                        <div className="flex gap-3">
                            <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-[#E11D23]" strokeWidth={1.8} />
                            <div>
                                <p className="text-xs text-slate-400">Company</p>
                                <Link href={`/companies/${vehicle.company?.id}`} className="text-sm text-slate-800 hover:text-[#E11D23]">
                                    {vehicle.company?.name ?? '—'}
                                </Link>
                            </div>
                        </div>
                    </div>

                    {vehicle.notes && (
                        <div className="mt-5 border-t border-slate-100 pt-4">
                            <p className="text-xs text-slate-400">Notes</p>
                            <p className="mt-1 whitespace-pre-line text-sm text-slate-700">{vehicle.notes}</p>
                        </div>
                    )}

                    <p className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-400">
                        Registration and inspection documents with expiry tracking arrive in Milestone 3.
                    </p>
                </div>
            </div>

            <ConfirmDialog
                open={confirming}
                title={`Remove ${label}?`}
                message="The vehicle will be hidden from the portal. Nothing is permanently destroyed, so the record can be restored if this was a mistake."
                processing={processing}
                onConfirm={remove}
                onCancel={() => setConfirming(false)}
            />
        </PortalLayout>
    );
}
