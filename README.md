# Farbrengens Web Application

A full-stack web application for managing and discovering Chassidic gatherings (Farbrengens) in Israel.

## Features

- **User Authentication**: Secure registration and login system with JWT tokens
- **Farbrengen Management**: Create, view, edit, and delete Farbrengen events
- **Advanced Filtering**: Search by date, location, type, language, and more
- **Admin Dashboard**: Comprehensive admin panel for user and event management
- **Responsive Design**: Mobile-friendly interface using Material-UI
- **Real-time Updates**: Live event listings and status updates
- **Google Maps Integration**: Location services for event venues
- **Multi-language Support**: Hebrew interface with i18n support

## Tech Stack

### Frontend
- **React** 18.x
- **Material-UI** (MUI) v5
- **React Router** v6
- **Axios** for API calls
- **i18next** for internationalization

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **Nodemailer** for email services
- **Google Maps Services** for location features

## Project Structure

```
project_new/
├── my-app/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service layer
│   │   └── contexts/    # React contexts
│   └── package.json
├── server/              # Express backend
│   ├── routes/          # API routes
│   ├── models/          # Mongoose models
│   ├── middleware/      # Custom middleware
│   ├── config/          # Configuration files
│   └── package.json
└── package.json         # Root scripts for monorepo
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MotiWolff/FarbrengensWeb.git
   cd FarbrengensWeb
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   SILENT_MODE=false
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

   This will start both the frontend (http://localhost:3000) and backend (http://localhost:5001) concurrently.

### Available Scripts

- `npm run dev` - Run both frontend and backend in development mode
- `npm run dev:client` - Run only the frontend
- `npm run dev:server` - Run only the backend
- `npm run install:all` - Install dependencies for both frontend and backend
- `npm run build` - Build the frontend for production

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Environment Variables**: Sensitive data stored in environment variables
- **No Credential Logging**: Production-ready logging with SILENT_MODE
- **Input Validation**: Server-side validation for all user inputs
- **CORS Configuration**: Controlled cross-origin resource sharing

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/request-reset` - Request password reset
- `POST /api/auth/verify-reset` - Verify reset code
- `POST /api/auth/reset-password` - Reset password

### Farbrengens
- `GET /api/farbrengens` - Get all farbrengens
- `GET /api/farbrengens/upcoming` - Get upcoming farbrengens
- `GET /api/farbrengens/:id` - Get farbrengen by ID
- `POST /api/farbrengens` - Create new farbrengen (authenticated)
- `PUT /api/farbrengens/:id` - Update farbrengen (authenticated)
- `DELETE /api/farbrengens/:id` - Delete farbrengen (authenticated)

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `PUT /api/admin/users/:id` - Update user (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)

## UI Components

- **Sidebar Navigation**: Responsive navigation with user menu
- **Farbrengen Cards**: Beautiful event cards with all details
- **Forms**: Material-UI forms with validation
- **Admin Dashboard**: Statistics and management interface
- **Private Routes**: Protected routes for authenticated users

## Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `cd my-app && npm run build`
2. Deploy the `build` folder to your hosting service

### Backend (Heroku/Railway/Render)
1. Set environment variables in your hosting platform
2. Deploy the `server` directory
3. Ensure MongoDB Atlas is accessible

## Environment Variables

### Required
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5001)

### Optional
- `EMAIL_USER` - Email for password reset
- `EMAIL_PASS` - Email app password
- `GOOGLE_MAPS_API_KEY` - Google Maps API key
- `SILENT_MODE` - Enable/disable console logging (true/false)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Author

**Moti Wolff**
- GitHub: [@MotiWolff](https://github.com/MotiWolff)

## Acknowledgments

- Material-UI for the beautiful component library
- MongoDB Atlas for database hosting
- The Chassidic community for inspiration

## Support

For support, email motiwolff@gmail.com or open an issue on GitHub.

---

Made with love for the Chassidic community
