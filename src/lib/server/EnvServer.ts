import { Envs } from "@/types/Envs";

export class EnvServer {
  static env: Envs;
  static init(env: Envs) {
    this.env = env;
  }
}