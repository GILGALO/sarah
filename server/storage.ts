import { db } from "./db";
import { signals, type InsertSignal, type Signal } from "@shared/schema";
import { desc, eq } from "drizzle-orm";

export interface IStorage {
  getSignals(): Promise<Signal[]>;
  createSignal(signal: InsertSignal): Promise<Signal>;
  getLatestSignal(): Promise<Signal | undefined>;
  clearSignals(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getSignals(): Promise<Signal[]> {
    return await db.select().from(signals).orderBy(desc(signals.createdAt));
  }

  async createSignal(insertSignal: InsertSignal): Promise<Signal> {
    const [signal] = await db.insert(signals).values(insertSignal).returning();
    return signal;
  }

  async getLatestSignal(): Promise<Signal | undefined> {
    const [signal] = await db.select().from(signals).orderBy(desc(signals.createdAt)).limit(1);
    return signal;
  }

  async clearSignals(): Promise<void> {
    await db.delete(signals);
  }
}

export const storage = new DatabaseStorage();
