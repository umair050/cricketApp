# 🔧 Add Android SDK to PATH - Quick Fix

## ❌ Current Error

```
'"adb"' is not recognized as an internal or external command
```

**This means:** Android SDK tools are not in your system PATH.

---

## ✅ Quick Fix (Windows)

### **Method 1: Using PowerShell (Temporary - This Session Only)**

Run these commands in your current terminal:

```powershell
$env:ANDROID_HOME = "C:\Users\LENOVO\AppData\Local\Android\sdk"
$env:Path += ";$env:ANDROID_HOME\platform-tools"
$env:Path += ";$env:ANDROID_HOME\emulator"
$env:Path += ";$env:ANDROID_HOME\tools"
$env:Path += ";$env:ANDROID_HOME\tools\bin"
```

Then verify:

```powershell
adb version
```

**Note:** This only works for the current terminal session. When you close the terminal, you'll need to run these commands again.

---

### **Method 2: Permanent System-Wide Setup**

#### **Step 1: Set ANDROID_HOME**

1. Press `Win + X` → Select **System**
2. Click **Advanced system settings** (right side)
3. Click **Environment Variables** button
4. Under **System variables**, click **New**:
   - **Variable name:** `ANDROID_HOME`
   - **Variable value:** `C:\Users\LENOVO\AppData\Local\Android\sdk`
5. Click **OK**

#### **Step 2: Update PATH Variable**

1. Still in **Environment Variables** window
2. Under **System variables**, find and select **Path**
3. Click **Edit**
4. Click **New** and add these one by one:
   - `C:\Users\LENOVO\AppData\Local\Android\sdk\platform-tools`
   - `C:\Users\LENOVO\AppData\Local\Android\sdk\emulator`
   - `C:\Users\LENOVO\AppData\Local\Android\sdk\tools`
   - `C:\Users\LENOVO\AppData\Local\Android\sdk\tools\bin`
5. Click **OK** on all windows

#### **Step 3: Restart Terminal**

**Important:** Close ALL terminal windows and open a new one.

#### **Step 4: Verify**

```bash
adb version
emulator -version
```

Should show version information.

---

## 🚀 After Setting PATH

Once `adb` is recognized:

### **Step 1: Create/Start Android Emulator**

1. Open **Android Studio**
2. Click **More Actions** → **Virtual Device Manager**
3. If no devices: Click **Create Device**
   - Select **Pixel 5**
   - Download system image (API 33 - Tiramisu)
   - Finish setup
4. Click **▶️ (Play)** to start emulator

### **Step 2: Run Your App**

```bash
cd mobile

# Wait for emulator to fully boot (you'll see home screen)
# Then run:
npx @react-native-community/cli run-android
```

---

## ⚠️ Common Issues

### **Issue 1: "No emulators found"**

**Solution:**

```bash
# List available emulators
emulator -list-avds

# Start specific emulator
emulator -avd Pixel_5_API_33
```

### **Issue 2: "Emulator taking forever to start"**

**Solution:**

- Use Android Studio to start emulator
- Or install HAXM (Hardware Accelerated Execution Manager)
- Check if Hyper-V is disabled (required for emulator)

### **Issue 3: Still getting "adb not found"**

**Solution:**

- Make sure you restarted terminal AFTER setting environment variables
- Verify path exists: `dir C:\Users\LENOVO\AppData\Local\Android\sdk\platform-tools`
- If SDK is not there, install Android Studio first

---

## 💡 Still Having Issues? Use Expo!

If you're still facing issues after:

- Setting environment variables
- Creating emulator
- Installing build tools

**Consider switching to Expo:**

```bash
# 1. Backup current work
cd CricketApp
mv mobile mobile-rn-backup

# 2. Create Expo app
npx create-expo-app mobile --template blank-typescript
cd mobile

# 3. Install dependencies
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context @reduxjs/toolkit react-redux @react-native-async-storage/async-storage axios

# 4. Copy config files
mkdir -p src/config src/services src/types
Copy-Item ..\mobile-rn-backup\src\config\api.config.ts src\config\
Copy-Item ..\mobile-rn-backup\src\services\api.service.ts src\services\
Copy-Item ..\mobile-rn-backup\src\types\index.ts src\types\

# 5. Start (works without Android Studio!)
npm start
```

**With Expo:**

- ✅ No Android Studio needed for development
- ✅ No environment variables
- ✅ No emulator setup
- ✅ Test on real phone with Expo Go app
- ✅ Works in 10 minutes

---

## 🎯 Quick Decision

### **Continue with React Native CLI if:**

- You successfully added to PATH
- Android Studio is installed
- You created an emulator
- `adb version` works

### **Switch to Expo if:**

- Still getting errors after PATH setup
- Don't have Android Studio
- Want to start coding now
- Tired of troubleshooting

---

## 📋 Checklist

Before running `npx @react-native-community/cli run-android`:

- [ ] Android Studio installed
- [ ] Android SDK installed (via Android Studio)
- [ ] ANDROID_HOME set to `C:\Users\LENOVO\AppData\Local\Android\sdk`
- [ ] PATH includes `platform-tools`, `emulator`, `tools`
- [ ] Terminal restarted after setting variables
- [ ] `adb version` command works
- [ ] Android emulator created and running
- [ ] `local.properties` file created with SDK path

**If ALL checkboxes are ✅, the app should run!**

---

## 🚀 Next Commands

```bash
# Quick test (after setting PATH and restarting terminal)
adb version
emulator -list-avds

# If those work:
cd mobile
npx @react-native-community/cli run-android
```

---

**You're making progress! The SDK path is set. Now just need to add it to PATH and create an emulator! 🎉**




