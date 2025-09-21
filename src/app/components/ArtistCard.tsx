import { ReactNode } from "react";

type Album = {
  id: string;
  title: string;
  year: number;
  cover: string;
};

type Artist = {
  id: string;
  name: string;
  photo: string;
  albums: Album[];
};

type Props = {
  artist: Artist;
};

export default function ArtistCard({ artist }: Props) {
  return (
    <div className="border border-white/10 bg-black/60 p-4 space-y-4">
      {/* Foto do artista */}
      <div className="w-full aspect-square overflow-hidden">
        <img
          src={artist.photo}
          alt={artist.name}
          className="w-full h-full object-cover object-center hover:scale-105 transition"
        />
      </div>

      <h2 className="text-lg font-semibold tracking-wide">{artist.name}</h2>

      {/* Discos */}
      <div className="grid sm:grid-cols-2 gap-4">
        {artist.albums.map((album) => (
          <div
            key={album.id}
            className="border border-white/10 bg-neutral-900 p-2 flex flex-col"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={album.cover}
                alt={album.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="mt-2 text-sm">
              <p>{album.title}</p>
              <span className="text-xs text-white/60">{album.year}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
