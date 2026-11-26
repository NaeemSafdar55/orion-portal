<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VehicleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $vehicleId = $this->route('vehicle')?->id;

        return [
            'company_id' => ['required', 'exists:companies,id'],
            'vin' => [
                'required', 'string', 'min:11', 'max:25',
                Rule::unique('vehicles', 'vin')->ignore($vehicleId)->whereNull('deleted_at'),
            ],
            'unit_number' => ['nullable', 'string', 'max:50'],
            'make' => ['nullable', 'string', 'max:120'],
            'model' => ['nullable', 'string', 'max:120'],
            'year' => ['nullable', 'integer', 'min:1950', 'max:'.(date('Y') + 2)],
            'license_plate' => ['nullable', 'string', 'max:20'],
            'plate_state' => ['nullable', 'string', 'max:50'],
            'tire_size' => ['nullable', 'string', 'max:30'],
            'vehicle_type' => ['nullable', 'in:tractor,trailer,straight truck'],
            'active' => ['boolean'],
            'notes' => ['nullable', 'string', 'max:5000'],
        ];
    }

    public function messages(): array
    {
        return [
            'company_id.required' => 'Please choose which company this vehicle belongs to.',
            'vin.required' => 'VIN is required.',
            'vin.unique' => 'Another vehicle already has that VIN.',
            'vin.min' => 'That VIN looks too short. Please check it.',
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->filled('vin')) {
            $this->merge(['vin' => strtoupper(trim($this->input('vin')))]);
        }

        if ($this->filled('license_plate')) {
            $this->merge(['license_plate' => strtoupper(trim($this->input('license_plate')))]);
        }
    }
}
