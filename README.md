# Qompres 🖼️

**Kompres gambar tanpa mengurangi kualitas — 100% di browser, 100% gratis.**

Qompres adalah image compressor berbasis web yang memperkecil ukuran gambar JPG, PNG, WebP, dan SVG langsung di sisi klien (client-side). Tidak ada file yang pernah diunggah ke server mana pun — seluruh proses kompresi berjalan menggunakan JavaScript di browser pengguna.

> 🔒 Privasi terjaga · ⚡ Proses instan · 💸 Tanpa biaya · 🧱 Tanpa backend

---

## ✨ Fitur Utama

- **Drag & drop atau pilih file** — mendukung multi-file upload sekaligus.
- **Kontrol kompresi penuh** — slider kualitas (10–100%), resize maks. lebar/tinggi, dan pilihan format output (JPG, PNG, WebP).
- **Preview sebelum/sesudah** — menampilkan ukuran file, dimensi gambar, dan persentase penghematan secara real-time.
- **Download hasil** — satu klik untuk mengunduh gambar yang sudah dikompres (mendukung multi-file).
- **Dark mode** — toggle tema gelap/terang yang konsisten di seluruh halaman.
- **100% privat** — tidak ada server, tidak ada database, tidak ada tracking gambar.
- **Responsive** — tampilan dioptimalkan untuk desktop, tablet, dan mobile.
- **SEO-ready** — lengkap dengan meta tag, Open Graph, dan Twitter Card.

---

## 🛠️ Teknologi yang Digunakan

| Layer       | Teknologi                                                                 |
|-------------|----------------------------------------------------------------------------|
| Markup      | HTML5 semantik                                                            |
| Styling     | CSS3 (custom properties, grid, flexbox, dark mode via `class` toggle)     |
| Logic       | Vanilla JavaScript (ES6+), tanpa framework, tanpa build step              |
| Kompresi    | [`browser-image-compression`](https://github.com/Donaldcwl/browser-image-compression) (via CDN) |
| Font        | [Sora](https://fonts.google.com/specimen/Sora), [Inter](https://fonts.google.com/specimen/Inter), [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (Google Fonts) |
| Hosting     | Static hosting apa pun — GitHub Pages, Netlify, Vercel, Cloudflare Pages  |

Tidak ada backend, tidak ada database, dan tidak ada langkah build (no Webpack/Vite) — cukup buka `index.html`.

---

## 🚀 Cara Menjalankan Secara Lokal

Karena proyek ini murni statis (HTML/CSS/JS tanpa build step), kamu punya dua opsi:

### Opsi 1 — Buka langsung
Klik dua kali `index.html`, atau buka lewat browser:

```bash
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

### Opsi 2 — Jalankan local server (disarankan)
Beberapa browser membatasi fitur tertentu saat dibuka via `file://`. Gunakan server lokal sederhana:

```bash
# Dengan Python
python3 -m http.server 8080

# Atau dengan Node.js
npx serve .
```

Lalu buka `http://localhost:8080` di browser.

---

## ☁️ Cara Deploy ke Netlify

### Drag & drop (tercepat)
1. Buka [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag folder `Qompres/` ke halaman tersebut.
3. Selesai — Netlify otomatis memberikan URL live.

### Lewat Git (disarankan untuk update berkelanjutan)
1. Push proyek ini ke repository GitHub.
2. Di [Netlify](https://app.netlify.com), pilih **Add new site → Import an existing project**.
3. Hubungkan repository GitHub kamu.
4. Build command: *(kosongkan, tidak diperlukan)*.
5. Publish directory: `.` (root proyek).
6. Klik **Deploy site**.

Proyek ini juga bisa langsung di-deploy ke **GitHub Pages** (Settings → Pages → pilih branch `main`, folder root) atau **Vercel** (Import Project → Framework Preset: *Other*) dengan langkah yang serupa, karena tidak ada proses build yang dibutuhkan.

---

## 📁 Struktur Folder

```
Qompres/
│
├── index.html              # Struktur halaman (HTML murni)
├── README.md                # Dokumentasi proyek
│
├── css/
│   └── style.css            # Seluruh styling (design tokens, layout, dark mode, animasi)
│
├── js/
│   └── app.js                # Logic aplikasi (theme toggle, scroll reveal, FAQ, compressor)
│
├── assets/
│   ├── logo.svg               # Logo utama (navbar & footer)
│   ├── favicon.svg            # Favicon — versi simplifikasi dari logo
│   └── icons/                  # Reserved untuk aset ikon brand di masa depan
│
└── screenshots/             # Tangkapan layar untuk dokumentasi/README
```

---

## 📸 Screenshots

> Tambahkan tangkapan layar aplikasi di folder `screenshots/`, lalu sertakan di sini.

| Light Mode | Dark Mode |
|------------|-----------|
| ![Hero light mode](screenshots/hero.png) | ![App dark mode](screenshots/app-dark.png) |

---

## 🗺️ Roadmap Singkat

- [ ] Dukungan kompresi batch dengan progress bar per file
- [ ] Drag-to-reorder untuk antrian multi-file
- [ ] PWA (instalasi & dukungan offline)
- [ ] Perbandingan kualitas dengan slider before/after interaktif

Kontribusi dan saran sangat terbuka — silakan buka *issue* atau *pull request*.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [Lisensi MIT](LICENSE) — bebas digunakan, dimodifikasi, dan didistribusikan untuk keperluan pribadi maupun komersial, dengan tetap menyertakan atribusi.

---

<p align="center">Dibuat dengan 💚 untuk siapa pun yang ingin gambar lebih ringkas, tanpa ribet.</p>
