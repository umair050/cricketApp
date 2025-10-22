# 🔧 Android SDK Setup Guide

## ❌ **Current Error**

```
SDK location not found. Define a valid SDK location with an ANDROID_HOME
environment variable or by setting the sdk.dir path in your project's
local properties file
```

**This error means:** Android Studio and Android SDK are not properly configured.

---

## 💡 **Two Solutions**

### **Solution A: Setup Android Studio** (1-2 hours)

- Required for React Native CLI
- Complex but gives full control

### **Solution B: Use Expo** (10 minutes) ⭐ **RECOMMENDED**

- No Android Studio needed
- Works immediately
- Same React Native code

---

## 🔧 **Solution A: Setup Android Studio**

### **Step 1: Install Android Studio**

1. **Download:** https://developer.android.com/studio
2. **Install** with default settings
3. **Open Android Studio**
4. **Complete Setup Wizard**

### **Step 2: Install SDK Components**

1. Open **Android Studio**
2. **More Actions** → **SDK Manager**
3. **SDK Platforms** tab:
   - ✅ Check **Android 13.0 (Tiramisu)** - API Level 33
   - ✅ Check **Show Package Details**
   - ✅ Check **Android SDK Platform 33**
4. **SDK Tools** tab:

   - ✅ Check **Android SDK Build-Tools 33.0.0**
   - ✅ Check **Android SDK Platform-Tools**
   - ✅ Check **Android Emulator**
   - ✅ Check **Intel x86 Emulator Accelerator (HAXM installer)**

5. **Click Apply** → Wait for download

### **Step 3: Set Environment Variables**

#### **Windows:**

1. **Find SDK Path:**

   - Usually: `C:\Users\YourName\AppData\Local\Android\Sdk`
   - Or check Android Studio → SDK Manager → Android SDK Location

2. **Set ANDROID_HOME:**

   - Press `Win + X` → **System**
   - **Advanced system settings**
   - **Environment Variables**
   - **New** (System variables):
     - Variable name: `ANDROID_HOME`
     - Variable value: `C:\Users\LENOVO\AppData\Local\Android\Sdk`
   - **Click OK**

3. **Add to Path:**

   - Edit **Path** variable
   - **Add New:**
     - `%ANDROID_HOME%\platform-tools`
     - `%ANDROID_HOME%\emulator`
     - `%ANDROID_HOME%\tools`
     - `%ANDROID_HOME%\tools\bin`

4. **Restart terminal** to apply changes

#### **macOS/Linux:**

Add to `~/.bash_profile` or `~/.zshrc`:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

Run: `source ~/.bash_profile` (or `~/.zshrc`)

### **Step 4: Verify Installation**

```bash
# Check ANDROID_HOME
echo $ANDROID_HOME  # macOS/Linux
echo %ANDROID_HOME%  # Windows

# Check adb
adb version
```

Should show SDK path and adb version.

### **Step 5: Create local.properties**

In `mobile/android/` create `local.properties`:

```properties
sdk.dir=C:\\Users\\LENOVO\\AppData\\Local\\Android\\Sdk
```

**Note:** Use double backslashes on Windows!

### **Step 6: Create Virtual Device**

1. Open **Android Studio**
2. **More Actions** → **Virtual Device Manager**
3. **Create Device**
4. Select **Pixel 5** or any device
5. Download **System Image** (Tiramisu - API 33)
6. **Finish**

### **Step 7: Run the App**

```bash
# Start emulator from Android Studio or:
emulator -avd Pixel_5_API_33

# In another terminal:
cd mobile
npx @react-native-community/cli run-android
```

---

## 🚀 **Solution B: Use Expo (MUCH EASIER)**

### **Why Expo is Better for Your Situation:**

1. ✅ **No Android Studio needed** for development
2. ✅ **No environment variables** to configure
3. ✅ **Works in 10 minutes**
4. ✅ **Test on real device** with Expo Go app
5. ✅ **Same React Native code**
6. ✅ **Can build APK** using EAS Build when ready

### **Quick Expo Setup:**

```bash
# 1. Backup current mobile
cd CricketApp
mv mobile mobile-rn-backup

# 2. Create Expo app
npx create-expo-app mobile --template blank-typescript
cd mobile

# 3. Install dependencies
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context @reduxjs/toolkit react-redux @react-native-async-storage/async-storage axios

# 4. Copy your config files
mkdir -p src/config src/services src/types

# Windows:
Copy-Item ..\mobile-rn-backup\src\config\api.config.ts src\config\
Copy-Item ..\mobile-rn-backup\src\services\api.service.ts src\services\
Copy-Item ..\mobile-rn-backup\src\types\index.ts src\types\

# 5. Start development
npm start
```

### **Test on Phone:**

1. **Install Expo Go** from Google Play
2. **Scan QR code** from terminal
3. **Done!** 🎉

### **When You Need APK:**

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build APK
eas build --platform android --profile preview
```

---

## 📊 **Time Comparison**

| Task                | React Native CLI | Expo       |
| ------------------- | ---------------- | ---------- |
| **Setup**           | 1-2 hours        | 10 minutes |
| **First Run**       | 30 minutes       | Immediate  |
| **Device Testing**  | USB debugging    | Scan QR    |
| **Build APK**       | Local gradlew    | eas build  |
| **Troubleshooting** | Frequent         | Rare       |

---

## 💡 **My Honest Recommendation**

### **Use Expo!** Here's the reality:

You've already encountered:

1. ❌ npm dependency issues
2. ❌ React Native CLI command not found
3. ❌ Android SDK not configured

**That's 3 hours of troubleshooting for zero code written!**

**With Expo:**

- ✅ Working in 10 minutes
- ✅ All your config files work
- ✅ Can build production APK
- ✅ Can eject to React Native CLI later if needed

---

## 🎯 **Decision Matrix**

### **Continue with React Native CLI if:**

- You're experienced with Android development
- You have 2+ hours to spend on setup
- You need specific native modules now
- You enjoy debugging build issues

### **Switch to Expo if:**

- You want to start coding features TODAY
- You're new to React Native
- You want easier testing
- You value development speed

---

## 📝 **Next Steps**

### **Option 1: Setup Android Studio** (Choose if determined)

1. Follow Step 1-7 above
2. Budget 1-2 hours
3. Expect more troubleshooting

### **Option 2: Use Expo** (Choose if practical) ⭐

1. Run the Quick Expo Setup above
2. Takes 10 minutes
3. Start coding immediately

---

## 🤝 **Final Thoughts**

**You're not failing** - React Native CLI setup IS difficult!

Even experienced developers often choose Expo for:

- Faster development
- Less configuration headaches
- Better developer experience

**Your configuration files (API config, services, types) work with BOTH approaches.**

**Nothing is wasted if you switch to Expo!**

---

## 📚 **Resources**

- **Android Studio:** https://developer.android.com/studio
- **React Native Environment Setup:** https://reactnative.dev/docs/environment-setup
- **Expo:** https://expo.dev/
- **Your Config Files:** `mobile-rn-backup/src/`

---

**My recommendation: Save yourself 2 hours and use Expo. You can always switch to React Native CLI later when you need native modules. Right now, focus on building your app! 🚀**




