# 📱 วิธีคอมไพล์โปรเจกต์เป็นไฟล์ APK & Android App Bundle (AAB)

ยินดีด้วย! โปรเจกต์ Android Studio ของคุณได้รับการสร้างอย่างสมบูรณ์แล้วพร้อมซอร์สโค้ด HTML5, CSS, JS ในโฟลเดอร์ `app/src/main/assets/`

---

## 🚀 วิธีที่ 1: เปิดด้วย Android Studio (แนะนำ)
1. ติดตั้ง **Android Studio** (เวอร์ชันล่าสุด Iguana / Jellyfish / Koala)
2. แตกไฟล์ ZIP นี้ลงในคอมพิวเตอร์ของคุณ
3. เปิด Android Studio แล้วเลือก **Open...** จากนั้นเลือกโฟลเดอร์นี้
4. รอ Gradle Sync เสร็จสิ้น
5. สั่ง Build:
   - **สำหรับทดสอบในเครื่อง (APK):** ไปที่เมนู **Build > Build Bundle(s) / APK(s) > Build APK(s)**
   - **สำหรับอัปโหลด Google Play Store (AAB):** ไปที่เมนู **Build > Generate Signed Bundle / APK...**

---

## ⚡ วิธีที่ 2: คอมไพล์ด้วยคำสั่ง Command Line (CLI)
### สร้างไฟล์ APK:
```bash
./gradlew assembleDebug
```
*(ไฟล์อยู่ที่ `app/build/outputs/apk/debug/app-debug.apk`)*

### สร้างไฟล์ AAB สำหรับ Google Play Store:
```bash
./gradlew bundleRelease
```
*(ไฟล์อยู่ที่ `app/build/outputs/bundle/release/app-release.aab`)*

---

## 📱 ฟีเจอร์ที่เปิดใช้งานในโปรเจกต์นี้:
- **Target SDK:** Android 14 (API 34)
- **Min SDK:** Android 24
- **AdMob Ads:** ปิด
- **Biometric Auth:** ปิด
- **Offline Cache:** เปิดใช้งาน
- **Pull to Refresh:** เปิดใช้งาน
- **Hardware Acceleration:** เปิดใช้งาน
