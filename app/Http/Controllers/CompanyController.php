<?php

namespace App\Http\Controllers;

use App\Http\Requests\CompanyRequest;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    /**
     * Searchable, sortable, paginated list.
     *
     * Only the columns the table shows are selected, and driver and vehicle
     * counts come from withCount rather than loading the relations, which is
     * what keeps this fast at 50 companies with 4,000 records beneath them.
     */
    public function index(Request $request): Response
    {
        $sort = in_array($request->get('sort'), ['name', 'city', 'state', 'dot_number']) ? $request->get('sort') : 'name';
        $direction = $request->get('direction') === 'desc' ? 'desc' : 'asc';

        $companies = Company::query()
            ->select(['id', 'name', 'dot_number', 'mc_number', 'city', 'state', 'phone', 'active'])
            ->withCount(['drivers', 'vehicles'])
            ->search($request->get('search'))
            ->when($request->get('status') === 'active', fn ($q) => $q->where('active', true))
            ->when($request->get('status') === 'inactive', fn ($q) => $q->where('active', false))
            ->orderBy($sort, $direction)
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('Companies/Index', [
            'companies' => $companies,
            'filters' => $request->only(['search', 'status', 'sort', 'direction']),
            'total' => Company::count(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Companies/Form', [
            'company' => null,
        ]);
    }

    public function store(CompanyRequest $request)
    {
        $company = Company::create($request->validated());

        return redirect()
            ->route('companies.show', $company)
            ->with('success', $company->name.' has been added.');
    }

    public function show(Company $company): Response
    {
        $company->loadCount(['drivers', 'vehicles']);

        return Inertia::render('Companies/Show', [
            'company' => $company,
            'drivers' => $company->drivers()
                ->select(['id', 'company_id', 'first_name', 'last_name', 'license_state', 'license_class', 'active'])
                ->orderBy('last_name')
                ->limit(10)
                ->get(),
            'vehicles' => $company->vehicles()
                ->select(['id', 'company_id', 'vin', 'unit_number', 'make', 'model', 'year', 'active'])
                ->orderBy('unit_number')
                ->limit(10)
                ->get(),
        ]);
    }

    public function edit(Company $company): Response
    {
        return Inertia::render('Companies/Form', [
            'company' => $company,
        ]);
    }

    public function update(CompanyRequest $request, Company $company)
    {
        $company->update($request->validated());

        return redirect()
            ->route('companies.show', $company)
            ->with('success', 'Changes saved.');
    }

    /**
     * Soft delete. The record stays in the database and can be restored,
     * which is checklist item 18.
     */
    public function destroy(Company $company)
    {
        $name = $company->name;
        $company->delete();

        return redirect()
            ->route('companies.index')
            ->with('success', $name.' has been removed. It can be restored if this was a mistake.');
    }
}
