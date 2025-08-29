# Task Manager

A full-stack Kanban-style task management application built with Next.js, MongoDB, and NextAuth. This project allows users to authenticate via Google, create, update, and delete tasks, and manage their workflow visually.

---

## Features

- **Google Authentication**: Secure login using OAuth via NextAuth.
- **Kanban Board**: Tasks are organized into columns (Backlog, Todo, Doing, Done).
- **CRUD Operations**: Create, read, update, and delete tasks.
- **Responsive UI**: Built with Tailwind CSS and Radix UI primitives.
- **Consistent Theming**: Uses global theme classes for backgrounds, borders, and text.
- **MongoDB Integration**: Stores user and task data in MongoDB.
- **API Routes**: RESTful endpoints for task management.
- **Error Handling**: User-friendly error messages and validation.

---

## Technologies Used

- **Next.js** (App Router)
- **TypeScript**
- **MongoDB** (via Mongoose for server-side, native driver for Edge Runtime)
- **NextAuth** (Google provider)
- **Tailwind CSS**
- **Radix UI** (Accordion, Kanban icons)
- **Lucide Icons**

---

## Project Structure

```
├── app/
│   ├── page.tsx           # Main Kanban board UI
│   └── api/
│       └── tasks/
│           └── [id]/route.ts # API routes for updating/deleting tasks
├── components/
│   └── ui/
│       └── accordion.tsx  # Accordion UI component
├── models/
│   ├── User.ts            # Mongoose User model
│   └── Task.ts            # Mongoose Task model
├── lib/
│   └── mongodb.ts         # MongoDB connection utility
├── auth.ts                # NextAuth configuration
├── .env.local             # Environment variables
├── global.css             # Global styles and theme variables
└── README.md              # Project documentation
```

---

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/sirajahmedx/task-manager.git
   cd task-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the root directory:
   ```
   AUTH_GOOGLE_ID=your-google-client-id
   AUTH_GOOGLE_SECRET=your-google-client-secret
   AUTH_SECRET=your-nextauth-secret
   MONGODB_URI=mongodb://localhost:27017/taskmanagement
   ```

4. **Run MongoDB locally**
   ```bash
   mongod
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## Usage

- **Sign in** with Google to access your personal Kanban board.
- **Add tasks** using the modal form.
- **Drag and drop** tasks between columns (if implemented).
- **Edit or delete** tasks using the provided UI controls.

---

## API Endpoints

- `PUT /api/tasks/[id]`  
  Update a task by ID.

- `DELETE /api/tasks/[id]`  
  Delete a task by ID.

---

## Theming

- All major containers and components use `bg-background` and `text-foreground` classes.
- Global theme variables are defined in `global.css` and applied throughout the app for consistent styling.

---

## Notes

- **Edge Runtime Limitation**: Mongoose cannot be used in middleware or edge API routes due to dynamic code evaluation restrictions. Use the native MongoDB driver for those cases.
- **Authentication**: Only Google OAuth is supported out of the box.
- **Error Handling**: All API routes return structured JSON responses with success/error messages.

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a pull request

---

## License

MIT

---

## Author