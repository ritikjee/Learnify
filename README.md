# Learnify - Learning Management System

**Learnify** is a modern Learning Management System (LMS) built to provide educators and students with a seamless online learning experience. The platform is designed to be intuitive, flexible, and efficient, offering essential features for both instructors and learners. With integrated Stripe payments, dark and light modes, and REST APIs, Learnify ensures that education can be delivered and managed effortlessly.

## Key Features

- **Stripe Payments**  
  Easily manage course payments with integrated Stripe support, allowing seamless transactions for course enrollments.

- **Dark and Light Mode**  
  Switch between a visually appealing dark mode or a clean light mode based on user preference, ensuring an optimal user experience across various environments.

- **RESTful API Support**  
  Learnify uses a REST API infrastructure that allows for smooth integration with third-party services, making data retrieval and management flexible and scalable.

- **Responsive Design**  
  Fully responsive design to ensure accessibility on all devices, from desktops to mobile phones.

- **Course Management**  
  Teachers can create, edit, and manage courses with rich content, including videos, quizzes, and assignments.

- **Student Progress Tracking**  
  Monitor students' progress through various courses with an easy-to-use dashboard. Track course completion, quiz scores, and more.

- **User Authentication**  
  Secure authentication system with support for role-based access control for students, instructors, and admins.

- **Notifications and Announcements**  
  Stay updated with notifications about course updates, new assignments, and more.

## Installation

To install and run Learnify locally, follow these steps:

1. Clone the repository:

   \`\`\`bash
   git clone https://github.com/ritikjee/Learnify.git
   \`\`\`

2. Install dependencies:

   \`\`\`bash
   cd learnify
   npm install
   \`\`\`

3. Set up environment variables:

   Create a \`.env\` file in the root of the project and add the following variables:

   \`\`\`env
   STRIPE_SECRET_KEY=your_stripe_secret_key
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   \`\`\`

4. Run the development server:

   \`\`\`bash
   npm run dev
   \`\`\`

5. Open your browser and go to \`http://localhost:3000\` to access Learnify.

## Usage

- Instructors can create and manage courses through the instructor dashboard.
- Students can browse courses, enroll using Stripe payments, and start learning right away.
- The platform automatically tracks student progress, grades, and certifications upon course completion.

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Payments**: Stripe
- **Authentication**: JWT and Cookies
- **State Management**: Redux

## Contributing

Contributions are welcome! If you'd like to contribute to the project, please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
