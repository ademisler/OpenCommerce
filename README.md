# Basit AB Asgari Ücret Haritası

Bu repoda bulunan `index.html` dosyası, Avrupa Birliği ülkelerini gösteren bir harita ve ülkeye tıklanınca o ülkenin aylık minimum ücretini gösteren basit bir örnektir. Harita olarak Wikipedia'dan alınan bir SVG kullanılmıştır. Ülkeler için path id'leri SVG dosyasındaki id'lerle eşleşmelidir.

## Dosyalar

- `index.html` - Ana sayfa
- `styles.css` - Basit stil dosyası
- `script.js` - Ülkelere tıklanınca bilgiyi gösteren JavaScript dosyası

Harita üzerindeki ülkelerin id'leri SVG dosyasına göre düzenlenmiştir. Eğer farklı bir harita kullanmak isterseniz `script.js` içerisindeki id eşleşmelerini güncellemeniz gerekebilir.

Asgari ücretler tamamen örnek amaçlıdır ve güncelliği garanti edilmez. Güncel değerleri araştırarak `script.js` içindeki `wages` nesnesini güncelleyebilirsiniz.

Bu örnek statik dosyalar üzerine kurulu olduğu için Vercel'de kolayca dağıtılabilir. Sadece bu dosyaları barındırmanız yeterlidir.
