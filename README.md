# 🎨 The Vision

An AI-powered image generator with a sleek, dark-themed interface — built for creators who want stunning visuals from simple text prompts.

---

## ✨ Features

- 🖼️ **Text-to-Image Generation** — Transform prompts into high-quality images using FLUX.1-schnell, with automatic fallback to Pollinations.ai
- 📐 **Aspect Ratio Control** — Choose between `1:1`, `16:9`, and `9:16` formats to fit any use case
- 💾 **One-Click Download** — Hover over any generated image to instantly save it locally
- 🌑 **Dark Aesthetic UI** — Immersive, animated dashboard inspired by professional creative tools
- 📱 **Fully Responsive** — Seamless experience across desktop and mobile
- ⚡ **Fluid Transitions** — Powered by Tailwind CSS and Motion for smooth, interactive animations
- 🔁 **Automatic Fallback** — If the primary model is unavailable, the app seamlessly falls back to Pollinations.ai so generation never stops

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/AditS7/The-Vision.git
cd The-Vision
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables** *(optional but recommended)*

   Create a `.env.local` file in the root directory and add your Hugging Face token:

   ```env
   HF_API_KEY=your_huggingface_token_here
   ```

   > Get your free token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).
   > Without this, the app falls back to Pollinations.ai automatically.

4. **Run the development server**

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser and start generating.

---

## 🚢 Deploying to Vercel

This app is a fully client-side SPA and deploys to Vercel with zero configuration.

1. Push your repo to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Optionally add `HF_API_KEY` under **Environment Variables** in the Vercel dashboard
4. Click **Deploy**

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React / Next.js |
| Primary AI Model | FLUX.1-schnell (`black-forest-labs/FLUX.1-schnell`) |
| Primary AI Provider | [Hugging Face Inference API](https://huggingface.co/inference-api) |
| Fallback AI Provider | [Pollinations.ai](https://pollinations.ai) (free, no key required) |
| Styling | Tailwind CSS |
| Animations | Motion |

---

## 🎯 Usage

1. Type a descriptive prompt in the input field
2. Select your preferred aspect ratio (`1:1`, `16:9`, or `9:16`)
3. Hit **Generate** and watch your vision come to life
4. Hover over the result and click **Download** to save it

---

## 🔁 How the Fallback Works

The app uses **FLUX.1-schnell via Hugging Face** as its primary image generation model — the fastest and highest-quality option. If the Hugging Face API is unavailable (e.g. no key provided, rate limited, or service disruption), the app automatically falls back to **Pollinations.ai**, which requires no configuration and has no usage limits.

| | Hugging Face (Primary) | Pollinations.ai (Fallback) |
|---|---|---|
| API Key Required | Yes (free tier available) | No |
| Model | FLUX.1-schnell | FLUX |
| Speed | Fast | Fast |
| Usage Limits | Free tier limits apply | Unlimited |

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

[MIT](LICENSE)
