<?php

namespace App\Http\Controllers\Api\Web;

use App\Http\Controllers\Controller;
use App\Models\Hospital;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class HospitalDetailsApiController extends Controller
{
    public function index($id): JsonResponse
    {
        $hospitalDetails = Hospital::query()->where('user_id', $id)->get();

        return response()->json([
            $hospitalDetails,
        ]);
    }

    public function upDateHospitalDetails(Request $request, $id): RedirectResponse
    {
        $hospital = Hospital::query()->findOrFail($id);

        // Prepare validation rules dynamically
        $rules = [];
        $updateData = [];

        // Dynamically add validation and update rules based on input
        if ($request->has('hospitalName')) {
            $rules['hospitalName'] = 'sometimes|string|max:255';
            $updateData['name'] = $request->input('hospitalName');
        }

        if ($request->has('hospitalAddress')) {
            $rules['hospitalAddress'] = 'sometimes|string|max:255';
            $updateData['address'] = $request->input('hospitalAddress');
        }

        if ($request->hasFile('hospitalLogo')) {
            $rules['hospitalLogo'] = 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048';
        }

        // Validate only the provided fields
        $validatedData = $request->validate($rules);

        // Update provided fields
        foreach ($updateData as $key => $value) {
            $hospital->{$key} = $value;
        }

        if ($request->hasFile('hospitalLogo')) {
            // Remove old logo if exists
            if ($hospital->logo && Storage::exists($hospital->logo)) {
                Storage::delete($hospital->logo);
            }

            // Store new logo
            $logoPath = $request->file('hospitalLogo')->store('hospital-logos', 'public');
            $hospital->logo = $logoPath;
        }

        // Only save if something has changed
        if ($hospital->isDirty()) {
            $hospital->save();

            return back()->with('success', 'Hospital details updated successfully.');
        }

        return back()->with('info', 'No changes were made.');

    }
}
