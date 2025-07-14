import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { getRedditToken } from './getRedditToken.js';

const app = express();
app.use(cors()); // Allow all origins for development

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
  console.log('Client ID set:', !!process.env.REDDIT_SERGIO_CLIENT_ID);
  console.log('Secret set:', !!process.env.REDDIT_SERGIO_SECRET);
});

app.get('/api/reddit-token', async (req, res) => {
  const credentials = Buffer.from(
    `${process.env.REDDIT_SERGIO_CLIENT_ID}:${process.env.REDDIT_SERGIO_SECRET}`
  ).toString('base64');

  try {
    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'sergio-client/0.1 by SergioTom',
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Failed to fetch Reddit token', details: error.message });
  }
});

app.post('/api/search-subreddits', async (req, res) => {
  try {
    console.log('Received POST /api/search-subreddits', req.body);
    const { query } = req.body;
    const token = await getRedditToken(); // Your existing function

    // Reddit API endpoint and parameters
    const redditResponse = await fetch(
      'https://oauth.reddit.com/api/search_reddit_names',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query, // required
          include_over_18: true, // optional, see below
          exact: false, // optional, see below
          include_unadvertisable: false, // optional
        }),
      }
    );

    if (!redditResponse.ok) {
      const errorText = await redditResponse.text();
      console.log('Reddit API error:', redditResponse.status, errorText);
      return res.status(redditResponse.status).send(errorText);
    }

    const data = await redditResponse.json();
    console.log('Reddit API response data:', data);
    res.json({ names: data.names || [] });
  } catch (err) {
    console.log('Server error in /api/search-subreddits:', err);
    res
      .status(500)
      .json({ error: 'Internal server error', details: err.message });
  }
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, '0.0.0.0', () =>
  console.log(`Server running on port ${PORT}`)
);
