// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { chatRouter } from "./chat";
import { userRouter } from "./user";

export const appRouter = router({
  chat: chatRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
