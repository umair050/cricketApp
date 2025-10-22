# 📱 Connect Physical Android Device - Quick Guide

## 🎯 Goal

Connect your Android phone to run the app (much faster than emulator!)

---

## ✅ Prerequisites

- [ ] Android SDK installed (PATH configured)
- [ ] `adb` command works in terminal
- [ ] USB cable to connect your phone
- [ ] Your Android phone

---

## 🔧 Step 1: Enable Developer Options on Your Phone

### **For Android 4.2+:**

1. Open **Settings** on your phone
2. Scroll down to **About phone**
3. Find **Build number** (might be under "Software information")
4. **Tap Build number 7 times**
5. You'll see: "You are now a developer!"

---

## 🔓 Step 2: Enable USB Debugging

1. Go back to **Settings**
2. Find **Developer options** (usually under System or just in main Settings)
3. Turn on **Developer options** (toggle at top)
4. Scroll down and enable:
   - ✅ **USB debugging**
   - ✅ **Install via USB** (if available)
   - ✅ **USB debugging (Security settings)** (if available)

---

## 🔌 Step 3: Connect Your Phone

1. **Connect** your phone to computer via USB cable
2. On your phone, you'll see a popup: **"Allow USB debugging?"**
   - Check: **"Always allow from this computer"**
   - Tap: **"OK"**

---

## ✅ Step 4: Verify Connection

Open terminal and run:

```bash
adb devices
```

**Expected output:**

```
List of devices attached
ABC123XYZ    device
```

### **Troubleshooting:**

#### **If you see "unauthorized":**

```
List of devices attached
ABC123XYZ    unauthorized
```

**Solution:**

- Disconnect and reconnect USB cable
- Check your phone for the "Allow USB debugging?" popup
- Tap "OK"

#### **If no devices shown:**

```
List of devices attached
```

**Solution:**

1. **Try different USB port** (use USB 2.0 port, not 3.0)
2. **Try different USB cable** (some cables are charge-only)
3. **Change USB mode on phone:**
   - Swipe down notification panel
   - Tap "USB" notification
   - Select **"File Transfer"** or **"PTP"** (not "Charging only")
4. **Restart ADB server:**
   ```bash
   adb kill-server
   adb start-server
   adb devices
   ```

#### **If you see "offline":**

```
List of devices attached
ABC123XYZ    offline
```

**Solution:**

```bash
adb kill-server
adb start-server
adb devices
```

---

## 🚀 Step 5: Run Your App on Physical Device

### **Method 1: Start Metro and Run (Recommended)**

**Terminal 1 - Start Metro Bundler:**

```bash
cd mobile
npm start
```

**Terminal 2 - Run on Android Device:**

```bash
cd mobile
npm run android
```

### **Method 2: Single Command**

```bash
cd mobile
npm run android
# Metro starts automatically
```

---

## 🌐 Step 6: Configure API URL for Physical Device

Your phone needs to connect to your backend. The emulator URL (`10.0.2.2`) won't work.

### **Find Your Computer's Local IP:**

**Windows:**

```bash
ipconfig
```

Look for **"IPv4 Address"** under your active network adapter (WiFi or Ethernet).

Example: `192.168.1.5`

**macOS/Linux:**

```bash
ifconfig | grep "inet "
# Or
ip addr show
```

### **Update API Configuration:**

Edit: `mobile/src/config/api.config.ts`

```typescript
import { Platform } from "react-native";

const getApiUrl = () => {
  if (Platform.OS === "android") {
    // For physical device: use your computer's local IP
    return "http://192.168.1.5:3001"; // <-- Replace with YOUR IP
  }

  if (Platform.OS === "ios") {
    return "http://localhost:3001";
  }

  return "http://localhost:3001";
};

export const API_BASE_URL = getApiUrl();
export const API_TIMEOUT = 30000;
```

### **Important:**

1. **Your phone and computer must be on the SAME WiFi network**
2. **Replace `192.168.1.5` with YOUR computer's actual IP**
3. **Make sure backend is running:**
   ```bash
   cd backend
   npm run start:dev
   ```
4. **Check firewall:** Windows Firewall might block port 3001. Allow it if prompted.

---

## 🎉 Success Indicators

When everything works, you'll see:

### **In Terminal:**

```
info Launching emulator...
info Successfully launched emulator.
info Installing the app...
BUILD SUCCESSFUL
info Installing the app on the device...
```

### **On Your Phone:**

- App opens automatically
- You see the React Native welcome screen or your app UI
- Hot reload works when you save files

---

## 🔥 Hot Reload / Fast Refresh

Once the app is running:

1. **Shake your phone** (or press Ctrl+M in terminal)
2. Enable **"Fast Refresh"**
3. Now when you save code changes, the app updates automatically!

---

## 🐛 Common Issues & Solutions

### **Issue 1: "Could not connect to development server"**

**Cause:** Phone can't reach your computer.

**Solution:**

1. Verify both devices on same WiFi
2. Check your computer's IP is correct in `api.config.ts`
3. Try disabling computer firewall temporarily
4. Restart Metro: Press Ctrl+C, then `npm start`

**OR use ADB reverse (alternative):**

```bash
adb reverse tcp:8081 tcp:8081
adb reverse tcp:3001 tcp:3001
npm start
```

### **Issue 2: "App installed but showing old version"**

**Solution:**

```bash
# Uninstall from phone
adb uninstall com.cricketappmobile

# Reinstall
npm run android
```

### **Issue 3: "Build failed"**

**Solution:**

```bash
cd mobile/android
./gradlew clean
cd ../..
npm run android
```

### **Issue 4: "Metro port already in use"**

**Solution:**

```bash
# Kill Metro
npx react-native start --reset-cache

# Or change port
npx react-native start --port 8088
```

---

## 🎯 Quick Command Reference

```bash
# Check connected devices
adb devices

# Restart ADB
adb kill-server
adb start-server

# Uninstall app from phone
adb uninstall com.cricketappmobile

# View device logs (helpful for debugging)
adb logcat | grep "ReactNative"

# Clear app data
adb shell pm clear com.cricketappmobile

# Forward ports (if WiFi not working)
adb reverse tcp:8081 tcp:8081
adb reverse tcp:3001 tcp:3001

# Run on specific device (if multiple connected)
adb -s DEVICE_ID install app.apk
```

---

## 📊 Comparison: Emulator vs Physical Device

| Feature              | Emulator | Physical Device |
| -------------------- | -------- | --------------- |
| **Speed**            | Slow     | ⚡ Fast         |
| **Real Experience**  | ❌       | ✅              |
| **Camera/GPS**       | Limited  | ✅ Real         |
| **Performance Test** | ❌       | ✅              |
| **Setup**            | Complex  | ✅ Easy         |
| **Recommendation**   | ❌       | ✅ **Use This** |

---

## ✨ Pro Tips

1. **Keep USB Debugging ON** while developing
2. **Use "Stay Awake"** in Developer Options (screen won't sleep while charging)
3. **Enable "Show taps"** in Developer Options to demo your app
4. **Use `adb reverse`** if WiFi connection is unstable
5. **Install "Expo Go" app** as backup if you need quick testing

---

## 🎯 Final Checklist

Before running `npm run android` on physical device:

- [ ] Developer options enabled on phone
- [ ] USB debugging enabled
- [ ] Phone connected via USB
- [ ] `adb devices` shows your device as "device" (not unauthorized/offline)
- [ ] Same WiFi network for phone and computer
- [ ] Computer's local IP address noted
- [ ] `api.config.ts` updated with correct IP
- [ ] Backend running on port 3001
- [ ] Metro bundler ready

**If all ✅, run: `npm run android` and your app will launch on your phone! 🚀**

---

## 🚀 Quick Start Commands

```bash
# Terminal 1: Start Backend
cd backend
npm run start:dev

# Terminal 2: Start Metro
cd mobile
npm start

# Terminal 3: Run on Device
cd mobile
npm run android
```

---

## 📖 Next Steps

Once your app is running on your phone:

1. **Test Hot Reload:** Change `App.tsx` and save
2. **Debug:** Shake phone → "Debug" → Opens Chrome DevTools
3. **Element Inspector:** Shake phone → "Show Inspector"
4. **Performance Monitor:** Shake phone → "Performance Monitor"

---

**🎉 Congratulations! You're now developing directly on your phone - MUCH faster than the emulator! 🏏📱**



