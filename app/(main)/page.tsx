import { Footer } from "@/components/footer";
import { GPSData } from "./_components/GPSData";

const main = () => {
  return (
    <div className="min-h-full flex flex-col dark:bg-[#1F1F1F]">
      <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
        <GPSData />
      </div>
    </div>
  );
};

export default main;
