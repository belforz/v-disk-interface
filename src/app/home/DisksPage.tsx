import VinylHistoryCard from "@app/components/HistoryVinyl";

export default function HistoryPage() {
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
          title="The History of Vinyl"
          h2_one="Origins"
          text_one={
            <>
              Vinyl records grew from fragile shellac discs and became widely
              adopted after Columbia introduced the LP in 1948. The format
              allowed longer play times and led to album-oriented music
              releases.
            </>
          }
          text_two={
            <>
              During the Golden Era (1950–1980), vinyl dominated music
              distribution—LPs for albums and 45s for singles—while album art
              became culturally significant.
            </>
          }
          target={
            <>
              The arrival of the CD in the 1980s reduced vinyl market share, and
              by the 1990s vinyl became a niche format for collectors and DJs.
            </>
          }
          revival={
            <>
              From the 2000s onward a vinyl revival took place driven by
              collectors, DJs, and listeners seeking analog warmth and a
              tangible music experience.
            </>
          }
        />
      </section>
    </div>
  );
}
