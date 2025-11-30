import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const score = searchParams.get("score") || "0";

  return new ImageResponse(
    {
      type: "div",
      props: {
        style: {
          width: "1200px",
          height: "630px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
          color: "#ffffff",
          fontFamily: "Arial",
        },
        children: [
          {
            type: "div",
            props: {
              style: { textAlign: "center" },
              children: [
                {
                  type: "div",
                  props: {
                    style: { fontSize: "140px", fontWeight: "bold" },
                    children: score,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: { fontSize: "40px", marginTop: "20px" },
                    children: "Can you beat my score?",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
    }
  );
}
