# Basit AB Asgari Ücret Haritası

Bu repoda bulunan `index.html` dosyasında Avrupa Birliği ülkelerini temsil eden basitleştirilmiş bir SVG haritası bulunmaktadır. Harita üzerinde bir ülkeye tıklandığında `script.js` dosyasındaki veriler kullanılarak o ülkenin aylık minimum ücreti gösterilir.

## Dosyalar

- `index.html` - Ana sayfada yer alan SVG harita
- `styles.css` - Harita ve sayfa için basit stil dosyası
- `script.js` - Ülkelere tıklanınca bilgiyi gösteren JavaScript dosyası

Ülkelerin konumları gerçek haritaya göre sadeleştirilmiş şekilde temsil edilmiştir. Asgari ücret değerleri örnek olarak eklenmiştir; güncel bilgiler için `script.js` içindeki `wages` nesnesini güncellemeniz gerekir.

Bu örnek statik dosyalar üzerine kurulu olduğu için Vercel'de kolayca dağıtılabilir. Projeyi kendi bilgisayarınızda görüntülemek için sadece bir web sunucusunda dosyaları barındırmanız yeterlidir.
