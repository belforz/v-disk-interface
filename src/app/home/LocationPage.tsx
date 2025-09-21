import React from "react";
import VinylHistoryCard from "@app/components/HistoryVinyl";

export const LocationPage = () => {
  return (
    <div>
      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col items-center">
          <img
            src="/images/v-disk-caption.png"
            className="w-full max-w-[200px] sm:max-w-[260px] md:max-w-[320px] lg:max-w-[400px] aspect-square object-cover"
            loading="lazy"
            alt="v-disk admin"
          />
          </div>
          <VinylHistoryCard
            title="V-Disk Localization"
            h2_one="Address"
            text_one={<>467 Frei João Street, São Paulo, SP</>}
            onlyProvided
          />
      </section>
    </div>
  );
};
