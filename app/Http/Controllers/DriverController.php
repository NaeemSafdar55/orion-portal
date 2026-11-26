<?php

namespace App\Http\Controllers;

use App\Http\Requests\DriverRequest;
use App\Models\Company;
use App\Models\Driver;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DriverController extends Controller
{
    public function index(Request $request): Response
    {
        $sort = in_array($request->get('sort'), ['last_name', 'first_name', 'license_state']) ? $request->get('sort') : 'last_name';
        $direction = $request->get('direction') === 'desc' ? 'desc' : 'asc';

        /**
         * The licence number is deliberately not selected for the list. It is
         * encrypted, so every row would have to be decrypted to display it, and
         * licence numbers do not belong in a list view anyway. They appear on
         * the driver's own page.
         */
        $drivers = Driver::query()
            ->select(['id', 'company_id', 'first_name', 'last_name', 'license_state', 'license_class', 'endorsements', 'active'])
            ->with('company:id,name')
            ->search($request->get('search'))
            ->when($request->get('company'), fn ($q, $companyId) => $q->where('company_id', $companyId))
            ->when($request->get('status') === 'active', fn ($q) => $q->where('active', true))
            ->when($request->get('status') === 'inactive', fn ($q) => $q->where('active', false))
            ->orderBy($sort, $direction)
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('Drivers/Index', [
            'drivers' => $drivers,
            'companies' => Company::orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['search', 'company', 'status', 'sort', 'direction']),
            'total' => Driver::count(),
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('Drivers/Form', [
            'driver' => null,
            'companies' => Company::orderBy('name')->get(['id', 'name']),
            'preselectedCompany' => $request->get('company'),
        ]);
    }

    public function store(DriverRequest $request)
    {
        $driver = Driver::create($request->validated());

        return redirect()
            ->route('drivers.show', $driver)
            ->with('success', $driver->full_name.' has been added.');
    }

    public function show(Driver $driver): Response
    {
        $driver->load('company:id,name');

        return Inertia::render('Drivers/Show', [
            'driver' => $driver->append('full_name'),
        ]);
    }

    public function edit(Driver $driver): Response
    {
        return Inertia::render('Drivers/Form', [
            'driver' => $driver,
            'companies' => Company::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(DriverRequest $request, Driver $driver)
    {
        $driver->update($request->validated());

        return redirect()
            ->route('drivers.show', $driver)
            ->with('success', 'Changes saved.');
    }

    public function destroy(Driver $driver)
    {
        $name = $driver->full_name;
        $companyId = $driver->company_id;
        $driver->delete();

        return redirect()
            ->route('drivers.index', ['company' => $companyId])
            ->with('success', $name.' has been removed. The record can be restored if this was a mistake.');
    }
}
