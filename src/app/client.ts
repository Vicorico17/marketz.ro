import { createThirdwebClient } from "thirdweb";

const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID || "mock-client-id";

export const client = createThirdwebClient({
  clientId: clientId,
});
