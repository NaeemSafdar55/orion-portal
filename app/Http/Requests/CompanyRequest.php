<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompanyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Permission checks arrive with the roles work in Phase 2.
    }

    public function rules(): array
    {
        $companyId = $this->route('company')?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'dot_number' => ['nullable', 'string', 'max:50', Rule::unique('companies', 'dot_number')->ignore($companyId)->whereNull('deleted_at')],
            'mc_number' => ['nullable', 'string', 'max:50', Rule::unique('companies', 'mc_number')->ignore($companyId)->whereNull('deleted_at')],
            'address_line_1' => ['nullable', 'string', 'max:255'],
            'address_line_2' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:120'],
            'state' => ['nullable', 'string', 'max:50'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'phone' => ['nullable', 'string', 'max:40'],
            'email' => ['nullable', 'email', 'max:255'],
            'contact_name' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:5000'],
            'active' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Company name is required.',
            'dot_number.unique' => 'Another company already has that DOT number.',
            'mc_number.unique' => 'Another company already has that MC number.',
        ];
    }
}
