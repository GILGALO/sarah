import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const signals = pgTable("signals", {
  id: serial("id").primaryKey(),
  pair: text("pair").notNull(), // e.g., "AUD/JPY"
  action: text("action").notNull(), // "BUY/CALL" or "SELL/PUT"
  confidence: integer("confidence").notNull(), // 0-100
  startTime: text("start_time").notNull(), // e.g. "15:00 EAT"
  endTime: text("end_time").notNull(), // e.g. "15:05 EAT"
  status: text("status").notNull().default("active"), // "active", "completed"
  analysis: text("analysis").notNull(), // Reason for the signal
  createdAt: timestamp("created_at").defaultNow(),
});

export const marketData = pgTable("market_data", {
  id: serial("id").primaryKey(),
  pair: text("pair").notNull(),
  price: text("price").notNull(),
  change: text("change").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// === SCHEMAS ===
export const insertSignalSchema = createInsertSchema(signals).omit({ id: true, createdAt: true });

// === EXPLICIT API TYPES ===
export type Signal = typeof signals.$inferSelect;
export type InsertSignal = z.infer<typeof insertSignalSchema>;

export type SignalResponse = Signal;

// For generating signals
export type GenerateSignalRequest = {
  pair: string;
};
