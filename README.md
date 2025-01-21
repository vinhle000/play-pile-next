# Play Pile (Next.js) - Video Game Inventory Management System

## Overview
Play Pile is a video game inventory management system designed to help gamers manage their ever-growing backlog of games. This version of Play Pile is a complete revamp of the [original MERN stack implementation](https://github.com/vinhle000/play-pile), now built with **Next.js** for enhanced performance, server-side rendering (SSR), and future scalability.


You can access the live application through the following link: https://stage.playpile.xyz

## Getting Started
1. Login through Oauth provider
2. Create list with the 'add list' button on the Board page (e.g. 'Backlog', 'Playing', and 'Done')
3. Use search bar to search games and it will retrieve results provided by IGDB.com
4. Use the '+' game to add game a list that you previously created
5. Select 'Board' on top left to access your lists
6. Click a game on a list to manage details or move them to different lists with drag and drop.

<!-- ![PlayPile_v2_demo](https://github.com/your-username/play-pile-next/assets/your-image-link) -->

## Features
- **Game Status Tracking**: Categorize games into statuses like 'Plan to Play', 'Currently Playing', 'Completed', or any custom category.
- **Dynamic Inventory Management**: Add, update, or remove games from your inventory with an intuitive interface.
- **Drag-and-Drop Functionality**: Organize your games easily with a Trello-inspired drag-and-drop interface.
- **User Authentication**: Secure login via Google OAuth for personal game tracking.
- **Progress Notes**: Add notes and dates to each game entry to track progress and your thoughts on the game.
- **Cross-Platform Sync**: Integrate achievements and progress tracking from multiple gaming platforms (coming soon).
- **Deals and Price Tracking**: Track game deals and price drops across platforms (future feature).

## Technologies Used
- **Frontend**: Next.js 14 with React and Tailwind CSS for a modern, fast, and responsive UI/UX.
- **Backend**: Next.js API routes and server-side rendering (SSR) for optimized data fetching and performance.
- **Database**: MongoDB via Mongoose for scalable and efficient data management.
- **Authentication**: Google OAuth for secure user authentication.
<!-- - **State Management**: React Context API and SWR for efficient global state and data management. -->

### Deployment
The project is currently deployed using the following services:

- **Frontend & Backend**: Deployed on [Vercel](https://vercel.com/), taking full advantage of Next.js for seamless server-side rendering and static generation.

## Local Development

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation
1. Clone the repo
```sh
git clone https://github.com/vinhle000/play-pile-next.git
```
2. Install NPM packages
```sh
npm install npm@latest -g
```

### Environment Setup
To run this project locally, you'll need to set up some environment variables. Create a `.env.local` file in the root of your project and populate it with the necessary keys. Here's what you'll need:

```plaintext


# General Settings
NODE_ENV=dev
PORT=8000

# Database
MONGO_URI=your_mongodb_uri_here

# Authentication
AUTH_SECRET=your_auth_secret_here
AUTH_GOOGLE_ID=your_google_client_id_here
AUTH_GOOGLE_SECRET=your_google_client_secret_here

# CORS
CORS_ORIGINS=https://playpile.xyz,https://stage.playpile.xyz

# IGDB API
TWITCH_BASE_URL=https://api.igdb.com/v4
TWITCH_CLIENT_ID=your_twitch_client_id_here
TWITCH_CLIENT_SECRET=your_twitch_client_secret_here

# OAuth Provider URL
NEXTAUTH_URL=http://localhost:3000
```

### Obtaining API Keys and Secrets

- **MongoDB URI**: Obtain this by setting up a MongoDB database via MongoDB Atlas.
- **Google OAuth**: Credentials: Register your application with Google Developer Console to get your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
- **IGDB API Credentials**: You need to register your application with Twitch Dev to access the IGDB API. You can get your `CLIENT_ID` and `CLIENT_SECRET` from there.
  - Please find more instructions here [IGDB API Docs](https://api-docs.igdb.com/#getting-started)
- **Twitch Developer Portal**: Go to [Twitch Developers](https://dev.twitch.tv/console/apps), create an account if you haven't already, and set up a new application. This will provide you with the necessary client ID and secret.


  ### Running the Application
```sh
  npm run dev
```

This will start the application locally on http://localhost:3000.

## Usage
Use Play Pile to manage your video game backlog effectively. After logging in, you can start adding games to your inventory, set statuses, and organize them according to your current gaming goals.


## Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AwesomeFeature`)
3. Commit your Changes (`git commit -m 'Add some AwesomeFeature'`)
4. Push to the Branch (`git push origin feature/AwesomeFeature`)
5. Open a Pull Request

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Contact
Email - vinhle000@gmail.com

Happy Gaming!
