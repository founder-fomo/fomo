import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middleware/auth";

export const eventsRouter = Router();

// Dev seed: create N random events near provided lat/lng
eventsRouter.post("/seed", async (req, res, next) => {
  try {
    const { lat = 37.7749, lng = -122.4194, n = 8 } = req.body || {};
    const created = [] as any[];
    for (let i = 0; i < Number(n); i++) {
      const jitterLat = Number(lat) + (Math.random() - 0.5) * 0.05;
      const jitterLng = Number(lng) + (Math.random() - 0.5) * 0.05;
      const title = `Demo ${i + 1}`;
      const startAt = new Date(Date.now() + (i + 1) * 60 * 60 * 1000);
      const ev = await prisma.event.create({
        data: { title, lat: jitterLat, lng: jitterLng, startAt, hostId: (req as any).userId || "seed-host", category: "General" }
      });
      created.push(ev);
    }
    res.json({ created });
  } catch (err) {
    next(err);
  }
});

const createEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  lat: z.number(),
  lng: z.number(),
  startAt: z.preprocess((v) => (typeof v === "number" || typeof v === "string" ? new Date(v) : v), z.date())
});

eventsRouter.post("/", authMiddleware, async (req, res, next) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const payload = createEventSchema.parse(req.body);
    const event = await prisma.event.create({
      data: {
        title: payload.title.trim(),
        description: payload.description || undefined,
        category: payload.category || undefined,
        lat: payload.lat,
        lng: payload.lng,
        startAt: payload.startAt,
        hostId: req.userId
      }
    });
    res.status(201).json({ event });
  } catch (err) {
    next(err);
  }
});

const nearbyQuerySchema = z.object({
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  miles: z.coerce.number().default(15)
});

eventsRouter.get("/nearby", async (req, res, next) => {
  try {
    const { lat, lng, miles } = nearbyQuerySchema.parse(req.query);
    // rough bounding box filter (~69 miles per degree latitude)
    const latDelta = miles / 69;
    const lngDelta = miles / (Math.cos((lat * Math.PI) / 180) * 69);

    const approx = await prisma.event.findMany({
      where: {
        lat: { gte: lat - latDelta, lte: lat + latDelta },
        lng: { gte: lng - lngDelta, lte: lng + lngDelta }
      },
      orderBy: { startAt: "asc" }
    });

    const results = approx
      .map((e) => ({ e, d: distanceInMeters(lat, lng, e.lat, e.lng) }))
      .filter(({ d }) => d <= miles * 1609.34)
      .map(({ e }) => e);

    res.json({ events: results });
  } catch (err) {
    next(err);
  }
});

eventsRouter.post("/:id/rsvp", authMiddleware, async (req, res, next) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const eventId = req.params.id;
    const existing = await prisma.rsvp.findUnique({ where: { eventId_userId: { eventId, userId: req.userId } } });
    if (existing) {
      await prisma.rsvp.delete({ where: { id: existing.id } });
      res.json({ rsvped: false });
      return;
    }
    await prisma.rsvp.create({ data: { eventId, userId: req.userId } });
    res.json({ rsvped: true });
  } catch (err) {
    next(err);
  }
});

function distanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}


