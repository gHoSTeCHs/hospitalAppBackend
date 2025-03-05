<?php

namespace App\Http\Controllers\Api\Web;

use App\Http\Controllers\Controller;
use App\Models\Hospital;
use App\Models\HospitalDocument;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class HospitalDetailsApiController extends Controller
{
    private function generateUniqueFileName($file, $hospitalId): string
    {
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $file->getClientOriginalExtension();
        $timestamp = now()->format('YmdHis');

        return "{$originalName}_{$hospitalId}_{$timestamp}.{$extension}";
    }

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

        $rules = [];
        $updateData = [];

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

        if ($hospital->isDirty()) {
            $hospital->save();

            return back()->with('success', 'Hospital details updated successfully.');
        }

        return back()->with('info', 'No changes were made.');

    }

    public function getDocumentStatus($id): JsonResponse
    {
        $user = User::query()->findOrFail($id);
        $hospital = Hospital::query()->findOrFail($user->hospital_id);
        $documents = HospitalDocument::query()->where('hospital_id', $hospital->id)->get();

        return response()->json([
            $documents,
        ]);
    }

    public function uploadDocuments(Request $request, $id): RedirectResponse
    {
        try {
            $validatedData = $request->validate([
                'corporate_affairs_commission' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            ]);

            $hospital = Hospital::query()->where('user_id', $id)->firstOrFail();

            if (! $hospital) {
                throw ValidationException::withMessages([
                    'hospital' => ['No associated hospital found'],
                ]);
            }

            if ($request->hasFile('corporate_affairs_commission')) {
                $file = $request->file('corporate_affairs_commission');

                $document = HospitalDocument::query()->where('hospital_id', $hospital->id)->where('document_title', 'Corporate Affairs Commission')->first();

                if ($document->path == null) {
                    $fileName = $this->generateUniqueFileName($file, $hospital->id);
                    $path = $file->storeAs('hospital-documents', $fileName, 'public');
                    $document->update([
                        'path' => $path,
                    ]);
                }

            }

            return back()->with('success', 'Document uploaded successfully');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->with('error', 'Document upload failed: '.$e->getMessage());
        }
    }
}
