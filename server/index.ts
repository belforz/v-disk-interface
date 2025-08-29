import Fastify from "fastify";
import cors from "@fastify/cors";

const app = Fastify({ logger: false });
await app.register(cors, { origin: true });

type Vinyl = {
  id: string;
  slug: string;
  title: string;
  artist: string;
  price: number;
  stock: number;
  coverPath: string;
  gallery: string[];
  createdAt: string;
  updatedAt: string;
};

const vinyls: Vinyl[] = [
  {
    id: "1",
    slug: "beyonce-x-levis-90s-shrunken-trucker-western-crystal",
    title: "BEYONCÉ X LEVI’S® 90s SHRUNKEN TRUCKER WESTERN CRYSTAL",
    artist: "Beyoncé",
    price: 250,
    stock: 10,
    coverPath: "/images/jacket-western-crystal.png",
    gallery: ["/images/jacket-western-crystal.png"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    slug: "beyonce-x-levis-90s-shrunken-trucker-laced-up",
    title: "BEYONCÉ X LEVI’S® 90s SHRUNKEN TRUCKER LACED UP",
    artist: "Beyoncé",
    price: 230,
    stock: 8,
    coverPath: "/images/jacket-laced.png",
    gallery: ["/images/jacket-laced.png"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    slug: "beyonce-x-levis-501-curve-western-crystal",
    title: "BEYONCÉ X LEVI’S® 501® CURVE WESTERN CRYSTAL",
    artist: "Beyoncé",
    price: 150,
    stock: 5,
    coverPath: "/images/jeans-curve.png",
    gallery: ["/images/jeans-curve.png"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

app.get("/api/products", async () => vinyls);

app.get("/api/products/:slug", async (req, reply) => {
  const { slug } = req.params as { slug: string };
  const found = vinyls.find(v => v.slug === slug);
  if (!found) return reply.code(404).send({ message: "Product not found" });
  return found;
});

const port = Number(process.env.PORT || 3333);
app.listen({ port }).then(() => {
  console.log(`Mock API on http://localhost:${port}`);
});
