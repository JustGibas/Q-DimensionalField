import { serve } from "https://deno.land/std@0.167.0/http/server.ts";

export default serve((req) => {
  return new Response("Hello from Deno!", {
    headers: { "Content-Type": "text/plain" },
  });
});
