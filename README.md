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

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React / Next.js |
| Primary AI Model | FLUX.1-schnell (`black-forest-labs/FLUX.1-schnell`) |
| Primary AI Provider | [Hugging Face Inference API](https://huggingface.co/inference-api) |
| Fallback AI Provider | [Pollinations.ai](https://pollinations.ai) |
| Styling | Tailwind CSS |
| Animations | Motion |

---

## 🎯 Usage

1. Type a descriptive prompt in the input field
2. Select your preferred aspect ratio (`1:1`, `16:9`, or `9:16`)
3. Hit **Generate** and watch your vision come to life
4. Hover over the result and click **Download** to save it

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

[MIT](LICENSE)
