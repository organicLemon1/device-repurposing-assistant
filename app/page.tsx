'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SectionHeader } from "./components/molecules/SectionHeader";
import { FileUploadArea } from "./components/molecules/FileUploadArea";
import { FormField } from "./components/molecules/FormField";
import { Input } from "./components/atoms/Input";
import { Select } from "./components/atoms/Select";
import { TextArea } from "./components/atoms/TextArea";
import { Button } from "./components/atoms/Button";
import { FloatingBackgroundIcons } from "./components/organisms/FloatingBackgroundIcons";

export default function Home() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [condition, setCondition] = useState("working");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      formData.append("brand", brand);
      formData.append("model", model);
      formData.append("condition", condition);
      formData.append("additionalInfo", additionalInfo);

      const response = await fetch('/api/detect-device', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to process device details');

      const data = await response.json();

      let imageBase64 = "";
      if (file) {
        imageBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      sessionStorage.setItem("deviceDetails", JSON.stringify({
        ...data,
        imageBase64
      }));

      router.push('/confirm');

    } catch (err: any) {
      setError(err.message || 'An error occurred during submission.');
    } finally {
      setIsLoading(false);
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
      <div className="absolute top-0 left-[-10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-indigo-500/30 dark:bg-indigo-600/20 blur-[130px] rounded-full animate-pulse mix-blend-multiply dark:mix-blend-screen pointer-events-none transition-all duration-1000 z-0"></div>
      <div className="absolute bottom-[-10%] right-[-20%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-fuchsia-500/15 dark:bg-violet-600/10 blur-[130px] rounded-full animate-pulse mix-blend-multiply dark:mix-blend-screen pointer-events-none transition-all duration-1000 z-0" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[30vw] max-w-[900px] max-h-[400px] bg-blue-400/20 dark:bg-indigo-500/10 blur-[140px] rounded-full pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 lg:px-8">

        {/* Hero Section */}
        <div className="text-center mb-4 lg:mb-5">

          <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight mb-2 leading-tight">
            <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 dark:from-indigo-400 dark:via-violet-400 dark:to-fuchsia-400 drop-shadow-sm">
              Repurpose.
            </span>
            <span className="block sm:inline text-slate-900 dark:text-white sm:ml-2 mt-1 sm:mt-0">Don't Replace.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed hidden sm:block">
            Upload a photo of your old device. Our AI will instantly identify its hardware capabilities and generate brilliant DIY projects to give it a second life.
          </p>
        </div>

        {/* Interactive Glass Panel */}
        <form onSubmit={handleSubmit} className="w-full relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

          <div className="relative flex flex-col lg:flex-row gap-0 bg-white/60 dark:bg-[#0f111a]/80 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[2rem] shadow-2xl overflow-hidden">

            {/* Left Side: Upload Area */}
            <div className="flex-1 p-5 sm:p-7 lg:p-8 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-white/5">
              <SectionHeader
                title="Upload Image"
                subtitle="Upload a clear photo to help the AI detect the exact model automatically."
              />
              <div className="mt-4 lg:mt-5">
                <FileUploadArea onFileChange={setFile} />
              </div>
            </div>

            {/* Right Side: Form Area */}
            <div className="flex-1 p-5 sm:p-7 lg:p-8 bg-slate-50/30 dark:bg-black/20 flex flex-col">
              <SectionHeader
                title="Device Parameters"
                subtitle="Provide extra details to ensure perfect accuracy."
              />

              <div className="flex flex-col gap-3 sm:gap-4 mt-3 lg:mt-4 flex-grow">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField id="brand" label="Brand (Optional)">
                    <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Apple, Dell" />
                  </FormField>
                  <FormField id="model" label="Model (Optional)">
                    <Input id="model" value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. iPhone 11" />
                  </FormField>
                </div>

                <FormField id="condition" label="Current Condition">
                  <Select
                    id="condition"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    options={[
                      { label: "Working Perfectly", value: "working" },
                      { label: "Partially Working", value: "partially-working" },
                      { label: "Not Working / Broken", value: "not-working" },
                      { label: "Unknown Condition", value: "unknown" }
                    ]}
                  />
                </FormField>

                <FormField id="additional-info" label="Additional Context (Optional)">
                  <TextArea id="additional-info" value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} placeholder="E.g., cracked screen, battery swollen..." />
                </FormField>

                {error && (
                  <div className="p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-semibold border border-rose-200 dark:border-rose-500/30 shadow-inner">
                    {error}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 sm:mt-5 sm:pt-5 border-t border-slate-200 dark:border-white/10 flex justify-end">
                <Button type="submit" variant="primary" className="w-full sm:w-auto text-base sm:text-lg px-6 py-3 tracking-wide shadow-indigo-500/25" disabled={isLoading}>
                  {isLoading ? 'Analyzing Hardware...' : 'Discover Projects'} <span className="ml-2">→</span>
                </Button>
              </div>

            </div>
          </div>
        </form>

      </div>
    </main>
  );
}
