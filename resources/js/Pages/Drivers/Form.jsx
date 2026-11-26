import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import PortalLayout from '@/Layouts/PortalLayout';
import { Field, Input, Textarea, Select } from '@/Components/UI/Field';

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

export default function Form({ driver, companies, preselectedCompany }) {
    const editing = Boolean(driver);

    const { data, setData, post, put, processing, errors } = useForm({
        company_id: driver?.company_id ?? preselectedCompany ?? '',
        first_name: driver?.first_name ?? '',
        last_name: driver?.last_name ?? '',
        license_number: driver?.license_number ?? '',
        dd_number: driver?.dd_number ?? '',
        license_state: driver?.license_state ?? '',
        license_class: driver?.license_class ?? '',
        endorsements: driver?.endorsements ?? '',
        restrictions: driver?.restrictions ?? '',
        date_of_birth: driver?.date_of_birth?.substring(0, 10) ?? '',
        hired_on: driver?.hired_on?.substring(0, 10) ?? '',
        phone: driver?.phone ?? '',
        email: driver?.email ?? '',
        notes: driver?.notes ?? '',
        active: driver?.active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        editing ? put(`/drivers/${driver.id}`) : post('/drivers');
    };

    return (
        <PortalLayout
            title={editing ? 'Edit Driver' : 'Add Driver'}
            subtitle={editing ? `${driver.first_name} ${driver.last_name}` : 'Create a new driver record'}
            actions={
                <Link
                    href={editing ? `/drivers/${driver.id}` : '/drivers'}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Cancel
                </Link>
            }
        >
            <form onSubmit={submit} className="max-w-3xl space-y-5">
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h2 className="text-sm font-semibold text-slate-900">Driver</h2>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <Field label="Company" required error={errors.company_id}>
                                <Select
                                    value={data.company_id}
                                    onChange={(e) => setData('company_id', e.target.value)}
                                    error={errors.company_id}
                                >
                                    <option value="">Select a company</option>
                                    {companies.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </Select>
                            </Field>
                        </div>

                        <Field label="First name" required error={errors.first_name}>
                            <Input value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} error={errors.first_name} autoFocus />
                        </Field>

                        <Field label="Last name" required error={errors.last_name}>
                            <Input value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} error={errors.last_name} />
                        </Field>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h2 className="text-sm font-semibold text-slate-900">License</h2>
                    <p className="mt-1 text-xs text-slate-400">
                        License and DD numbers are encrypted before they are saved.
                    </p>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <Field label="License number" error={errors.license_number}>
                            <Input value={data.license_number} onChange={(e) => setData('license_number', e.target.value)} error={errors.license_number} />
                        </Field>

                        <Field label="DD number" error={errors.dd_number}>
                            <Input value={data.dd_number} onChange={(e) => setData('dd_number', e.target.value)} error={errors.dd_number} />
                        </Field>

                        <Field label="Issuing state" error={errors.license_state}>
                            <Select value={data.license_state} onChange={(e) => setData('license_state', e.target.value)} error={errors.license_state}>
                                <option value="">Select</option>
                                {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </Select>
                        </Field>

                        <Field label="Class" error={errors.license_class}>
                            <Select value={data.license_class} onChange={(e) => setData('license_class', e.target.value)} error={errors.license_class}>
                                <option value="">Select</option>
                                <option value="A">Class A</option>
                                <option value="B">Class B</option>
                                <option value="C">Class C</option>
                            </Select>
                        </Field>

                        <Field label="Endorsements" hint="For example H, N, T, X" error={errors.endorsements}>
                            <Input value={data.endorsements} onChange={(e) => setData('endorsements', e.target.value)} error={errors.endorsements} />
                        </Field>

                        <Field label="Restrictions" hint="For example E, L, O" error={errors.restrictions}>
                            <Input value={data.restrictions} onChange={(e) => setData('restrictions', e.target.value)} error={errors.restrictions} />
                        </Field>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h2 className="text-sm font-semibold text-slate-900">Contact and dates</h2>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <Field label="Phone" error={errors.phone}>
                            <Input value={data.phone} onChange={(e) => setData('phone', e.target.value)} error={errors.phone} />
                        </Field>

                        <Field label="Email" error={errors.email}>
                            <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} error={errors.email} />
                        </Field>

                        <Field label="Date of birth" error={errors.date_of_birth}>
                            <Input type="date" value={data.date_of_birth} onChange={(e) => setData('date_of_birth', e.target.value)} error={errors.date_of_birth} />
                        </Field>

                        <Field label="Hired on" error={errors.hired_on}>
                            <Input type="date" value={data.hired_on} onChange={(e) => setData('hired_on', e.target.value)} error={errors.hired_on} />
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
                        href={editing ? `/drivers/${driver.id}` : '/drivers'}
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
                        {editing ? 'Save changes' : 'Add driver'}
                    </button>
                </div>
            </form>
        </PortalLayout>
    );
}
