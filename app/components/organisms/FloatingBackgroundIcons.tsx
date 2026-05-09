import React from 'react';
import { Cpu, Zap, Microscope, Hexagon } from 'lucide-react';

export function FloatingBackgroundIcons() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none hidden lg:block">
      
      {/* Top Left Accent */}
      <div className="absolute top-[15%] left-[8%] animate-[pulse_6s_ease-in-out_infinite]">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/10 blur-2xl rounded-full scale-150"></div>
          <Cpu className="w-32 h-32 text-indigo-500/20 dark:text-indigo-400/10 rotate-12" strokeWidth={0.5} />
        </div>
      </div>

      {/* Bottom Left Accent */}
      <div className="absolute bottom-[15%] left-[5%] animate-[pulse_8s_ease-in-out_infinite_1s]">
        <div className="relative">
          <div className="absolute inset-0 bg-fuchsia-500/10 blur-2xl rounded-full scale-150"></div>
          <Hexagon className="w-40 h-40 text-fuchsia-500/20 dark:text-fuchsia-400/10 -rotate-12" strokeWidth={0.5} />
        </div>
      </div>

      {/* Top Right Accent */}
      <div className="absolute top-[20%] right-[8%] animate-[pulse_7s_ease-in-out_infinite_2s]">
        <div className="relative">
          <div className="absolute inset-0 bg-violet-500/10 blur-2xl rounded-full scale-150"></div>
          <Zap className="w-24 h-24 text-violet-500/20 dark:text-violet-400/10 rotate-45" strokeWidth={0.5} />
        </div>
      </div>

      {/* Bottom Right Accent */}
      <div className="absolute bottom-[20%] right-[10%] animate-[pulse_9s_ease-in-out_infinite_0.5s]">
        <div className="relative">
           <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full scale-150"></div>
           <Microscope className="w-36 h-36 text-blue-500/20 dark:text-blue-400/10 -rotate-6" strokeWidth={0.5} />
        </div>
      </div>

    </div>
  );
}
