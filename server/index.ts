import Fastify from "fastify";
import cors from "@fastify/cors";

const app = Fastify({ logger: false });
await app.register(cors, { origin: true });

type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  images: string[];
  caption?: string;
};

const products: Product[] = [
  {
    id: "1",
    slug: "beyonce-x-levis-90s-shrunken-trucker-western-crystal",
    name: "BEYONCÉ X LEVI’S® 90s SHRUNKEN TRUCKER WESTERN CRYSTAL",
    price: 250,
    images: ["/images/jacket-western-crystal.png"]
  },
  {
    id: "2",
    slug: "beyonce-x-levis-90s-shrunken-trucker-laced-up",
    name: "BEYONCÉ X LEVI’S® 90s SHRUNKEN TRUCKER LACED UP",
    price: 230,
    images: ["/images/jacket-laced.png"]
  },
  {
    id: "3",
    slug: "beyonce-x-levis-501-curve-western-crystal",
    name: "BEYONCÉ X LEVI’S® 501® CURVE WESTERN CRYSTAL",
    price: 150,
    images: ["/images/jeans-curve.png"]
  }
];

app.get("/api/products", async () => products);

app.get("/api/products/:slug", async (req, reply) => {
  const { slug } = req.params as { slug: string };
  const found = products.find(p => p.slug === slug);
  if (!found) return reply.code(404).send({ message: "Product not found" });
  return found;
});

const port = Number(process.env.PORT || 3333);
app.listen({ port }).then(() => {
  console.log(`Mock API on http://localhost:${port}`);
});
