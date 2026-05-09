'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "../components/molecules/FormField";
import { Input } from "../components/atoms/Input";
import { SectionHeader } from "../components/molecules/SectionHeader";
import { Button } from "../components/atoms/Button";
import { CheckCircle, Image as ImageIcon, Search } from "lucide-react";
import { FloatingBackgroundIcons } from "../components/organisms/FloatingBackgroundIcons";

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
      const response = await fetch('/api/confirm-device', {
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
    <main className="relative w-full min-h-screen overflow-hidden bg-slate-50 dark:bg-[#060913] font-sans selection:bg-indigo-500/30 text-slate-900 dark:text-slate-200 flex flex-col items-center pt-3 pb-5 lg:pb-7">
      
      {/* Premium Tech Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Floating Doodles */}
      <FloatingBackgroundIcons />

      {/* Dynamic Background Glowing Orbs */}
      <div className="absolute top-0 left-[-10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-emerald-500/20 dark:bg-emerald-600/10 blur-[130px] rounded-full animate-pulse mix-blend-multiply dark:mix-blend-screen pointer-events-none transition-all duration-1000 z-0"></div>
      <div className="absolute bottom-[-10%] right-[-20%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-teal-500/15 dark:bg-cyan-600/10 blur-[130px] rounded-full animate-pulse mix-blend-multiply dark:mix-blend-screen pointer-events-none transition-all duration-1000 z-0" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[30vw] max-w-[900px] max-h-[400px] bg-indigo-400/10 dark:bg-emerald-500/5 blur-[140px] rounded-full pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 lg:px-8">

        {/* Hero Section */}
        <div className="text-center mb-5 lg:mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-500 drop-shadow-sm" />
            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 drop-shadow-sm">
                Review & Confirm
              </span>
            </h1>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed hidden sm:block">
            Review the detected information and allow correction.
          </p>
        </div>

        <div className="relative flex flex-col gap-0 bg-white/60 dark:bg-[#0f111a]/80 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[2rem] shadow-2xl overflow-hidden">

          <div className="flex flex-col lg:flex-row w-full">
            {/* Left Side: Image Display */}
            <div className="flex-1 p-5 sm:p-7 lg:p-8 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-white/5">
            <SectionHeader icon={<ImageIcon className="w-5 h-5" />} title="Uploaded Image" />
            <div className="flex-1 min-h-[220px] rounded-2xl bg-white/50 dark:bg-black/20 overflow-hidden flex items-center justify-center p-4 border border-slate-200 dark:border-white/5 shadow-inner">
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
          </div>

          {/* Right Side: Form Area */}
          <div className="flex-1 p-5 sm:p-7 lg:p-8 bg-slate-50/30 dark:bg-black/20 flex flex-col">
            <SectionHeader icon={<Search className="w-5 h-5" />} title="Detected Information" />

            <div className="flex flex-col gap-3 sm:gap-4 mt-3 lg:mt-4 flex-grow">

              <div className="flex justify-between items-center pb-4 sm:pb-5 border-b border-slate-200 dark:border-white/10">
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
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="p-5 sm:p-6 lg:px-8 lg:py-5 border-t border-slate-200 dark:border-white/10 bg-slate-50/40 dark:bg-black/20 flex flex-col sm:flex-row justify-end gap-3 lg:gap-4">
            <Button type="button" variant="outline" onClick={() => router.push('/')} className="w-full sm:w-auto text-sm sm:text-base px-6 py-2.5">
              Back to Upload
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="w-full sm:w-auto text-sm sm:text-base px-8 py-2.5 tracking-wide shadow-indigo-500/25 font-bold"
            >
              {isSubmitting ? 'Finalizing...' : 'Finalize Context'}
            </Button>
          </div>

        </div>

      </div>
    </main>
  );
}
