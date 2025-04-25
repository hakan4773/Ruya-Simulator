## Proje Hakkında
Rüya Simülatörü, kullanıcıların rüya gibi hikâyeler oluşturmasını sağlamak için tasarlanmıştır. Tonlar (ör. huzurlu, korkutucu), mekânlar (ör. orman, okyanus), eylemler (ör. uçmak, koşmak), karakterler (ör. tek boynuzlu at, hayalet) ve olaylar (ör. fırtına, keşif) gibi önceden tanımlı öğeleri birleştirerek dinamik anlatılar üretir. Amaç, interaktif bir hikâye anlatımı deneyimi sunarak kullanıcıların bir rüyada geziniyormuş gibi hissetmesini sağlamaktır. İsteğe bağlı olarak, üretilen hikâyeler OpenAI API'si ile görselleştirilebilir.

## Özellikler
- **Dinamik Hikâye Üretimi**: Kullanıcı seçimlerine veya rastgele seçimlere dayalı benzersiz hikâyeler oluşturur.
- **JSON Tabanlı Veri**: Tonlar, mekânlar ve diğer öğeler için modüler ve genişletilebilir bir yapı.
- **Doğal Dil Akışı**: Hikâyeler, akıcı bir anlatım için bağlaçlarla birleştirilir.
- **Görsel Üretim (İsteğe Bağlı)**: Hikâyeleri görselleştirmek için OpenAI ile entegrasyon
- **Özelleştirilebilir**: JSON verilerine yeni tonlar, mekânlar veya öğeler kolayca eklenebilir.

## Nasıl Çalışır
1. **Giriş**: Kullanıcı, bir ton, mekân, eylem, karakter ve olay kombinasyonu seçer veya sistem rastgele seçim yapar.
2. **Hikâye Üretimi**:
   - Sistem, JSON dosyasındaki her kategoriden bir cümle veya tanım çeker.
   - Cümleler belirli bir sırayla (ton → mekân → eylem → karakter → olay) birleştirilir.
   - Doğal bağlaçlar (ör. "ve", "birden") kullanılarak akıcı bir paragraf oluşturulur.
3. **Çıktı**: Kısa bir hikâye üretilir. İsteğe bağlı olarak, hikâye OpenAI API'sine gönderilerek görselleştirilir.
4. **Örnek**:
   - Giriş: `heyecanlı + dağ + uçmak + gezgin + buluşma`
   - Çıktı: *"Bu unutulmaz bir macera! Bulutları delen heybetli zirveler sessizce yükseliyor. Özgürlük hissiyle havada süzülüyorum. Birden, yüzünde hikâyeler taşıyan yorgun bir gezgin beliriyor ve sisler arasından tanıdık bir yüz ortaya çıkıyor."*
