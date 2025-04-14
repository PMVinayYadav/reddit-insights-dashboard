# Reddit Insights Dashboard (Pendo Listen Alternative)

A tool to gather qualitative feedback from Reddit discussions, analyze it with AI, and generate actionable insights with feature suggestions.

## Features

- Search Reddit for discussions related to specific products or features
- Extract and analyze qualitative data from posts and comments
- Use AI (Claude and ChatGPT) to perform sentiment analysis and identify themes
- Generate feature suggestions based on user pain points and requests
- Present insights in an intuitive dashboard format

## Live Demo

You can deploy this application and share the link with your Pendo hiring manager for a live demo.

## Deployment Instructions

### Option 1: Deploy with Vercel (Recommended)

1. Fork this repository to your GitHub account
2. Sign up for Vercel (https://vercel.com)
3. Create a new project and import your GitHub repository
4. Configure the following environment variables:
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `ANTHROPIC_API_KEY` - Your Anthropic API key
5. Deploy the application

### Option 2: Manual Deployment

#### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- OpenAI API key
- Anthropic API key

#### Backend Setup
1. Navigate to the `server` directory
2. Create a `.env` file with the environment variables listed in the `.env-example` file
3. Install dependencies:
   ```
   npm install
   ```
4. Start the server:
   ```
   npm start
   ```

#### Frontend Setup
1. Navigate to the root directory
2. Create a `.env` file with:
   ```
   REACT_APP_API_URL=http://your-backend-url
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Build the application:
   ```
   npm run build
   ```
5. Serve the static files using a web server of your choice (Nginx, Apache, etc.)

## Architecture

- **Frontend**: React with Tailwind CSS
- **Backend**: Node.js with Express
- **Data Source**: Reddit API
- **AI Analysis**: 
  - Claude (Anthropic) for sentiment analysis and theme extraction
  - ChatGPT (OpenAI) for feature suggestions

## Mock Data Mode

For demonstration purposes, this application includes a mock data mode that simulates API calls. This allows you to showcase the functionality without actual API keys. To enable mock mode:

1. Set `REACT_APP_USE_MOCK_DATA=true` in your frontend environment variables
2. The application will use pre-generated responses that match the expected format

## Extending the Application

This MVP provides a foundation that can be extended in several ways:

- Add user authentication and saved searches
- Implement more data sources beyond Reddit (Twitter, Product Hunt, etc.)
- Enhance the dashboard with more visualization options
- Add trend analysis for tracking sentiment over time
- Implement a feature voting system for product teams

## Troubleshooting

- If you encounter CORS issues, ensure your backend is properly configured to allow requests from your frontend domain
- API rate limits may apply to both Reddit API and AI services
- For large datasets, consider implementing pagination or streaming responses

## Contact

If you have any questions or need assistance with the deployment, please reach out at your-email@example.com.
