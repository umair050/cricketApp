# 🏏 Cricket Player Platform

A comprehensive web and mobile platform for cricket players to connect, form teams, and participate in tournaments. Built with NestJS backend and React frontend.

## 🚀 Features

### Phase 1: MVP (Current)

- ✅ User registration & authentication (JWT)
- ✅ Player profiles with cricket statistics
- ✅ Team creation and management
- ✅ Tournament listings and participation
- ✅ Responsive dashboard with activity feeds
- ✅ Search and filter players by location/role
- ✅ Modern UI with Tailwind CSS

### Phase 2: Growth (Planned)

- 📊 Advanced performance analytics
- 🎥 Video highlights and posts
- 💬 Real-time chat system
- 🏆 Player rankings and leaderboards
- 📅 Match scheduling system

### Phase 3: Advanced (Future)

- 🤖 AI-powered player recommendations
- 💰 Sponsorship marketplace
- 📱 Mobile app (React Native)
- 🎮 Live match tracking

## 🛠️ Tech Stack

### Backend

- **Framework**: NestJS (Node.js)
- **Database**: MySQL with TypeORM
- **Authentication**: JWT with Passport
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator

### Frontend

- **Framework**: React 18
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Query
- **Forms**: React Hook Form with Yup validation
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📁 Project Structure

```
CricketApp/
├── backend/                 # NestJS API Server
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   │   ├── dto/        # Login/Register DTOs
│   │   │   ├── guards/     # JWT & Local auth guards
│   │   │   └── strategies/ # Passport strategies
│   │   ├── users/          # User management
│   │   ├── players/        # Player profiles & stats
│   │   ├── teams/          # Team management
│   │   └── tournaments/    # Tournament system
│   ├── package.json
│   └── .env
├── frontend/               # React Web App
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   └── Layout/     # Navigation & layout
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   │   ├── Auth/
│   │   │   │   ├── Login/  # Separate login folder
│   │   │   │   └── Register/ # Separate register folder
│   │   │   ├── Dashboard/
│   │   │   ├── Players/
│   │   │   ├── Teams/
│   │   │   ├── Tournaments/
│   │   │   └── Profile/
│   │   └── services/       # API services
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Update `.env` file:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=your_password
   DB_DATABASE=cricket_app

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d

   # App Configuration
   NODE_ENV=development
   PORT=3001
   ```

4. **Create MySQL database**

   ```sql
   CREATE DATABASE cricket_app;
   ```

5. **Start the backend server**

   ```bash
   npm run start:dev
   ```

   The API will be available at: `http://localhost:3001`
   API Documentation: `http://localhost:3001/api`

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

   The app will be available at: `http://localhost:3000`

## 🔧 API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Users

- `GET /users` - Get all users (protected)
- `GET /users/:id` - Get user by ID (protected)
- `DELETE /users/:id` - Delete user (protected)

### Players

- `GET /players` - Get all players
- `POST /players` - Create player profile (protected)
- `GET /players/:id` - Get player by ID
- `GET /players/search` - Search players by location
- `PATCH /players/:id` - Update player (protected)
- `DELETE /players/:id` - Delete player (protected)

### Teams

- `GET /teams` - Get all teams
- `POST /teams` - Create team (protected)
- `GET /teams/:id` - Get team by ID
- `PATCH /teams/:id` - Update team (protected)
- `POST /teams/:teamId/players/:playerId` - Add player to team (protected)
- `DELETE /teams/:teamId/players/:playerId` - Remove player from team (protected)

### Tournaments

- `GET /tournaments` - Get all tournaments
- `POST /tournaments` - Create tournament (protected)
- `GET /tournaments/:id` - Get tournament by ID
- `PATCH /tournaments/:id` - Update tournament (protected)
- `POST /tournaments/:tournamentId/teams/:teamId` - Register team (protected)

## 🎨 UI Components

### Authentication Pages

- **Login**: `/login` - Clean login form with validation
- **Register**: `/register` - Multi-step registration with role selection

### Main Application

- **Dashboard**: Overview with stats and recent activity
- **Players**: Browse and search cricket players
- **Teams**: Create and manage teams
- **Tournaments**: Discover and join tournaments
- **Profile**: Manage personal cricket profile

## 🔐 Authentication Flow

1. **Registration**: Users register with email, name, phone, and role
2. **Login**: JWT token issued on successful authentication
3. **Protected Routes**: Token required for creating/editing content
4. **Role-based Access**: Different permissions for players, organizers, and admins

## 📱 Responsive Design

The application is fully responsive and works on:

- 📱 Mobile devices (320px+)
- 📟 Tablets (768px+)
- 💻 Desktop (1024px+)

## 🎯 Demo Credentials

For testing purposes:

```
Email: demo@cricket.com
Password: demo123
```

## 🔮 Future Enhancements

### Mobile App (React Native)

- Cross-platform iOS/Android app
- Push notifications for matches
- Camera integration for highlights
- Offline capability

### Advanced Features

- Real-time match scoring
- Video analysis with AI
- Sponsorship connections
- Tournament live streaming
- Player marketplace

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Jianjun** - _Initial work_

## 🙏 Acknowledgments

- Cricket communities for inspiration
- Open source libraries and frameworks
- Contributors and beta testers

---

**Ready to play cricket? 🏏 Let's connect players worldwide!**
# cricketApp
