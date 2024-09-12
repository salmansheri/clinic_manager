import { GetStarted } from "@/components/get-started";
import { WavyBackground } from "@/components/wavy-background";
import Image from "next/image";

export default function Home() {
  return (
    <WavyBackground>
      <div className="flex items-center justify-center h-full w-full px-10 md:px-20 lg:px-36">
        <div className="flex-1 space-y-6">
          <h1 className="text-2xl md:text-3xl lg:text-5xl">
            Your All in one Solution for Clinic Management
          </h1>

          <GetStarted />
        </div>
        <div className="hidden lg:flex flex-1 w-full h-full relative">
          <Image
            src="/remove-bg-doctor.png"
            alt="doctor"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </WavyBackground>
  );
}
