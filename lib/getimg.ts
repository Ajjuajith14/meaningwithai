let getImgConfigured: boolean | null = null

export function isGetImgConfigured(): boolean {
  if (getImgConfigured === null) {
    getImgConfigured = !!process.env.GETIMG_API_KEY
  }
  return getImgConfigured
}

export async function generateImage(imagePrompt: string): Promise<string> {
  try {
    if (!isGetImgConfigured()) {
      const encodedPrompt = encodeURIComponent(imagePrompt.substring(0, 100))
      return `/placeholder.svg?height=400&width=600&text=${encodedPrompt}`
    }

    const response = await fetch("https://api.getimg.ai/v1/stable-diffusion/text-to-image", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GETIMG_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `${imagePrompt}, cartoon style, educational illustration, bright colors, child-friendly, high quality, digital art`,
        model: "stable-diffusion-v1-5",
        width: 512,
        height: 512,
        steps: 25,
        guidance: 7.5,
        seed: Math.floor(Math.random() * 1000000),
        scheduler: "dpmsolver++",
        output_format: "jpeg",
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`GetImg API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    let imageUrl = null

    if (data.url) {
      imageUrl = data.url
    } else if (data.image) {
      if (data.image.startsWith("data:")) {
        imageUrl = data.image
      } else {
        imageUrl = `data:image/jpeg;base64,${data.image}`
      }
    } else if (data.images && Array.isArray(data.images) && data.images.length > 0) {
      const firstImage = data.images[0]
      if (typeof firstImage === "string") {
        if (firstImage.startsWith("data:")) {
          imageUrl = firstImage
        } else {
          imageUrl = `data:image/jpeg;base64,${firstImage}`
        }
      } else if (firstImage.url) {
        imageUrl = firstImage.url
      }
    }

    if (!imageUrl) {
      throw new Error("No image data found in GetImg response")
    }

    return imageUrl
  } catch (error) {
    const encodedPrompt = encodeURIComponent(imagePrompt.substring(0, 100))
    return `/placeholder.svg?height=400&width=600&text=${encodedPrompt}`
  }
}
