import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Seed test user
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      clerkId: "test_clerk_id_123",
      email: "test@example.com",
      username: "testuser",
      imageUrl: null,
    },
  });

  // Seed communities
  const communities = await Promise.all([
    prisma.community.upsert({
      where: { slug: "nextjs" },
      update: {},
      create: { name: "nextjs", slug: "nextjs", description: "A community for Next.js developers" },
    }),
    prisma.community.upsert({
      where: { slug: "programming" },
      update: {},
      create: { name: "programming", slug: "programming", description: "General programming discussions" },
    }),
    prisma.community.upsert({
      where: { slug: "webdev" },
      update: {},
      create: { name: "webdev", slug: "webdev", description: "Web development community" },
    }),
  ]);

  // Seed posts
  await Promise.all([
    prisma.post.upsert({
      where: { id: "seed-post-1" },
      update: {},
      create: {
        id: "seed-post-1",
        title: "Welcome to Next.js community!",
        content: "This is a test post for the Next.js community.",
        type: "text",
        communityId: communities[0].id,
        authorId: user.id,
      },
    }),
    prisma.post.upsert({
      where: { id: "seed-post-2" },
      update: {},
      create: {
        id: "seed-post-2",
        title: "Best programming practices in 2024",
        content: "Let's discuss best practices for modern programming.",
        type: "text",
        communityId: communities[1].id,
        authorId: user.id,
      },
    }),
  ]);

  console.log("✅ Seed data created successfully!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
