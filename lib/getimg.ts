const GETIMG_KEY = process.env.GETIMG_API_KEY;
const GETIMG_URL = "https://api.getimg.ai/v1/stable-diffusion-xl/text-to-image";
const MODEL_ID = "real-cartoon-xl-v6";

const NEGATIVE_PROMPT = [
  "dark",
  "scary",
  "violent",
  "inappropriate",
  "complex",
  "realistic",
  "adult content",
].join(", ");

export async function generateImage(imagePrompt: string): Promise<string> {
  if (!GETIMG_KEY) {
    return placeholderURL(imagePrompt);
  }

  const payload = {
    model: MODEL_ID,
    prompt: `${imagePrompt}, cartoon style, educational illustration, bright colors, child-friendly, high quality, digital art`,
    negative_prompt: NEGATIVE_PROMPT,
    width: 512,
    height: 512,
    steps: 25,
    guidance: 7.5,
    response_format: "b64",
    samples: 1,
  };

  try {
    const response = await fetch(GETIMG_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GETIMG_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GetImg API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    let imageUrl = "";

    if (data.url) {
      imageUrl = data.url;
    } else if (data.image) {
      imageUrl = data.image.startsWith("data:")
        ? data.image
        : `data:image/png;base64,${data.image}`;
    } else if (
      data.images &&
      Array.isArray(data.images) &&
      data.images.length > 0
    ) {
      const firstImage = data.images[0];
      if (typeof firstImage === "string") {
        imageUrl = firstImage.startsWith("data:")
          ? firstImage
          : `data:image/png;base64,${firstImage}`;
      } else if (firstImage.url) {
        imageUrl = firstImage.url;
      }
    }

    if (!imageUrl) {
      throw new Error("No image data received from GetImg.ai");
    }

    return imageUrl;
  } catch (error) {
    return placeholderURL(imagePrompt);
  }
}

function placeholderURL(text: string) {
  return `/placeholder.svg?height=512&width=512&text=${encodeURIComponent(
    text.substring(0, 50)
  )}`;
}
