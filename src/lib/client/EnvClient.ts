"use client";
import { Envs } from "@/types/Envs";
export class EnvClient {
  static env: Envs;
  static init(env: Envs) {
    this.env = env;
  }
}

export function EnvClientProvider({ env }: { env: string }) {
  try {
    const jsonEnv = JSON.parse(env)
    EnvClient.init(jsonEnv);
  } catch (error) {
    console.log(error);
  }
  return null;
}