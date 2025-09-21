import ArtistCard from "@app/components/ArtistCard";

const mockArtists = [
  {
    id: "1",
    name: "Beyoncé",
    photo:
      "https://upload.wikimedia.org/wikipedia/commons/6/68/Beyonce_-_The_Formation_World_Tour%2C_2016.jpg",
    albums: [
      {
        id: "a1",
        title: "Dangerously in Love",
        year: 2003,
        cover:
          "https://upload.wikimedia.org/wikipedia/en/6/6b/Beyonce_-_Dangerously_in_Love.png",
      },
      {
        id: "a2",
        title: "Renaissance",
        year: 2022,
        cover:
          "https://upload.wikimedia.org/wikipedia/en/6/6e/Beyonc%C3%A9_-_Renaissance.png",
      },
    ],
  },
  {
    id: "2",
    name: "David Bowie",
    photo:
      "https://upload.wikimedia.org/wikipedia/commons/7/77/David-Bowie_Chicago_2002-08-08_photoby_Adam-Bielawski-cropped.jpg",
    albums: [
      {
        id: "a3",
        title: "Heroes",
        year: 1977,
        cover:
          "https://upload.wikimedia.org/wikipedia/en/0/01/David_Bowie_-_Heroes.png",
      },
      {
        id: "a4",
        title: "Blackstar",
        year: 2016,
        cover:
          "https://upload.wikimedia.org/wikipedia/en/9/90/David_Bowie_-_Blackstar.png",
      },
    ],
  },
];

export default function ArtistsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 grid gap-8 md:grid-cols-2">
      {mockArtists.map((artist) => (
        <ArtistCard key={artist.id} artist={artist} />
      ))}
    </main>
  );
}
