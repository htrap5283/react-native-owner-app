🚗 React Native Owner App

📋 Table of Contents
Introduction
Features
Prerequisites
Installation
Running the App
Project Structure
Dependencies
Configuration
Usage
Screenshots
Contributing
License
Contact

🚀 Introduction
React Native Owner App is a mobile application designed to allow car owners to list their vehicles for rental and manage bookings efficiently. Built using React Native, this app leverages Firebase for authentication and data storage, providing a seamless and secure experience for users. The app also integrates with Expo Location for geocoding and mapping features, enhancing the user experience with location-based services.

🌟 Features
🔐 User Authentication: Secure sign-in functionality for car owners, powered by Firebase Authentication.
🚗 Vehicle Listings: Owners can create, view, and manage their vehicle listings effortlessly.
📅 Bookings Management: Owners can approve or decline bookings, keeping track of all rental activities.
📍 Location Services: Integration with Expo Location allows users to select pickup locations with geocoding and mapping features.
💻 Responsive UI: Designed with React Native components for a smooth and intuitive user experience across all devices.

🛠️ Prerequisites
Before you begin, ensure you have the following installed:

Node.js: Version 14 or later
npm: Version 6 or later (or Yarn)
Expo CLI: Install via npm install -g expo-cli
Firebase Account: Set up a project in the Firebase Console
🔧 Installation
To set up the project locally, follow these steps:

Clone the Repository

git clone https://github.com/htrap5283/react-native-owner-app.git
cd react-native-owner-app
Install Dependencies

Using npm:
npm install

Using Yarn:
yarn install

Set Up Firebase

Create a Firebase project in the Firebase Console.
Add an web app to your Firebase project.
Set up Firestore Database and Authentication in the FirebaseProject.
Obtain your Firebase configuration and replace it in config/FirebaseConfig.js.

Environment Configuration
Replace sensitive information such as Firebase API keys in config/FirebaseConfig.js and other configuration files.

🏃 Running the App
To start the development server and run your app on any device using Expo's tunnel feature, use the following command:
npx expo start --tunnel

Steps:
Start the Expo Development Server:

Run the following command in the root directory of your project:
npx expo start --tunnel

This command will start the Expo development server with tunnel mode enabled, allowing you to access the app from any device over the internet.

Open the Expo Go App:

Download and install the Expo Go app on your mobile device from the Google Play Store or the Apple App Store.
Scan the QR code displayed in your terminal or browser using the Expo Go app to open the project on your device.
Run on Android Emulator or iOS Simulator (optional):

If you prefer to run the app on an emulator or simulator, you can choose the corresponding option in the terminal:

Press a to open the app in the Android emulator.
Press i to open the app in the iOS simulator (macOS only).
Run on Web:

To run your app on the web, simply press w in the terminal after starting the Expo development server. This will open your app in a web browser.

📁 Project Structure
Here's a brief overview of the project's file structure:

react-native-owner-app
├── assets # Static assets like images and fonts
├── components # Reusable components
├── config # Configuration files (e.g., Firebase)
├── screens # Application screens
│ ├── SignInScreen.js
│ ├── CreateListingScreen.js
│ └── Bookings.js
├── App.js # Entry point of the application
├── package.json # Project metadata and dependencies
└── README.md # Project documentation

📦 Dependencies
The project uses the following major dependencies:
React Native: Core framework for building the app.
Expo: Managed workflow for React Native development.
Firebase: Backend services for authentication and database.
React Navigation: Navigation library for managing screens and tabs.
Expo Location: For accessing device location and geocoding.
Refer to package.json for the complete list of dependencies and their versions.

⚙️ Configuration
Ensure your Firebase configuration is set correctly in config/FirebaseConfig.js:

FirebaseConfig.js file :

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//import necessary firebase service
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
apiKey: "YOUR_API_KEY",
authDomain: "YOUR_AUTH_DOMAIN",
projectId: "YOUR_PROJECT_ID",
storageBucket: "YOUR_STORAGE_BUCKET",
messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Instantiate auth object
const auth = getAuth(app)

// Instantiate firestore object
const db = getFirestore(app)

// export the auth and db object to use in app
export { auth, db }
🧑‍💻 Usage
Here's a brief guide on how to use the app:

Sign-In
Open the app and enter your credentials on the Sign-In screen to access the owner's dashboard.
Only users with the "owner" user type will have access to the app's features.
Create a Listing
Navigate to the "Create Listing" tab.
Enter the vehicle details, including make, model, seating capacity, horsepower, and more.
Use the "Search Vehicle" button to fetch additional vehicle data.
Specify the rental price and pickup location for the listing.
Tap "Create Listing" to save the vehicle listing to the database.
Manage Bookings
Navigate to the "Bookings" tab to view and manage incoming bookings.
Approve or decline bookings directly from the app.
Approved bookings will generate a confirmation code for the renter.
📸 Screenshots
Create Listing Screen

Bookings Screen

<!-- Note: Update the screenshots with actual images from your app. -->

🤝 Contributing
Contributions are always welcome! Here are some ways you can help:

Reporting Bugs: Use the issue tracker to report bugs.
Suggesting Enhancements: Propose improvements or new features.
Pull Requests: Fork the repository and submit pull requests.
Pull Request Process
Fork the repository.
Create a new branch (git checkout -b feature/YourFeatureName).
Make your changes and commit (git commit -m 'Add some feature').
Push to the branch (git push origin feature/YourFeatureName).
Open a pull request.
Please ensure your code follows the project's coding style and includes relevant documentation.

📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

📬 Contact
If you have any questions or feedback, feel free to reach out:

Email: parthjp5283@gmail.com
GitHub: htrap5283

🔍 Additional Notes
Firebase Security Rules: Ensure your Firestore and Authentication security rules are set appropriately to protect user data.
Expo Updates: Stay up to date with the latest Expo SDK versions to benefit from new features and security improvements.
