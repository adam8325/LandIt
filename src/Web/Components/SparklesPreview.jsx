"use client";
import React from "react";
import { SparklesCore } from "../components/sparkles";

export default function SparklesPreview() {
  return (
    <div
      className="h-[20rem] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
      <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white relative z-20">
        Land
        <span className="
          bg-gradient-to-r 
          from-gray-200 via-blue-300 via-blue-400 to-blue-700 
          bg-clip-text text-transparent
          [text-shadow:_1px_1px_2px_rgba(0,0,0,0.3)]
        ">
          It
        </span>

      </h1>

      <div className="w-[40rem] h-40 relative">
        {/* Gradients */}
        <div
          className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div
          className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div
          className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div
          className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="#FFFFFF" 
          speed={.3} />

        {/* Radial Gradient to prevent sharp edges */}
        <div
          className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>
    </div>
  );
}
