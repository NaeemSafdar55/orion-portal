import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import PortalLayout from '@/Layouts/PortalLayout';
import { Field, Input, Textarea, Select } from '@/Components/UI/Field';

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

export default function Form({ vehicle, companies, preselectedCompany }) {
    const editing = Boolean(vehicle);

    const { data, setData, post, put, processing, errors } = useForm({
        company_id: vehicle?.company_id ?? preselectedCompany ?? '',
        vin: vehicle?.vin ?? '',
        unit_number: vehicle?.unit_number ?? '',
        make: vehicle?.make ?? '',
        model: vehicle?.model ?? '',
        year: vehicle?.year ?? '',
        license_plate: vehicle?.license_plate ?? '',
        plate_state: vehicle?.plate_state ?? '',
        tire_size: vehicle?.tire_size ?? '',
        vehicle_type: vehicle?.vehicle_type ?? '',
        notes: vehicle?.notes ?? '',
        active: vehicle?.active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        editing ? put(`/vehicles/${vehicle.id}`) : post('/vehicles');
    };

    return (
        <PortalLayout
            title={editing ? 'Edit Vehicle' : 'Add Vehicle'}
            subtitle={editing ? (vehicle.unit_number ? `Unit ${vehicle.unit_number}` : vehicle.vin) : 'Create a new vehicle record'}
            actions={
                <Link
                    href={editing ? `/vehicles/${vehicle.id}` : '/vehicles'}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Cancel
                </Link>
            }
        >
            <form onSubmit={submit} className="max-w-3xl space-y-5">
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h2 className="text-sm font-semibold text-slate-900">Vehicle</h2>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <Field label="Company" required error={errors.company_id}>
                                <Select value={data.company_id} onChange={(e) => setData('company_id', e.target.value)} error={errors.company_id}>
                                    <option value="">Select a company</option>
                                    {companies.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </Select>
                            </Field>
                        </div>

                        <div className="sm:col-span-2">
                            <Field label="VIN" required hint="Saved in capitals" error={errors.vin}>
                                <Input
                                    value={data.vin}
                                    onChange={(e) => setData('vin', e.target.value)}
                                    error={errors.vin}
                                    className="block w-full rounded-lg border-slate-300 font-mono text-sm shadow-sm focus:border-[#E11D23] focus:ring-[#E11D23]"
                                    autoFocus
                                />
                            </Field>
                        </div>

                        <Field label="Unit number" error={errors.unit_number}>
                            <Input value={data.unit_number} onChange={(e) => setData('unit_number', e.target.value)} error={errors.unit_number} />
                        </Field>

                        <Field label="Type" error={errors.vehicle_type}>
                            <Select value={data.vehicle_type} onChange={(e) => setData('vehicle_type', e.target.value)} error={errors.vehicle_type}>
                                <option value="">Select</option>
                                <option value="tractor">Tractor</option>
                                <option value="trailer">Trailer</option>
                                <option value="straight truck">Straight truck</option>
                            </Select>
                        </Field>

                        <Field label="Make" error={errors.make}>
                            <Input value={data.make} onChange={(e) => setData('make', e.target.value)} error={errors.make} />
                        </Field>

                        <Field label="Model" error={errors.model}>
                            <Input value={data.model} onChange={(e) => setData('model', e.target.value)} error={errors.model} />
                        </Field>

                        <Field label="Year" error={errors.year}>
                            <Input type="number" value={data.year} onChange={(e) => setData('year', e.target.value)} error={errors.year} />
                        </Field>

                        <Field label="Tire size" error={errors.tire_size}>
                            <Input value={data.tire_size} onChange={(e) => setData('tire_size', e.target.value)} error={errors.tire_size} />
                        </Field>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h2 className="text-sm font-semibold text-slate-900">Registration</h2>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <Field label="License plate" error={errors.license_plate}>
                            <Input value={data.license_plate} onChange={(e) => setData('license_plate', e.target.value)} error={errors.license_plate} />
                        </Field>

                        <Field label="Plate state" error={errors.plate_state}>
                            <Select value={data.plate_state} onChange={(e) => setData('plate_state', e.target.value)} error={errors.plate_state}>
                                <option value="">Select</option>
                                {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </Select>
                        </Field>

                        <div className="sm:col-span-2">
                            <Field label="Notes" error={errors.notes}>
                                <Textarea value={data.notes} onChange={(e) => setData('notes', e.target.value)} error={errors.notes} rows={3} />
                            </Field>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={data.active}
                                    onChange={(e) => setData('active', e.target.checked)}
                                    className="rounded border-slate-300 text-[#E11D23] focus:ring-[#E11D23]"
                                />
                                <span className="text-sm text-slate-700">Active</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Link
                        href={editing ? `/vehicles/${vehicle.id}` : '/vehicles'}
                        className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#E11D23] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#c4161b] disabled:opacity-60"
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        {editing ? 'Save changes' : 'Add vehicle'}
                    </button>
                </div>
            </form>
        </PortalLayout>
    );
}
