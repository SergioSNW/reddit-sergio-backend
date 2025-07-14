// const clientId = process.env.REDDIT_SERGIO_CLIENT_ID;
// const secret = process.env.REDDIT_SERGIO_SECRET;

// export
const getRedditToken = async () => {
  // const credentials = btoa(`${clientId}:${secret}`);
  const response = await fetch(
    'https://reddit-sergio-backend.onrender.com/api/reddit-token'
  );
  //, {
  //   method: 'GET',
  //   headers: {
  //     Authorization: `Basic ${credentials}`,
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //   },
  //   body: 'grant_type=client_credentials',
  // });

  const data = await response.json();
  return data.access_token; // This token will be used in the API requests.
};

module.exports = { getRedditToken };
