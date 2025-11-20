import { Skeleton } from "@/components/ui/skeleton";

export function LoadingGlobe() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="relative mx-auto h-64 w-64 md:h-96 md:w-96">
          <Skeleton className="absolute inset-0 rounded-full bg-gray-800" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-48 w-48 md:h-72 md:w-72 animate-pulse rounded-full bg-gray-700/50" />
          </div>
        </div>
        <p className="mt-8 text-lg text-gray-400 animate-pulse">Loading Globe...</p>
      </div>
    </div>
  );
}