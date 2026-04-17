import type { DefaultJWT } from "@auth/core/jwt";
import type { DefaultSession } from "@auth/core/types";

declare module "@auth/core/types" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
  }
}
