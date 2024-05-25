# Play Pile - Video Game Inventory Management System

## Overview
Play Pile is an advanced video game inventory management system designed to help gamers manage and progress through their ever-growing backlog of games. This application is deployed and can be accessed at [Play Pile on Vercel](https://play-pile.vercel.app).

![PlayPile_v1_demo_5 24 24](https://github.com/vinhle000/play-pile/assets/26887964/4e72a31c-0d09-4964-a307-b559cd0fc64d)

## Features
- **Game Status Tracking**: Categorize games into different statuses like 'Plan to Play', 'Currently Playing', 'Completed', or any custom category that suits your gaming habits.
- **Dynamic Inventory Management**: Add, update, or remove games from your inventory with a simple and intuitive interface.
- **Drag-and-Drop Functionality**: Organize your games easily with a drag-and-drop interface, mimicking popular productivity tools like Trello.
- **User Authentication**: Secure login and registration functionality to keep your gaming list personal and secure.
- **Progress Notes**: Add dates and detailed notes to each game to remember where you left off or key thoughts about the game.
- **Embedded Links**: Enhance each game entry with direct links to walkthroughs, guides, FAQs, and YouTube tutorials. This centralizes resources in one accessible location, allowing you to easily resume games after breaks and manage gameplay information without the clutter of numerous browser tabs.

## Technologies Used
- **Frontend**: React.js with Tailwind CSS for responsive and modern UI/UX.
- **Backend**: Express.js and Node.js providing a robust server-side logic.
- **Database**: MongoDB for a flexible and scalable data storage solution.
- **Authentication**: JWT and cookie-based sessions for secure user authentication.
- **State Management**: React Context API for managing application state across multiple components to reduce prop-drilling.

### Deployment
This project is currently deployed using the following services:

- **Frontend**: Deployed on [Vercel](https://vercel.com/). This platform is used for hosting the frontend application to ensure optimal performance and scalability.
- **Backend**: Deployed on [Render](https://render.com/). Render hosts the backend services, providing robust management of the application's server-side operations.

### Accessing the Live Application
You can access the live application through the following links:

- **Frontend**: [https://play-pile.vercel.app](https://play-pile.vercel.app/) - This is where the client is accessible.
- **Backend**: [https://play-pile.onrender.com](https://play-pile.onrender.com/) - Endpoint for accessing the API services.


## Local Development
To set up and run a local copy for development, follow these steps:

### Prerequisites
- Node.js
- npm


### Installation
1. Clone the repo
```sh
git clone https://github.com/vinhle000/play-pile.git
```
2. Install NPM packages
```sh
npm install npm@latest -g
```

### Environment Setup
To run this project locally, you'll need to set up some environment variables. Create a `.env` file in the root of your project and populate it with the necessary keys. Here's what you'll need:

```plaintext
# General Settings
NODE_ENV=development
PORT=8000

# Database
MONGO_URI=your_mongodb_uri_here

# Authentication
JWT_SECRET=your_jwt_secret_here

# CORS - List all domains that your frontend might be served from
CORS_ORIGINS=http://localhost:5173,https://play-pile.vercel.app

# IGDB API - You need to register your application with Twitch to obtain these
TWITCH_BASE_URL=https://id.twitch.tv/oauth2/token
IGDB_CLIENT_ID=your_igdb_client_id_here
IGDB_CLIENT_SECRET=your_igdb_client_secret_here
```

### Obtaining API Keys and Secrets
- **MongoDB URI**: You can obtain this by setting up a MongoDB database, either locally or through a provider like MongoDB Atlas.
- **JWT Secret**: This is a secret key for your application which you can generate yourself. Make sure it's a strong random string.
- **IGDB API Credentials**: You need to register your application with Twitch Dev to access the IGDB API. You can get your `CLIENT_ID` and `CLIENT_SECRET` from there.
  - Please find more instructions here [IGDB API Docs](https://api-docs.igdb.com/#getting-started)


  **Twitch Developer Portal**: Go to [Twitch Developers](https://dev.twitch.tv/console/apps), create an account if you haven't already, and set up a new application. This will provide you with the necessary client ID and secret.

### Example Environment File

In root folder
```plaintext
# .env.example - backend

NODE_ENV=
PORT=

MONGO_URI=
JWT_SECRET=

CORS_ORIGINS=

TWITCH_BASE_URL=https://id.twitch.tv/oauth2/token
IGDB_CLIENT_ID=
IGDB_CLIENT_SECRET=
```

In ```./frontend``` folder
```plaintext
# .env.example - frontend

VITE_REACT_APP_URL=https://play-pile.onrender.com
VITE_ENV=dev
```

Please remember to copy `.env.example` to `.env` and fill in the actual values:
```sh
cp .env.example .env
```

## Usage
Use Play Pile to manage your video game backlog effectively. After logging in, you can start adding games to your inventory, set statuses, and organize them according to your current gaming goals.

## Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Contact
Email - vinhle000@gmail.com

Happy Gaming!
