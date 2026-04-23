# IoT Temperature & Humidity Dashboard

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open the URL shown in terminal (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview
```

## Data sources

- Firebase Realtime Database (`TempnHumData/*`, `analytics/*`)
- CSV dataset (`public/lpg_edge_ai_dataset_1000_correlated.csv`)
