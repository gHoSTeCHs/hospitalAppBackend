import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';
import React, { FormEventHandler, useEffect, useState } from 'react';

interface HospitalDetailsProps {
    id: number;
    user_id: number;
    name: string | null;
    logo: string | null;
    hospital_code: number;
    verified: boolean;
    address: string;
    created_at: string;
    updated_at: string;
}

const UpdateHospitalDetails = () => {
    const { auth } = usePage<SharedData>().props;
    const [hospitalData, setHospitalData] = useState<HospitalDetailsProps>();
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const { data, setData, errors, processing, patch, recentlySuccessful } = useForm({
        hospitalName: '',
        hospitalAddress: '',
        hospitalLogo: null as File | null,
    });

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Set file for form submission
            setData('hospitalLogo', file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeLogoPreview = () => {
        setLogoPreview(null);
        setData('hospitalLogo', null);
    };

    const onSubmit: FormEventHandler = (event) => {
        event.preventDefault();

        const id = hospitalData?.id;
        patch(route('admin.hospital.update', id), {
            preserveScroll: true,
        });
    };

    useEffect(() => {
        const fetchHospitalDetails = async () => {
            try {
                const URL = `http://127.0.0.1:8000/admin/hospitals/${auth.user.id}`;
                const response = await fetch(URL);
                const data = await response.json();
                const parsedData = data[0];
                setHospitalData(parsedData[0]);
            } catch (e) {
                console.error(e);
            }
        };

        fetchHospitalDetails().then();
    }, []);

    useEffect(() => {
        if (hospitalData) {
            setData({
                hospitalName: hospitalData.name || '',
                hospitalAddress: hospitalData.address || '',
                hospitalLogo: null,
            });
        }
    }, [hospitalData, setData]);

    return (
        <div className="space-y-6">
            <HeadingSmall title="Hospital information" description="Hospital information and documents" />

            <form className="space-y-6" onSubmit={onSubmit}>
                <div className="grid gap-2">
                    <Label htmlFor="hospitalName">Hospital Name</Label>

                    <Input
                        id="hospitalName"
                        value={data.hospitalName}
                        onChange={(e) => setData('hospitalName', e.target.value)}
                        className="mt-1 block w-full"
                        required
                        autoComplete="name"
                        placeholder="Full name"
                    />

                    <InputError message={errors.hospitalName} className="mt-2" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="hospitalLocation">Hospital Address</Label>

                    <Input
                        id="hospitalLocation"
                        value={data.hospitalAddress}
                        onChange={(e) => setData('hospitalAddress', e.target.value)}
                        className="mt-1 block w-full"
                        required
                        autoComplete="address-line1"
                        placeholder="Full hospital address"
                    />

                    <InputError message={errors.hospitalAddress} className="mt-2" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="hospitalLogo">Hospital Logo</Label>
                    <Input id="hospitalLogo" type="file" accept="image/*" onChange={handleLogoChange} className="mt-1 block w-full" />
                    <InputError message={errors.hospitalLogo} className="mt-2" />

                    {logoPreview && (
                        <div className="mt-4 flex items-center gap-4">
                            <img src={logoPreview} alt="Hospital Logo Preview" className="h-32 w-32 rounded object-cover" />
                            <Button type="button" variant="destructive" onClick={removeLogoPreview}>
                                Remove
                            </Button>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <Button disabled={processing}>Save</Button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-neutral-600">Saved</p>
                    </Transition>
                </div>
            </form>
        </div>
    );
};

export default UpdateHospitalDetails;
