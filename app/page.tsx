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

      const response = await fetch('https://device-rag-backend.onrender.com/api/detect-device', {
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
    <main className="w-full h-full p-3 sm:p-4 lg:p-6 font-sans selection:bg-indigo-100 selection:text-indigo-900 dark:selection:bg-indigo-900/50 dark:selection:text-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-5 lg:mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            Device Repurposing Assistant
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Upload your old device and discover brilliant AI-generated DIY reuse ideas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">

          <section className="flex flex-col bg-white dark:bg-[#16181e] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none rounded-2xl p-4 sm:p-5">
            <SectionHeader
              icon="📸"
              title="Upload Image"
              subtitle="Help the AI identify your specific device model."
            />
            <div className="mt-2 text-slate-700 dark:text-slate-300">
              <FileUploadArea onFileChange={setFile} />
            </div>
          </section>

          <section className="flex flex-col bg-white dark:bg-[#16181e] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none rounded-2xl p-4 sm:p-5">
            <SectionHeader
              icon="📝"
              title="Device Parameters"
              subtitle="Manually confirm details to ensure accurate search results."
            />

            <div className="flex flex-col gap-1 mt-2">
              <FormField id="brand" label="Device Brand">
                <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Apple, Dell, Samsung" />
              </FormField>

              <FormField id="model" label="Device Model">
                <Input id="model" value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. iPhone 8, Inspiron 3542" />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField id="condition" label="Condition">
                  <Select
                    id="condition"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    options={[
                      { label: "Working", value: "working" },
                      { label: "Partially Working", value: "partially-working" },
                      { label: "Not Working", value: "not-working" },
                      { label: "Unknown", value: "unknown" }
                    ]}
                  />
                </FormField>
              </div>

              <FormField id="additional-info" label="Additional Context (Optional)">
                <TextArea id="additional-info" value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} placeholder="Any cracked screens, missing battery, broken ports?" />
              </FormField>

              {error && <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-lg text-sm font-medium border border-rose-200 dark:border-rose-900/50">{error}</div>}

              <div className="mt-3 flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button type="submit" variant="primary" className="px-8 py-2.5 gap-2 text-base w-full sm:w-auto" disabled={isLoading}>
                  {isLoading ? 'Processing...' : 'Continue'} <span>→</span>
                </Button>
              </div>
            </div>
          </section>

        </form>
      </div>
    </main>
  );
}
