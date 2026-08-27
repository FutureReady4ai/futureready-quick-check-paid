# FutureReady Quick Check — Paid Tier ($6)

A professional, free-to-use AI career consultant with a 15-minute session timer.

## Features

- ⚡ **Quick Check**: 15-minute focused career consultation
- 🤖 **Powered by Google Gemini**: Real-time labor market insights
- 🧠 **5 C's Framework**: Curiosity, Courage, Creativity, Compassion, Communication
- 📊 **Data-Driven**: AI disruption analysis, salary ranges, demand signals
- 💳 **$6 Value**: Professional-grade career advice

## Environment Variables

- `GEMINI_API_KEY` — Your free Google Gemini API key from [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

## Deployment

```bash
vercel deploy
```

## Embed on Your Website

```html
<iframe 
  src="https://your-domain.vercel.app" 
  width="100%" height="800" frameborder="0"
  style="border:none; border-radius:16px; max-width:1100px; 
         display:block; margin:0 auto; 
         box-shadow:0 12px 40px rgba(0,0,0,0.15);"
  allow="clipboard-write"
  title="FutureReady AI Quick Check">
</iframe>
```

## Files

- `index.html` — Frontend chat interface
- `api/chat.js` — Gemini API backend
- `vercel.json` — Vercel configuration
- `package.json` — Node dependencies

Free to use, 100% Gemini-powered. No activation keys required.
