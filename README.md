🎨 The Vision
An AI-powered image generator with a sleek, dark-themed interface — built for creators who want stunning visuals from simple text prompts.

✨ Features

🖼️ Text-to-Image Generation — Transform prompts into high-quality images using FLUX.1-schnell, with automatic fallback to Pollinations.ai
📐 Aspect Ratio Control — Choose between 1:1, 16:9, and 9:16 formats to fit any use case
💾 One-Click Download — Hover over any generated image to instantly save it locally
🌑 Dark Aesthetic UI — Immersive, animated dashboard inspired by professional creative tools
📱 Fully Responsive — Seamless experience across desktop and mobile
⚡ Fluid Transitions — Powered by Tailwind CSS and Motion for smooth, interactive animations
🔁 Automatic Fallback — If the primary model is unavailable, the app seamlessly falls back to Pollinations.ai so generation never stops


🚀 Getting Started
Prerequisites

Node.js (v18 or higher recommended)

Installation

Clone the repository

bashgit clone https://github.com/AditS7/The-Vision.git
cd The-Vision

Install dependencies

bashnpm install

Set up environment variables (optional but recommended)
Create a .env.local file in the root directory and add your Hugging Face token:

env   HF_API_KEY=your_huggingface_token_here

Get your free token at huggingface.co/settings/tokens.
Without this, the app falls back to Pollinations.ai automatically.


Run the development server

bashnpm run dev

Open http://localhost:3000 in your browser and start generating.


🚢 Deploying to Vercel
This app is a fully client-side SPA and deploys to Vercel with zero configuration.

Push your repo to GitHub
Import the project at vercel.com/new
Optionally add HF_API_KEY under Environment Variables in the Vercel dashboard
Click Deploy


🛠️ Tech Stack
LayerTechnologyFrameworkReact / Next.jsPrimary AI ModelFLUX.1-schnell (black-forest-labs/FLUX.1-schnell)Primary AI ProviderHugging Face Inference APIFallback AI ProviderPollinations.ai (free, no key required)StylingTailwind CSSAnimationsMotion

🎯 Usage

Type a descriptive prompt in the input field
Select your preferred aspect ratio (1:1, 16:9, or 9:16)
Hit Generate and watch your vision come to life
Hover over the result and click Download to save it


🔁 How the Fallback Works
The app uses FLUX.1-schnell via Hugging Face as its primary image generation model — the fastest and highest-quality option. If the Hugging Face API is unavailable (e.g. no key provided, rate limited, or service disruption), the app automatically falls back to Pollinations.ai, which requires no configuration and has no usage limits.
Hugging Face (Primary)Pollinations.ai (Fallback)API Key RequiredYes (free tier available)NoModelFLUX.1-schnellFLUXSpeedFastFastUsage LimitsFree tier limits applyUnlimited

🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

📄 License
MIT
