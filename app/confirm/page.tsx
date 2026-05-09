'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "../components/molecules/FormField";
import { Input } from "../components/atoms/Input";
import { SectionHeader } from "../components/molecules/SectionHeader";
import { Button } from "../components/atoms/Button";

interface DeviceData {
  device_id: string;
  brand: string;
  model: string;
  confidence: number;
  imageBase64: string;
}

export default function ConfirmPage() {
  const router = useRouter();

  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("deviceDetails");
    if (!stored) {
      router.push('/');
      return;
    }
    const data = JSON.parse(stored);
    setDeviceData(data);
    setBrand(data.brand || "");
    setModel(data.model || "");
  }, [router]);

  if (!deviceData) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('https://device-rag-backend.onrender.com/api/confirm-device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_id: deviceData.device_id,
          model: model,
          brand: brand
        })
      });

      if (!response.ok) throw new Error("Failed to confirm device details");
      const confirmData = await response.json();

      const updatedData = {
        ...deviceData,
        device_name: confirmData.device_name
      };
      sessionStorage.setItem("deviceDetails", JSON.stringify(updatedData));

      router.push('/specs');

    } catch (err: any) {
      alert(err.message || "An error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="w-full h-full p-3 sm:p-4 lg:p-6 font-sans">
      <div className="max-w-5xl mx-auto">

        <div className="mb-5 lg:mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl sm:text-4xl">✅</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Review & Confirm
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg ml-1">
            Review the detected information and allow correction.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">

          {/* Left Column: Image Display */}
          <section className="flex flex-col">
            <SectionHeader icon="🖼️" title="Uploaded Image" />
            <div className="flex-1 min-h-[220px] border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-[#16181e] shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden flex items-center justify-center p-4">
              {deviceData.imageBase64 ? (
                <img
                  src={deviceData.imageBase64}
                  alt="Uploaded Device"
                  className="max-h-full max-w-full object-contain rounded-lg"
                />
              ) : (
                <p className="text-slate-400 dark:text-slate-500 font-medium">No image uploaded</p>
              )}
            </div>
          </section>

          {/* Right Column: Information & Corrections */}
          <section className="flex flex-col">
            <SectionHeader icon="🔍" title="Detected Information" />

            <div className="flex flex-col gap-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-[#16181e] shadow-xl shadow-slate-200/40 dark:shadow-none p-4 sm:p-5">

              <div className="flex justify-between items-center pb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Confidence</p>
                  <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 relative">
                    {Math.round(deviceData.confidence * 100)}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Device ID</p>
                  <p className="font-mono text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md">
                    {deviceData.device_id.slice(0, 12)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-2">
                <FormField id="brand-correction" label="Correction: Brand">
                  <Input
                    id="brand-correction"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </FormField>

                <FormField id="model-correction" label="Correction: Model">
                  <Input
                    id="model-correction"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                  />
                </FormField>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-5 justify-end">
              <Button type="button" variant="outline" onClick={() => router.push('/')} className="px-8 py-3 w-full sm:w-auto">
                Back to Upload
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="px-8 py-3 font-bold shadow-lg shadow-indigo-900/10 dark:shadow-indigo-900/20 w-full sm:w-auto"
              >
                {isSubmitting ? 'Finalizing...' : 'Finalize Context'}
              </Button>
            </div>

          </section>

        </div>

      </div>
    </main>
  );
}
