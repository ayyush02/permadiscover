# PermaDiscover

PermaDiscover is a decentralized content discovery platform built with IPFS and Next.js. It allows users to search, discover, and store content on IPFS, as well as find content from various external platforms.

## Features

- **IPFS Integration**: Store and retrieve content on the InterPlanetary File System
- **Content Discovery**: Search for content on IPFS and external platforms
- **External Platform Integration**: Search for content on YouTube, Twitter, Instagram, Reddit, and Medium
- **Content Storage**: Store external content on IPFS for permanent access
- **Modern UI**: Beautiful and responsive user interface

## Getting Started

### Prerequisites

- Node.js (v18.19.1 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/permadiscover.git
   cd permadiscover
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/components/`: React components
- `src/pages/`: Next.js pages
- `src/services/`: Service classes for IPFS and external content
- `public/`: Static assets

## API Keys

To use the external platform APIs, you need to obtain API keys from the following services:

- YouTube Data API: [Google Cloud Console](https://console.cloud.google.com/)
- Twitter API: [Twitter Developer Portal](https://developer.twitter.com/)
- Instagram Graph API: [Facebook Developers](https://developers.facebook.com/)
- Reddit API: [Reddit API](https://www.reddit.com/dev/api/)
- Medium API: [Medium API](https://medium.com/developers)

Once you have the API keys, update them in the `src/services/external-content.ts` file.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [IPFS](https://ipfs.io/)
- [Next.js](https://nextjs.org/)
- [Helia](https://github.com/ipfs/helia)
- [Libp2p](https://libp2p.io/)
