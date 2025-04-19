// Add this at the top of your api.js file
const mockDataSets = {
  "pendo listen": {
    sentimentBreakdown: { positive: 42, neutral: 28, negative: 30 },
    topThemes: [
      { theme: "UX feedback", count: 24, sentiment: "positive" },
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
    ]
  },
  "figma": {
    sentimentBreakdown: { positive: 65, neutral: 20, negative: 15 },
    topThemes: [
      { theme: "Collaboration features", count: 36, sentiment: "positive" },
      { theme: "Performance issues", count: 14, sentiment: "negative" },
      { theme: "Plugin ecosystem", count: 22, sentiment: "positive" },
      { theme: "Learning curve", count: 10, sentiment: "neutral" },
      { theme: "Enterprise features", count: 8, sentiment: "mixed" }
    ],
    featureSuggestions: [
      { 
        feature: "Improved 3D object support", 
        votes: 42, 
        impact: "high",
        rationale: "Users want better 3D modeling capabilities directly in Figma",
        implementationComplexity: "high"
      },
      { 
        feature: "Performance optimization for large files", 
        votes: 38, 
        impact: "high",
        rationale: "Many users reported slowdowns with complex projects",
        implementationComplexity: "medium"
      },
      { 
        feature: "Integrated user testing tools", 
        votes: 26, 
        impact: "medium",
        rationale: "Teams want to conduct user tests without leaving Figma",
        implementationComplexity: "medium"
      },
      { 
        feature: "Advanced animation tools", 
        votes: 22, 
        impact: "medium",
        rationale: "Users currently rely on other tools for complex animations",
        implementationComplexity: "medium"
      }
    ]
  },
  "slack": {
    sentimentBreakdown: { positive: 55, neutral: 25, negative: 20 },
    topThemes: [
      { theme: "Integration capabilities", count: 32, sentiment: "positive" },
      { theme: "Message organization", count: 24, sentiment: "negative" },
      { theme: "Search functionality", count: 18, sentiment: "negative" },
      { theme: "Mobile experience", count: 16, sentiment: "positive" },
      { theme: "Enterprise controls", count: 10, sentiment: "neutral" }
    ],
    featureSuggestions: [
      { 
        feature: "Advanced message filtering", 
        votes: 48, 
        impact: "high",
        rationale: "Users struggle with information overload in busy channels",
        implementationComplexity: "medium"
      },
      { 
        feature: "Improved search capabilities", 
        votes: 36, 
        impact: "high",
        rationale: "Finding past conversations is consistently mentioned as difficult",
        implementationComplexity: "medium"
      },
      { 
        feature: "Thread summarization", 
        votes: 28, 
        impact: "medium",
        rationale: "AI-powered summaries of long threads would save time",
        implementationComplexity: "high"
      },
      { 
        feature: "Focus mode", 
        votes: 22, 
        impact: "medium",
        rationale: "Users want better ways to focus on important conversations",
        implementationComplexity: "low"
      }
    ]
  }
};

// Then update your mockAnalyzeData function
export const mockAnalyzeData = async (posts, query) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  // Normalize the query to lowercase for matching
  const normalizedQuery = query.toLowerCase();
  
  // Check if we have a specific mock data for this search term
  let mockData;
  if (normalizedQuery.includes("pendo") || normalizedQuery.includes("listen")) {
    mockData = mockDataSets["pendo listen"];
  } else if (normalizedQuery.includes("figma")) {
    mockData = mockDataSets["figma"];
  } else if (normalizedQuery.includes("slack")) {
    mockData = mockDataSets["slack"];
  } else {
    // Generic data for other searches
    mockData = {
      sentimentBreakdown: { positive: 40, neutral: 30, negative: 30 },
      topThemes: [
        { theme: `${query} user experience`, count: Math.floor(Math.random() * 30) + 10, sentiment: "mixed" },
        { theme: `${query} pricing concerns`, count: Math.floor(Math.random() * 20) + 10, sentiment: "negative" },
        { theme: `${query} feature requests`, count: Math.floor(Math.random() * 20) + 10, sentiment: "neutral" },
        { theme: `${query} success stories`, count: Math.floor(Math.random() * 15) + 5, sentiment: "positive" },
        { theme: `${query} technical issues`, count: Math.floor(Math.random() * 15) + 5, sentiment: "negative" }
      ],
      featureSuggestions: [
        { 
          feature: `Improved ${query} documentation`, 
          votes: Math.floor(Math.random() * 30) + 10, 
          impact: "medium",
          rationale: "Users frequently mention confusion about how to use certain features",
          implementationComplexity: "low"
        },
        { 
          feature: `${query} integration API`, 
          votes: Math.floor(Math.random() * 25) + 15, 
          impact: "high",
          rationale: "Connecting with other tools is a common request",
          implementationComplexity: "medium"
        },
        { 
          feature: `${query} analytics dashboard`, 
          votes: Math.floor(Math.random() * 20) + 10, 
          impact: "medium",
          rationale: "Teams want better insights into usage patterns",
          implementationComplexity: "medium"
        },
        { 
          feature: `Mobile ${query} application`, 
          votes: Math.floor(Math.random() * 15) + 10, 
          impact: "high",
          rationale: "On-the-go access is increasingly important to users",
          implementationComplexity: "high"
        }
      ]
    };
  }
  
  return {
    sentimentBreakdown: mockData.sentimentBreakdown,
    topThemes: mockData.topThemes,
    featureSuggestions: mockData.featureSuggestions,
    summary: `Analysis of Reddit discussions about ${query} reveals patterns in user sentiment and feature requests. The most prominent themes include ${mockData.topThemes[0].theme} and ${mockData.topThemes[1].theme}. Users frequently request improvements related to ${mockData.featureSuggestions[0].feature.toLowerCase()}, which could significantly improve satisfaction.`,
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
