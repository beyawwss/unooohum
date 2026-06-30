# 🎮 UNO Discord Bot (discord.js v14)

Bot UNO multiplayer berbasis Slash Command, Button, dan Select Menu — tanpa mengetik command selama permainan.

## 📁 Struktur Project

```
uno-bot/
├── commands/        → /unocreate, /unoleaderboard, /unoprofile, /unotitle, /unoowner
├── events/          → ready.js, interactionCreate.js
├── handlers/        → command/event loader, button & select menu router, game flow
├── games/           → Card, Deck, UnoGame (engine), roomManager, emoji map
├── database/          → db.js (JSON file store, tanpa native compile) + models/Player.js
├── utils/           → embeds, components (button/select builder), logger, cooldown
├── data/            → uno.json dibuat otomatis di sini (JANGAN dihapus manual)
├── index.js         → entry point bot
└── deploy-commands.js → register slash command ke Discord
```

## ⚙️ 1. Setup Lokal (Visual Studio Code)

1. Pastikan **Node.js 18+** terinstal (`node -v`).
2. Extract project ini, buka folder-nya di VS Code.
3. Buka terminal VS Code, jalankan:
   ```bash
   npm install
   ```
4. Duplikat file `.env.example` menjadi `.env`, lalu isi:
   ```
   DISCORD_TOKEN=token_bot_kamu
   CLIENT_ID=application_id_bot
   GUILD_ID=id_server_untuk_testing   # kosongkan untuk deploy global
   OWNER_IDS=user_id_kamu,user_id_lain
   HAND_DELIVERY=ephemeral            # atau "dm"
   ```
   - Ambil **Token** & **Client ID** dari https://discord.com/developers/applications
   - Aktifkan intent **"Message Content Intent"** tidak wajib untuk bot ini (semua via slash/button), tapi pastikan **Server Members Intent** boleh dimatikan juga karena bot ini tidak butuh itu.
5. Daftarkan slash command (sekali saja, ulangi jika ada command baru):
   ```bash
   npm run deploy
   ```
6. Jalankan bot:
   ```bash
   npm start
   ```
7. Invite bot ke server dengan scope `bot applications.commands` dan permission minimal: Send Messages, Embed Links, Use External Emojis, Read Message History.

> **Penting — Emoji Kartu:** Emoji kartu pada `games/cardEmojis.js` menggunakan ID emoji custom yang kamu berikan. Emoji tersebut harus berasal dari server tempat bot kamu menjadi member (atau bot perlu permission **Use External Emojis** dan emoji harus public/diakses bot). Jika emoji tidak muncul (`❓`), upload ulang emoji UNO ke server kamu dan ganti ID-nya di `games/cardEmojis.js`.

## ☁️ 2. Deploy ke Railway (Bot Online 24 Jam)

### A. Push project ke GitHub
```bash
git init
git add .
git commit -m "Initial commit UNO bot"
git branch -M main
git remote add origin https://github.com/username/uno-bot.git
git push -u origin main
```
(`.env` dan folder `data/` tidak ikut ter-push karena sudah ada di `.gitignore` — itu memang seharusnya.)

### B. Buat Project di Railway
1. Buka https://railway.app → **New Project** → **Deploy from GitHub repo**.
2. Pilih repository `uno-bot` kamu.
3. Railway otomatis mendeteksi project Node.js (lewat `package.json`) dan menjalankan `npm install` lalu `npm start`.

### C. Set Environment Variables
Di tab **Variables** pada service Railway, tambahkan satu-satu (sama seperti isi `.env`):
```
DISCORD_TOKEN=...
CLIENT_ID=...
GUILD_ID=...        (boleh dikosongkan untuk global)
OWNER_IDS=...
HAND_DELIVERY=ephemeral
```

### D. Aktifkan Penyimpanan Data Otomatis (Volume)
Database (`data/uno.json`) disimpan ke **file lokal**, tapi filesystem Railway bersifat sementara (reset saat redeploy) **kecuali** kamu pasang Volume:

1. Di service Railway → tab **Settings** → scroll ke **Volumes** → **+ New Volume**.
2. Set **Mount Path** ke: `/app/data`
3. Klik **Add**, lalu **Redeploy** service.

Sekarang folder `data/` (berisi `uno.json`) akan persisten — semua data player, leaderboard, coin, xp, dan match history otomatis tersimpan ke file dan tidak hilang walau bot di-restart/redeploy.

### E. Deploy Slash Command (sekali setelah deploy pertama)
Karena `deploy-commands.js` terpisah dari `index.js` (agar tidak register ulang setiap restart), jalankan sekali lewat Railway:
1. Buka service → tab **Settings** → **Deploy** → gunakan **Railway CLI**, atau
2. Cara termudah: jalankan `npm run deploy` dari **lokal** (laptop kamu) — karena dia hanya butuh `DISCORD_TOKEN` & `CLIENT_ID` yang sama, hasil registrasi command berlaku global ke bot kamu, tidak perlu dijalankan dari server Railway.

### F. Selesai
Buka tab **Deployments** → pastikan status **Active** dan log menampilkan `Bot online sebagai NamaBot#0000`. Bot sekarang online 24 jam selama project Railway aktif (gunakan plan yang sesuai kuota jam Railway kamu).

## 🎲 Cara Bermain
1. `/unocreate` → buat room, pemain lain klik **Join**.
2. Host klik **Start** (min. 2 pemain) → kartu otomatis dikirim ephemeral/DM ke tiap pemain.
3. Saat giliranmu: klik **Pilih Kartu** untuk membuka select menu kartu di tangan, atau **Draw Card** untuk mengambil kartu.
4. Kartu Wild/Wild+4 akan memunculkan select menu warna setelah dipilih.
5. Saat kartu tersisa 1, klik **UNO!**; pemain lain bisa klik **Catch UNO** jika kamu lupa.
6. Game otomatis berakhir saat kartu seorang pemain habis — leaderboard, XP, dan coin otomatis ter-update.

## 🛠️ Command Owner
Gunakan `/unoowner` (hanya untuk ID yang ada di `OWNER_IDS`): resetplayer, resetleaderboard, addcoin/removecoin, addxp/removexp, givetitle/removetitle, forcestart, forcestop, endgame, reload, maintenance, blacklist, whitelist.

## 🔧 Konfigurasi Tambahan
Semua bisa diubah di `config/config.js`: max player default, ukuran tangan awal, timeout room/giliran, aktif/nonaktif stack +2/+4, reward coin & XP, hingga warna embed.
