// server.js - Express server for Reddit Insights
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configure OpenAI API (ChatGPT)
const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openaiConfig);

// Configure Anthropic API (Claude)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Reddit search endpoint
app.post('/api/search-reddit', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Search Reddit using their JSON API
    const redditResponse = await axios.get(
      `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=relevance&t=year&limit=20`
    );

    const posts = redditResponse.data.data.children.map(child => {
      const post = child.data;
      return {
        id: post.id,
        title: post.title,
        text: post.selftext,
        url: `https://www.reddit.com${post.permalink}`,
        author: post.author,
        subreddit: post.subreddit,
        upvotes: post.score,
        comments: post.num_comments,
        created: post.created_utc,
        postUrl: post.url
      };
    });

    // For each post, get comments (top level only)
    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        try {
          const commentsResponse = await axios.get(
            `https://www.reddit.com${post.url.split('reddit.com')[1]}.json`
          );
          
          // Extract top level comments
          const comments = commentsResponse.data[1].data.children
            .filter(child => child.kind === 't1')
            .map(child => ({
              id: child.data.id,
              text: child.data.body,
              author: child.data.author,
              upvotes: child.data.score,
              created: child.data.created_utc
            }));
          
          return { ...post, comments };
        } catch (error) {
          console.error(`Error fetching comments for post ${post.id}:`, error);
          return { ...post, comments: [] };
        }
      })
    );

    res.json({ posts: postsWithComments });
  } catch (error) {
    console.error('Error searching Reddit:', error);
    res.status(500).json({ error: 'Failed to search Reddit' });
  }
});

// Analyze data using AI
app.post('/api/analyze', async (req, res) => {
  try {
    const { posts, query } = req.body;
    if (!posts || !query) {
      return res.status(400).json({ error: 'Posts and query are required' });
    }

    // Prepare data for analysis
    const postData = posts.map(post => ({
      title: post.title,
      text: post.text,
      comments: post.comments.map(c => c.text).join('\n'),
      upvotes: post.upvotes,
      commentCount: post.comments.length
    }));

    // Claude API call for sentiment analysis
    const sentimentPrompt = `
You are analyzing Reddit posts about "${query}". Here are the posts and their comments:

${JSON.stringify(postData, null, 2)}

Please analyze the sentiment of these discussions and categorize them as positive, negative, or neutral.
Also identify the main themes being discussed and any feature requests or pain points mentioned.
Format your response as a JSON object with these keys:
- sentimentBreakdown: Object with percentages for positive, neutral, and negative sentiment
- topThemes: Array of objects with theme name, count, and dominant sentiment
- featureSuggestions: Array of objects with feature description, approximate vote count, and impact level (high, medium, low)
- summary: A concise paragraph summarizing the findings
`;

    const sentimentResponse = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 4000,
      temperature: 0.2,
      system: "You are an expert at analyzing user feedback and extracting insights. Always return valid JSON.",
      messages: [
        { role: "user", content: sentimentPrompt }
      ]
    });

    // ChatGPT API call for feature suggestions
    const featurePrompt = `
Based on the following Reddit discussions about "${query}":

${JSON.stringify(postData, null, 2)}

What features are users asking for or implying they need? What are the pain points?
Please generate specific product feature recommendations that would address these needs.
Format your response as a JSON array of feature objects, each with:
- feature: Brief description of the feature
- rationale: Why this feature would be valuable
- implementationComplexity: Estimated complexity (high, medium, low)
- impact: Estimated user impact (high, medium, low)
`;

    const featureResponse = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a product development expert who specializes in turning user feedback into actionable feature ideas." },
        { role: "user", content: featurePrompt }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    // Parse and combine the results
    let sentimentResults;
    try {
      const content = sentimentResponse.content[0].text;
      sentimentResults = JSON.parse(content);
    } catch (error) {
      console.error('Error parsing Claude response:', error);
      sentimentResults = {
        sentimentBreakdown: { positive: 33, neutral: 33, negative: 34 },
        topThemes: [],
        featureSuggestions: [],
        summary: "Error parsing sentiment analysis."
      };
    }

    let featureResults;
    try {
      featureResults = JSON.parse(featureResponse.data.choices[0].message.content);
    } catch (error) {
      console.error('Error parsing ChatGPT response:', error);
      featureResults = [];
    }

    // Combine and enhance the results
    const enhancedFeatureSuggestions = sentimentResults.featureSuggestions.map((feature, index) => {
      const matchingGptFeature = featureResults.find(f => 
        f.feature.toLowerCase().includes(feature.feature.toLowerCase()) || 
        feature.feature.toLowerCase().includes(f.feature.toLowerCase())
      );
      
      return {
        ...feature,
        rationale: matchingGptFeature?.rationale || "Based on user discussions",
        implementationComplexity: matchingGptFeature?.implementationComplexity || "medium"
      };
    });

    // Return combined analysis
    res.json({
      sentimentBreakdown: sentimentResults.sentimentBreakdown,
      topThemes: sentimentResults.topThemes,
      featureSuggestions: enhancedFeatureSuggestions,
      summary: sentimentResults.summary,
      redditData: posts.map(post => ({
        title: post.title,
        comments: post.comments.length,
        upvotes: post.upvotes,
        url: post.url,
        sentiment: post.sentiment || "neutral" // This would come from additional analysis
      }))
    });
  } catch (error) {
    console.error('Error analyzing data:', error);
    res.status(500).json({ error: 'Failed to analyze data' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
