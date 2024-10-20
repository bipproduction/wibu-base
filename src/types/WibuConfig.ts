import { WibuConfigVariant } from "./WibuConfigVariant";

export type WibuConfig = {
    variant: WibuConfigVariant;
    publicRoutes: string[];
    matcher: string[];
  };