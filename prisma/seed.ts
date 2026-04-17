// prisma/seed.ts
// Run with: npm run db:seed

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ── Admin user ────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("prosignprotection", 12);

  await prisma.user.upsert({
    where: { email: "admin@prosign.com" },
    update: {},
    create: {
      email: "admin@prosign.com",
      name: "PRO SIGN Admin",
      role: "ADMIN",
      password: hashedPassword,
    },
  });

  console.log("✅ Admin created");

  // ── Branches ──────────────────────────────────────────────────────────────
  const branches = await Promise.all([
    prisma.branch.upsert({
      where: { id: "branch_prosign_1" },
      update: {},
      create: {
        id: "branch_prosign_1",
        name: "PRO SIGN — New Cairo",
        address: "Industrial Area, New Cairo, Egypt",
      },
    }),
    prisma.branch.upsert({
      where: { id: "branch_prosign_2" },
      update: {},
      create: {
        id: "branch_prosign_2",
        name: "PRO SIGN — Sheikh Zayed",
        address: "Sheikh Zayed City, Giza, Egypt",
      },
    }),
  ]);

  console.log(`✅ ${branches.length} branches seeded`);

  // ── Services ──────────────────────────────────────────────────────────────
  const services = await Promise.all([
    prisma.service.upsert({
      where: { id: "svc_ppf" },
      update: {},
      create: {
        id: "svc_ppf",
        name: "Paint Protection Film (PPF)",
        description:
          "Transparent self-healing film that protects your car from scratches, chips, and road damage.",
        basePrice: 15000,
      },
    }),
    prisma.service.upsert({
      where: { id: "svc_ceramic" },
      update: {},
      create: {
        id: "svc_ceramic",
        name: "Nano Ceramic Coating",
        description:
          "Advanced coating that enhances gloss and protects against UV rays, dirt, and chemicals.",
        basePrice: 8000,
      },
    }),
    prisma.service.upsert({
      where: { id: "svc_window" },
      update: {},
      create: {
        id: "svc_window",
        name: "3M Window Film",
        description:
          "Heat rejection films that block UV rays and improve driving comfort.",
        basePrice: 5000,
      },
    }),
    prisma.service.upsert({
      where: { id: "svc_interior" },
      update: {},
      create: {
        id: "svc_interior",
        name: "Interior Protection",
        description:
          "Protect interior surfaces from wear, stains, and daily damage.",
        basePrice: 3000,
      },
    }),
  ]);

  console.log(`✅ ${services.length} services seeded`);

  // ── Slots — 10 per branch, skip Fri (5) + Sat (6) ────────────────────────
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function generateSlots(branchId: string) {
    const slots = [];
    let added = 0;
    let offset = 1;
    while (added < 10) {
      const d = new Date(today);
      d.setDate(today.getDate() + offset);
      if (![5, 6].includes(d.getDay())) {
        slots.push({ branchId, date: d, isBooked: false });
        added++;
      }
      offset++;
    }
    return slots;
  }

  await prisma.availableSlot.deleteMany({ where: { isBooked: false } });

  const allSlots = [
    ...generateSlots("branch_prosign_1"),
    ...generateSlots("branch_prosign_2"),
  ];

  await prisma.availableSlot.createMany({ data: allSlots });

  console.log(`✅ ${allSlots.length} slots seeded`);
  console.log("🎉 Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
