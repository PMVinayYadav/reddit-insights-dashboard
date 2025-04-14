// src/services/api.js
import axios from 'axios';

// Base URL for API (replace with your actual deployed backend URL)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Search Reddit for discussions
export const searchReddit = async (query) => {
  try {
    const response = await api.post('/api/search-reddit', { query });
    return response.data;
  } catch (error) {
    console.error('Error searching Reddit:', error);
    throw error;
  }
};

// Analyze Reddit data with AI
export const analyzeData = async (posts, query) => {
  try {
    const response = await api.post('/api/analyze', { posts, query });
    return response.data;
  } catch (error) {
    console.error('Error analyzing data:', error);
    throw error;
  }
};

// Since we're building an MVP with mock data, let's add functions that simulate API calls
export const mockSearchReddit = async (query) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock data with variations based on query
  return {
    posts: [
      {
        id: 'post1',
        title: `Is ${query} worth the money?`,
        text: `I've been considering buying ${query} for my team, but I'm not sure if it's worth the investment. Has anyone here used it?`,
        url: '#',
        author: 'curious_user',
        subreddit: 'ProductManagement',
        upvotes: 45,
        comments: [
          {
            id: 'comment1',
            text: `We've been using ${query} for about 6 months now. It's been really useful for gathering customer feedback.`,
            author: 'happy_customer',
            upvotes: 12
          },
          {
            id: 'comment2',
            text: `The onboarding process for ${query} was a bit confusing, but their support team was helpful.`,
            author: 'new_user',
            upvotes: 5
          }
        ]
      },
      {
        id: 'post2',
        title: `${query} vs competitors`,
        text: `I'm trying to decide between ${query} and some alternatives. What are the key differences?`,
        url: '#',
        author: 'decision_maker',
        subreddit: 'SaaS',
        upvotes: 78,
        comments: [
          {
            id: 'comment3',
            text: `${query} has better analytics, but the API is more limited compared to others.`,
            author: 'tech_expert',
            upvotes: 22
          },
          {
            id: 'comment4',
            text: `I've tried three different solutions and ${query} had the best UX by far.`,
            author: 'ux_designer',
            upvotes: 15
          }
        ]
      },
      {
        id: 'post3',
        title: `${query} integration issues`,
        text: `Having trouble integrating ${query} with our existing tech stack. Any advice?`,
        url: '#',
        author: 'frustrated_dev',
        subreddit: 'webdev',
        upvotes: 32,
        comments: [
          {
            id: 'comment5',
            text: `Their documentation is outdated. I had to contact support to get it working.`,
            author: 'dev_lead',
            upvotes: 8
          },
          {
            id: 'comment6',
            text: `We built a custom connector to make it work with our system. Would be great if they had better integration options.`,
            author: 'solutions_architect',
            upvotes: 19
          }
        ]
      },
      {
        id: 'post4',
        title: `How we improved our product with insights from ${query}`,
        text: `Case study: How we used ${query} to prioritize our roadmap and increase customer satisfaction by 32%`,
        url: '#',
        author: 'success_story',
        subreddit: 'ProductManagement',
        upvotes: 112,
        comments: [
          {
            id: 'comment7',
            text: `Great write-up! We had similar results. The sentiment analysis helped us identify issues we didn't know existed.`,
            author: 'product_manager',
            upvotes: 28
          },
          {
            id: 'comment8',
            text: `Did you find the theme clustering accurate? We sometimes get weird results.`,
            author: 'data_scientist',
            upvotes: 14
          }
        ]
      },
      {
        id: 'post5',
        title: `${query} missing critical features`,
        text: `I like ${query} overall but there are some basic features missing that would make it much more useful.`,
        url: '#',
        author: 'feature_requester',
        subreddit: 'UXResearch',
        upvotes: 65,
        comments: [
          {
            id: 'comment9',
            text: `Agreed! They need better export options and the ability to create custom dashboards.`,
            author: 'power_user',
            upvotes: 23
          },
          {
            id: 'comment10',
            text: `I've been asking for API improvements for months. It's frustrating because everything else is great.`,
            author: 'integration_specialist',
            upvotes: 31
          },
          {
            id: 'comment11',
            text: `The lack of real-time alerts is a deal-breaker for our team.`,
            author: 'monitoring_fan',
            upvotes: 17
          }
        ]
      }
    ]
  };
};

export const mockAnalyzeData = async (posts, query) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  return {
    sentimentBreakdown: { positive: 42, neutral: 28, negative: 30 },
    topThemes: [
      { theme: "User experience", count: 24, sentiment: "positive" },
      { theme: "Integration issues", count: 18, sentiment: "negative" },
      { theme: "Missing features", count: 15, sentiment: "negative" },
      { theme: "Success stories", count: 12, sentiment: "positive" },
      { theme: "Comparison to competitors", count: 10, sentiment: "neutral" }
    ],
    featureSuggestions: [
      { 
        feature: "Unified API for all integrations", 
        votes: 28, 
        impact: "high",
        rationale: "Many users complained about difficulties connecting with other tools",
        implementationComplexity: "medium"
      },
      { 
        feature: "Custom visualization templates", 
        votes: 24, 
        impact: "medium",
        rationale: "Users want more control over how their data is displayed",
        implementationComplexity: "low"
      },
      { 
        feature: "Real-time sentiment alerting", 
        votes: 22, 
        impact: "high",
        rationale: "Teams need immediate notification when sentiment trends change",
        implementationComplexity: "medium"
      },
      { 
        feature: "Competitor comparison dashboard", 
        votes: 16, 
        impact: "medium",
        rationale: "Users frequently compare products and want this built in",
        implementationComplexity: "high"
      }
    ],
    summary: `Analysis of Reddit discussions about ${query} reveals users appreciate its ability to gather qualitative feedback, but struggle with integration complexity and limited visualization options. The most requested improvement is a unified API that simplifies connecting with other tools in their stack. Real-time sentiment alerting is another highly desired feature, allowing teams to respond quickly to negative feedback trends.`,
    redditData: posts.map(post => ({
      title: post.title,
      comments: post.comments.length,
      upvotes: post.upvotes,
      url: post.url,
      sentiment: post.title.includes('missing') || post.title.includes('issues') ? 
        'negative' : 
        (post.title.includes('improved') || post.title.includes('worth')) ? 
          'positive' : 'neutral'
    }))
  };
};
