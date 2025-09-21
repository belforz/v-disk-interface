import type { ReactNode } from 'react';

interface VinylHistoryCardProps {
  title?: ReactNode;
  text_one?: ReactNode;
  text_two?: ReactNode;
  target?: ReactNode;
  revival?: ReactNode;
  li?: ReactNode;
  h2_one?: ReactNode;
  // When true, render only the sections for which props are provided
  onlyProvided?: boolean;
}

export default function VinylHistoryCard(props: VinylHistoryCardProps) {
  const defaultTitle = "The History of Vinyl";
  const defaultH2 = props.h2_one ?? "Origins";

  const defaultTextOne = (
    <>Vinyl records emerged as an evolution of shellac discs, which spun at 78 RPM and were fragile. In 1948, Columbia Records introduced the LP (Long Play) on vinyl at 33⅓ RPM, allowing over 20 minutes of music per side. Shortly after, RCA Victor launched the 45 RPM single, focused on individual tracks.</>
  );

  const defaultTextTwo = (
    <>Throughout these decades, vinyl became the primary format for music consumption. LPs were used for full albums, while 45s carried singles. Album covers evolved into a form of cultural and artistic expression, symbolizing movements like rock, soul, funk, and pop music.</>
  );

  const defaultTarget = (
    <>In the 1980s, with the arrival of the CD, vinyl lost market share. CDs offered portability, durability, and the ability to skip tracks. By the 1990s, vinyl had become a niche for collectors and DJs, but it never fully disappeared.</>
  );

  const defaultRevival = (
    <>Starting in the 2000s, vinyl began to resurge. The “vinyl revival” was fueled by the search for analog sound warmth, the physical experience of large covers and inserts, and cultural nostalgia. Today, many artists release albums both on streaming platforms and vinyl.</>
  );

  const only = Boolean(props.onlyProvided);

  return (
    <div className="max-w-4xl mx-auto border border-white/10 bg-black/60 p-6 md:p-10 space-y-6">
      <h1 className="font-display text-2xl md:text-3xl uppercase tracking-wider">
        {props.title ?? defaultTitle}
      </h1>

      {/* Origins */}
      {(!only) || props.text_one ? (
        <section className="space-y-3 text-sm leading-relaxed text-white/80">
          <h2 className="text-base font-semibold">{props.h2_one ?? defaultH2}</h2>
          <p>{props.text_one ?? defaultTextOne}</p>
        </section>
      ) : null}

      {/* Golden Era */}
      {(!only) || props.text_two ? (
        <section className="space-y-3 text-sm leading-relaxed text-white/80">
          <h2 className="text-base font-semibold">Golden Era (1950–1980)</h2>
          <p>{props.text_two ?? defaultTextTwo}</p>
        </section>
      ) : null}

      {/* Decline */}
      {(!only) || props.target ? (
        <section className="space-y-3 text-sm leading-relaxed text-white/80">
          <h2 className="text-base font-semibold">Decline</h2>
          <p>{props.target ?? defaultTarget}</p>
        </section>
      ) : null}

      {/* Revival */}
      {(!only) || props.revival ? (
        <section className="space-y-3 text-sm leading-relaxed text-white/80">
          <h2 className="text-base font-semibold">Revival</h2>
          <p>{props.revival ?? defaultRevival}</p>
        </section>
      ) : null}

      {/* Fun Facts */}
      {(!only) || props.li ? (
        <section className="space-y-3 text-sm leading-relaxed text-white/80">
          <h2 className="text-base font-semibold">Fun Facts</h2>
          <ul className="list-disc list-inside space-y-1">
            {props.li}
            <li>Vinyl is analog, while CDs and streaming are digital.</li>
            <li>DJs popularized techniques such as scratching and beatmatching.</li>
            <li>
              Many pressing plants closed in the 1990s but reopened during the
              vinyl revival.
            </li>
          </ul>
        </section>
      ) : null}
    </div>
  );
}
