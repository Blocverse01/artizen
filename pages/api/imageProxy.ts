import { withImageProxy } from "@blazity/next-image-proxy";

export const config = {
  api: {
    responseLimit: "20mb",
  },
};

export default withImageProxy({
  whitelistedPatterns: [/^https?:\/\/(.*).ipfs.w3s.link/],
});
