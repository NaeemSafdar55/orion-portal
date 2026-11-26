<?php

namespace App\Http\Controllers;

use App\Http\Requests\VehicleRequest;
use App\Models\Company;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller
{
    public function index(Request $request): Response
    {
        $sort = in_array($request->get('sort'), ['unit_number', 'vin', 'make', 'year']) ? $request->get('sort') : 'unit_number';
        $direction = $request->get('direction') === 'desc' ? 'desc' : 'asc';

        $vehicles = Vehicle::query()
            ->select(['id', 'company_id', 'vin', 'unit_number', 'make', 'model', 'year', 'license_plate', 'plate_state', 'vehicle_type', 'active'])
            ->with('company:id,name')
            ->search($request->get('search'))
            ->when($request->get('company'), fn ($q, $companyId) => $q->where('company_id', $companyId))
            ->when($request->get('status') === 'active', fn ($q) => $q->where('active', true))
            ->when($request->get('status') === 'inactive', fn ($q) => $q->where('active', false))
            ->orderBy($sort, $direction)
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('Vehicles/Index', [
            'vehicles' => $vehicles,
            'companies' => Company::orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['search', 'company', 'status', 'sort', 'direction']),
            'total' => Vehicle::count(),
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('Vehicles/Form', [
            'vehicle' => null,
            'companies' => Company::orderBy('name')->get(['id', 'name']),
            'preselectedCompany' => $request->get('company'),
        ]);
    }

    public function store(VehicleRequest $request)
    {
        $vehicle = Vehicle::create($request->validated());

        return redirect()
            ->route('vehicles.show', $vehicle)
            ->with('success', 'Vehicle '.($vehicle->unit_number ?: $vehicle->vin).' has been added.');
    }

    public function show(Vehicle $vehicle): Response
    {
        $vehicle->load('company:id,name');

        return Inertia::render('Vehicles/Show', [
            'vehicle' => $vehicle,
        ]);
    }

    public function edit(Vehicle $vehicle): Response
    {
        return Inertia::render('Vehicles/Form', [
            'vehicle' => $vehicle,
            'companies' => Company::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(VehicleRequest $request, Vehicle $vehicle)
    {
        $vehicle->update($request->validated());

        return redirect()
            ->route('vehicles.show', $vehicle)
            ->with('success', 'Changes saved.');
    }

    public function destroy(Vehicle $vehicle)
    {
        $label = $vehicle->unit_number ?: $vehicle->vin;
        $companyId = $vehicle->company_id;
        $vehicle->delete();

        return redirect()
            ->route('vehicles.index', ['company' => $companyId])
            ->with('success', 'Vehicle '.$label.' has been removed. The record can be restored if this was a mistake.');
    }
}
