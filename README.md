# RemindMe+ — Alzheimer’s Memory Helper App

RemindMe+ is a thoughtfully designed mobile application built with **React Native (Expo)** to assist individuals with **Alzheimer’s** and **memory-related conditions**. It helps users stay organized, remember loved ones, and maintain cognitive engagement through reminders and interactive memory games. The app prioritizes **simplicity, privacy, and accessibility**, ensuring that all data remains stored locally on the device.

---

## Tech Stack

| Category       | Technology                                                           |
| -------------- | -------------------------------------------------------------------- |
| Framework      | [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/) |
| Language       | TypeScript                                                           |
| Database       | Expo SQLite (persistent local storage)                               |
| Notifications  | Expo Notifications                                                   |
| Voice Output   | Expo Speech (Text-to-Speech)                                         |
| Image Handling | Expo Image Picker                                                    |
| Build Tools    | Android Studio / Gradle                                              |
| UI Library     | Custom React Native Components                                       |

---

## Key Features

### Today Tab

* Displays all active reminders for the current day
* Allows adding new reminders with title, time, and description
* Supports marking reminders as completed
* Integrates a voice assistant to read reminders aloud for accessibility

### People Tab

* Stores photos and details of family, friends, and caregivers
* Includes fields for name, relationship, and personal notes
* Provides full-screen photo viewing
* Operates entirely offline to preserve privacy

### Memory Games Tab

* Engaging quizzes designed to strengthen recognition and recall
* Uses stored photos to ask questions like “Who is this person?”
* Includes two questions per person (name + relationship)
* Displays score and performance summary
* Encourages consistent cognitive exercise

### Settings

* Toggle text-to-speech on or off
* Manage local notifications
* (Upcoming) Backup and restore local data

---

## Project Vision

RemindMe+ aims to empower individuals facing memory challenges by:

* Providing structured reminders for daily activities and medication
* Helping users recall familiar faces and strengthen connections
* Encouraging mental engagement through interactive memory games
* Maintaining complete data privacy with an offline-first design

---

## Installation Guide

> Tested with Node 18.x, Expo CLI, and Android Studio. Compatible with physical Android devices and iOS builds (requires macOS + Xcode).

### 1. Clone this Repository

```bash
git clone https://github.com/hemanth708c/remindme-plus.git
cd remindme-plus
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Or using yarn:

```bash
yarn
```

### 3. Install Expo CLI (if not installed)

```bash
npm install -g expo-cli
# or
yarn global add expo-cli
```

### 4. Start the Application

```bash
expo start
```

* Scan the QR code using Expo Go (Android).
* For iOS, follow Expo’s setup instructions (requires macOS).

### 5. Optional: Build for Production

* Use EAS Build or the classic `expo build` workflow.
* For Android, use Android Studio with an emulator or USB-connected device.

---

## Project Structure

```
/src
  /components        # Reusable UI components
  /screens           # App screens (Today, People, MemoryGames, Settings)
  /repos             # SQLite data repositories
  /navigation        # Navigation configuration
  /assets            # Images and icons
  /utils             # Helper functions and constants
App.tsx
app.json
package.json
```

---

## Developer Notes

* Local Storage: Data persistence handled via Expo SQLite.
* Permissions: Requests access to camera, gallery, and notifications.
* Notifications: Supports local scheduling; remote notifications optional.
* Text-to-Speech: Implemented using Expo Speech with platform-specific voices.
* Offline-first: All images and data remain on the device, ensuring privacy.

---

## Accessibility and Design Principles

* Clean, high-contrast UI for readability
* Large buttons and touch areas for ease of use
* Text-to-speech integration for users with vision or comprehension difficulties
* Future plans include a simplified Caregiver Mode and multi-language support

---

## Testing

* Test on physical devices for accurate results with notifications and media access.
* Automated tests can be added using Jest + React Native Testing Library.

---

## Roadmap

* Local backup and restore (encrypted export/import)
* Caregiver remote access (optional)
* Advanced memory exercises and statistics tracking
* Dark mode and theming
* Localization (multi-language support)

---

## Contributing

Contributions, feedback, and feature suggestions are welcome.

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push to GitHub: `git push origin feature/your-feature`
5. Submit a Pull Request with a clear summary and screenshots if UI changes are included

---

## Screenshots

Add screenshots under `/assets/screenshots/` and reference them below:

```markdown
![Quiz Result](assets/screenshots/quiz_result.png)
![Today Tab](assets/screenshots/today_tab.png)
![People Tab](assets/screenshots/people_tab.png)
```

---

## Privacy Policy

* All app data is stored locally and never shared externally.
* No analytics, tracking, or cloud sync by default.
* Future backup options will use encrypted storage with explicit user consent.

---

## License

Licensed under the MIT License. See the `LICENSE` file for more information.

---

## Contact

Created and maintained by **Hemanth J.**
For inquiries, feedback, or support — please open an issue on the [GitHub repository](https://github.com/hemanth708c/remindme-plus/issues).

---

## Final Note

RemindMe+ is built with empathy and practicality, designed to make technology supportive and accessible for individuals and caregivers managing memory-related challenges.

> Small reminders make a big difference.
