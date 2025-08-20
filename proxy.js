import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const API_BASE = 'https://api.sportmonks.com/v3/football';
const API_TOKEN = 'YnaD6WT4Rs1Bvpei2GH7LOGcX6gKXUUx1YKAH2NNOzuSIoL7HPDp3cOUiHdS';

const app = express();
app.use(cors());

app.get(/^\/api\/(.*)/, async (req, res) => {
  const apiPath = req.params[0] ? `/${req.params[0]}` : '';
  const url = `${API_BASE}${apiPath}${req.url.includes('?') ? '&' : '?'}api_token=${API_TOKEN}`;
  try {
    const apiRes = await fetch(url);
    const data = await apiRes.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Proxy running on http://localhost:${PORT}`));
