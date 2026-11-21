import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import PortalLayout from '@/Layouts/PortalLayout';
import { Field, Input, Textarea, Select } from '@/Components/UI/Field';

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

export default function Form({ company }) {
    const editing = Boolean(company);

    const { data, setData, post, put, processing, errors } = useForm({
        name: company?.name ?? '',
        dot_number: company?.dot_number ?? '',
        mc_number: company?.mc_number ?? '',
        address_line_1: company?.address_line_1 ?? '',
        address_line_2: company?.address_line_2 ?? '',
        city: company?.city ?? '',
        state: company?.state ?? '',
        postal_code: company?.postal_code ?? '',
        phone: company?.phone ?? '',
        email: company?.email ?? '',
        contact_name: company?.contact_name ?? '',
        notes: company?.notes ?? '',
        active: company?.active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        editing ? put(`/companies/${company.id}`) : post('/companies');
    };

    return (
        <PortalLayout
            title={editing ? 'Edit Company' : 'Add Company'}
            subtitle={editing ? company.name : 'Create a new trucking company record'}
            actions={
                <Link
                    href={editing ? `/companies/${company.id}` : '/companies'}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Cancel
                </Link>
            }
        >
            <form onSubmit={submit} className="max-w-3xl space-y-5">
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h2 className="text-sm font-semibold text-slate-900">Company</h2>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <Field label="Company name" required error={errors.name}>
                                <Input
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    error={errors.name}
                                    autoFocus
                                />
                            </Field>
                        </div>

                        <Field label="DOT number" error={errors.dot_number}>
                            <Input
                                value={data.dot_number}
                                onChange={(e) => setData('dot_number', e.target.value)}
                                error={errors.dot_number}
                            />
                        </Field>

                        <Field label="MC number" error={errors.mc_number}>
                            <Input
                                value={data.mc_number}
                                onChange={(e) => setData('mc_number', e.target.value)}
                                error={errors.mc_number}
                            />
                        </Field>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h2 className="text-sm font-semibold text-slate-900">Address</h2>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <Field label="Street address" error={errors.address_line_1}>
                                <Input value={data.address_line_1} onChange={(e) => setData('address_line_1', e.target.value)} error={errors.address_line_1} />
                            </Field>
                        </div>

                        <div className="sm:col-span-2">
                            <Field label="Suite, unit, floor" error={errors.address_line_2}>
                                <Input value={data.address_line_2} onChange={(e) => setData('address_line_2', e.target.value)} error={errors.address_line_2} />
                            </Field>
                        </div>

                        <Field label="City" error={errors.city}>
                            <Input value={data.city} onChange={(e) => setData('city', e.target.value)} error={errors.city} />
                        </Field>

                        <div className="grid grid-cols-2 gap-5">
                            <Field label="State" error={errors.state}>
                                <Select value={data.state} onChange={(e) => setData('state', e.target.value)} error={errors.state}>
                                    <option value="">Select</option>
                                    {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                                </Select>
                            </Field>

                            <Field label="ZIP" error={errors.postal_code}>
                                <Input value={data.postal_code} onChange={(e) => setData('postal_code', e.target.value)} error={errors.postal_code} />
                            </Field>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h2 className="text-sm font-semibold text-slate-900">Contact</h2>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <Field label="Contact name" error={errors.contact_name}>
                            <Input value={data.contact_name} onChange={(e) => setData('contact_name', e.target.value)} error={errors.contact_name} />
                        </Field>

                        <Field label="Phone" error={errors.phone}>
                            <Input value={data.phone} onChange={(e) => setData('phone', e.target.value)} error={errors.phone} />
                        </Field>

                        <div className="sm:col-span-2">
                            <Field label="Email" error={errors.email}>
                                <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} error={errors.email} />
                            </Field>
                        </div>

                        <div className="sm:col-span-2">
                            <Field label="Notes" error={errors.notes}>
                                <Textarea value={data.notes} onChange={(e) => setData('notes', e.target.value)} error={errors.notes} rows={4} />
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
                        href={editing ? `/companies/${company.id}` : '/companies'}
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
                        {editing ? 'Save changes' : 'Add company'}
                    </button>
                </div>
            </form>
        </PortalLayout>
    );
}
