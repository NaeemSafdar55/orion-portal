import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { IdCard, Hash, Award, Ban, Phone, Mail, Calendar, Building2, Pencil, Trash2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import PortalLayout from '@/Layouts/PortalLayout';
import ConfirmDialog from '@/Components/UI/ConfirmDialog';
import Flash from '@/Components/UI/Flash';

function Detail({ icon: Icon, label, value }) {
    return (
        <div className="flex gap-3">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#E11D23]" strokeWidth={1.8} />
            <div className="min-w-0">
                <p className="text-xs text-slate-400">{label}</p>
                <p className="break-words text-sm text-slate-800">{value || '—'}</p>
            </div>
        </div>
    );
}

/**
 * Licence and DD numbers are masked until clicked. They are personal data and
 * these screens get used with other people looking at them, so showing them
 * only on request is the sensible default.
 */
function SensitiveDetail({ icon: Icon, label, value }) {
    const [shown, setShown] = useState(false);

    return (
        <div className="flex gap-3">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#E11D23]" strokeWidth={1.8} />
            <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-400">{label}</p>
                <div className="flex items-center gap-2">
                    <p className="break-words font-mono text-sm text-slate-800">
                        {value ? (shown ? value : '•'.repeat(Math.min(value.length, 12))) : '—'}
                    </p>
                    {value && (
                        <button
                            type="button"
                            onClick={() => setShown((s) => !s)}
                            className="text-slate-400 hover:text-slate-600"
                            aria-label={shown ? `Hide ${label}` : `Show ${label}`}
                        >
                            {shown ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Show({ driver }) {
    const [confirming, setConfirming] = useState(false);
    const [processing, setProcessing] = useState(false);

    const remove = () => {
        setProcessing(true);
        router.delete(`/drivers/${driver.id}`, { onFinish: () => setProcessing(false) });
    };

    const formatDate = (value) =>
        value ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null;

    return (
        <PortalLayout
            title={`${driver.first_name} ${driver.last_name}`}
            subtitle={driver.company?.name}
            actions={
                <>
                    <Link
                        href="/drivers"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Link>
                    <Link
                        href={`/drivers/${driver.id}/edit`}
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
                    <h2 className="text-sm font-semibold text-slate-900">License</h2>

                    <div className="mt-5 space-y-4">
                        <SensitiveDetail icon={IdCard} label="License number" value={driver.license_number} />
                        <SensitiveDetail icon={Hash} label="DD number" value={driver.dd_number} />
                        <Detail icon={IdCard} label="State and class" value={[driver.license_state, driver.license_class && `Class ${driver.license_class}`].filter(Boolean).join(' · ')} />
                        <Detail icon={Award} label="Endorsements" value={driver.endorsements} />
                        <Detail icon={Ban} label="Restrictions" value={driver.restrictions} />
                    </div>

                    <p className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-400">
                        License and DD numbers are stored encrypted. Document uploads and expiry tracking arrive in Milestone 3.
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h2 className="text-sm font-semibold text-slate-900">Driver</h2>

                    <div className="mt-5 space-y-4">
                        <div className="flex gap-3">
                            <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-[#E11D23]" strokeWidth={1.8} />
                            <div>
                                <p className="text-xs text-slate-400">Company</p>
                                <Link href={`/companies/${driver.company?.id}`} className="text-sm text-slate-800 hover:text-[#E11D23]">
                                    {driver.company?.name ?? '—'}
                                </Link>
                            </div>
                        </div>

                        <Detail icon={Phone} label="Phone" value={driver.phone} />
                        <Detail icon={Mail} label="Email" value={driver.email} />
                        <Detail icon={Calendar} label="Date of birth" value={formatDate(driver.date_of_birth)} />
                        <Detail icon={Calendar} label="Hired" value={formatDate(driver.hired_on)} />
                    </div>

                    {driver.notes && (
                        <div className="mt-5 border-t border-slate-100 pt-4">
                            <p className="text-xs text-slate-400">Notes</p>
                            <p className="mt-1 whitespace-pre-line text-sm text-slate-700">{driver.notes}</p>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmDialog
                open={confirming}
                title={`Remove ${driver.first_name} ${driver.last_name}?`}
                message="The driver will be hidden from the portal. Nothing is permanently destroyed, so the record can be restored if this was a mistake."
                processing={processing}
                onConfirm={remove}
                onCancel={() => setConfirming(false)}
            />
        </PortalLayout>
    );
}
