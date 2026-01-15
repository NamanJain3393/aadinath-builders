# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## 📱 Mobile App Development (Capacitor)

The project is configured with **Capacitor** to allow building native Android and iOS applications from this web codebase.

### Prerequisites
- **Android:** [Android Studio](https://developer.android.com/studio) installed.
- **iOS:** [Xcode](https://developer.apple.com/xcode/) installed (Mac only).

### Development Workflow

1.  **Sync Web Project to Native:**
    Whenever you make changes to the web code and want to see them in the mobile apps, run:
    ```bash
    npm run cap:sync
    ```

2.  **Open Native Projects:**
    To build the APK or run on iOS, open the project in the respective IDE:
    - **Android Studio:** `npm run cap:open:android`
    - **Xcode (iOS):** `npm run cap:open:ios`

### Generating the Android APK
1. Run `npm run cap:open:android`.
2. In Android Studio, wait for Gradle to sync.
3. Go to **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
4. Once finished, click **locate** in the popup to find your `app-debug.apk`.

### Generating the iOS App
1. Run `npm run cap:open:ios`.
2. In Xcode, select your target device or "Generic iOS Device".
3. Go to **Product** > **Archive** to build for distribution, or just click the **Play** button to run on a simulator/connected device.

