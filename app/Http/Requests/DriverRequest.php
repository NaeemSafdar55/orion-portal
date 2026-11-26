<?php

namespace App\Http\Requests;

use App\Models\Driver;
use App\Support\BlindIndex;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class DriverRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_id' => ['required', 'exists:companies,id'],
            'first_name' => ['required', 'string', 'max:120'],
            'last_name' => ['required', 'string', 'max:120'],
            'license_number' => ['nullable', 'string', 'max:60'],
            'dd_number' => ['nullable', 'string', 'max:60'],
            'license_state' => ['nullable', 'string', 'max:50'],
            'license_class' => ['nullable', 'in:A,B,C'],
            'endorsements' => ['nullable', 'string', 'max:120'],
            'restrictions' => ['nullable', 'string', 'max:120'],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
            'hired_on' => ['nullable', 'date'],
            'phone' => ['nullable', 'string', 'max:40'],
            'email' => ['nullable', 'email', 'max:255'],
            'active' => ['boolean'],
            'notes' => ['nullable', 'string', 'max:5000'],
        ];
    }

    public function messages(): array
    {
        return [
            'company_id.required' => 'Please choose which company this driver works for.',
            'first_name.required' => 'First name is required.',
            'last_name.required' => 'Last name is required.',
            'license_class.in' => 'License class must be A, B or C.',
        ];
    }

    /**
     * Licence numbers are encrypted, so a normal unique rule cannot see them.
     * This checks the blind index instead, which is how the rest of the system
     * searches them.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if (! $this->filled('license_number')) {
                return;
            }

            $hash = BlindIndex::make($this->input('license_number'));
            $currentId = $this->route('driver')?->id;

            $exists = Driver::withoutGlobalScope('company')
                ->where('license_number_hash', $hash)
                ->when($currentId, fn ($q) => $q->whereKeyNot($currentId))
                ->exists();

            if ($exists) {
                $validator->errors()->add('license_number', 'Another driver already has that license number.');
            }
        });
    }
}
