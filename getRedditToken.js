// const clientId = process.env.REDDIT_SERGIO_CLIENT_ID;
// const secret = process.env.REDDIT_SERGIO_SECRET;

export const getRedditToken = async () => {
  // const credentials = btoa(`${clientId}:${secret}`);
  const response = await fetch('http://localhost:5050/api/reddit-token');
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
