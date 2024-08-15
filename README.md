# PurposeFinder App

PurposeFinder is a web application designed to help users discover and articulate their life purpose using guided questions and insights based on the principles of Ikigai and Massive Transformative Purpose (MTP). Built with Next.js, TypeScript, and Tailwind CSS, this app offers a modern, responsive, and user-friendly interface to facilitate deep personal reflection.

## Features

- **Guided Question Flow**: Users are guided through a series of introspective questions to help them uncover their passions, skills, and life goals.
- **Purpose Models**: Incorporates the Ikigai and MTP frameworks to help users define a meaningful and actionable purpose.
- **Responsive Design**: Leveraging Tailwind CSS, the app is fully responsive, ensuring a seamless experience across all devices.
- **Next.js 14**: Utilizes the latest features of Next.js, including server actions and dynamic routing for optimal performance.
- **Firebase Integration**: Uses Firebase for authentication and real-time data management, ensuring secure and efficient backend operations.
- **State Management with Zustand**: Zustand is used for simple and scalable state management within the app.

## Tools and Dependencies

### Main Technologies

- **Next.js 14**: The core framework for building the application, providing features like server-side rendering and API routes.
- **TypeScript**: Ensures type safety and enhanced developer experience throughout the codebase.
- **Tailwind CSS**: A utility-first CSS framework used for designing a highly responsive and modern UI.
- **Firebase**: Integrated for authentication, data storage, and other backend services.
- **Zustand**: A small, fast, and scalable state management solution for managing global state in the application.
- **Stripe**: Integrated with the app for handling payments, ensuring a smooth and secure transaction process.

### Key Dependencies

- **`@ai-sdk/openai`**: For integrating AI-driven interactions within the app.
- **`html2canvas`**: Converts DOM elements into canvas for generating visuals.
- **`lucide-react`**: Icons library used for scalable vector icons in React.
- **`react-firebase-hooks`**: Provides hooks for seamless integration with Firebase.
- **`react-hot-toast`**: For showing non-intrusive notifications in the app.
- **`react-select`**: A flexible and customizable select box component for React.
- **`zustand`**: A lightweight state management library.

### Development Tools

- **ESLint**: Linting tool for maintaining code quality.
- **TypeScript**: For type checking and ensuring code quality.
- **Tailwind CSS**: Used alongside PostCSS and Autoprefixer for styling.

## Getting Started

### Prerequisites

Make sure you have Node.js and npm installed on your machine.

### Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/brown2020/purposefinder-app.git
cd purposefinder-app
npm install
```

### Running the Development Server

To start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app in your browser. The server will reload automatically when you make changes to the code.

### Building for Production

To build the app for production:

```bash
npm run build
```

### Environment Variables

Create a `.env.local` file in the root directory to define your environment variables. Use the `.env.example` file as a reference.

## Project Structure

- **`/src`**: Contains all the source code, including components, pages, and utilities.
- **`/public`**: Houses static assets like images and icons.
- **`/styles`**: Includes Tailwind CSS configurations and global styles.

## Deployment

The app is ready to be deployed on Vercel. Simply connect the repository to Vercel, and push your changes to the `main` branch. Vercel will handle the rest, including building and deploying your app.

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add a new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or feedback, please open an issue or reach out via email.
