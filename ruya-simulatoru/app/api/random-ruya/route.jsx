// app/api/random-dream/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '../../libs/mongodb';
import sablonlar from '../../data/RuyaTonlari.json';
import axios from 'axios';
import Ruya from "../../models/Ruya";

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export async function GET() {
  await connectToDatabase();
  try {

    // Rastgele değerler seç
    const mekan = getRandomItem(sablonlar.mekanlar);
    const eylem = getRandomItem(sablonlar.eylemler);
    const karakter = getRandomItem(sablonlar.karakterler);
    const ton = getRandomItem(Object.keys(sablonlar.tonlar));
    const tonCumlesi = getRandomItem(sablonlar.tonlar[ton]);

    const tonDescriptions = {
      peaceful: "peaceful, calm atmosphere",
      tense: "tense, dark atmosphere",
      comic: "funny, quirky atmosphere",
      scary: "scary, eerie atmosphere",
      excited: "exciting, adventurous atmosphere",
      horror: "scary, eerie atmosphere"
    };

    // Hikaye oluştur
    const storyPrompt = `Create a detailed, engaging story of at least 100 words about a ${karakter}, who was ${eylem} in ${mekan}. The story should have a clear beginning, middle, and end, maintaining a ${tonDescriptions[ton]} throughout. Describe the ${mekan} vividly, highlight its unique features, and give the ${karakter} a clear motivation or challenge. The ${karakter} should say, "${tonCumlesi}" at a pivotal moment, driving the plot forward. Ensure the narrative is immersive and includes at least one unexpected twist or event.`;
    const INFERKIT_API_KEY = process.env.INFERKIT_API_KEY;

    let story = '';
    try {
      const storyResponse = await axios.post(
        'https://api.inferkit.ai/v1/chat/completions',
        {
          messages: [
            { role: "system", content: "You are a creative storyteller, skilled in generating engaging stories." },
            { role: "user", content: storyPrompt }
          ],
          model: 'gpt-3.5-turbo',
          temperature: 0.88,
          max_length: 100,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0.6
        },
        {
          headers: {
            Authorization: `Bearer ${INFERKIT_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('InferKit Yanıtı:', storyResponse.data);
      story = storyResponse.data.choices[0].message.content;
    } catch (storyError) {
      console.error('Hikaye oluşturma hatası:', storyError.message);
      story = `${karakter}, ${mekan}’da ${eylem} yaparken ‘${tonCumlesi}’ dedi.`;
    }

    // Resim oluştur
    const imagePrompt = `${karakter} ${eylem} in ${mekan}, surreal, ${tonDescriptions[ton]}, highly detailed, dreamy style.`;
    const EDENAI_API_KEY = process.env.EDENAI_API_KEY;
    let imageUrl = null;
   
        const imageOptions = {
            method: "POST",
           url: "https://api.edenai.run/v2/image/generation",
            headers: {
              authorization: `Bearer ${EDENAI_API_KEY}`,
            },
            data: {
              providers: "openai",
              text: imagePrompt,
              resolution: "1024x1024",
            },
          };
          try {
            const imageResponse = await axios.request(imageOptions);
            console.log("API Yanıtı:", JSON.stringify(imageResponse.data, null, 2));
      
            if (
              imageResponse.data.openai?.items &&
              imageResponse.data.openai.items.length > 0
            ) {
              const firstItem = imageResponse.data.openai.items[0];
              if (firstItem.url) {
                imageUrl = firstItem.url;
              } else if (firstItem.image) {
                imageUrl = firstItem.image;
              } else {
                console.error("Beklenen URL veya image alanı bulunamadı:", firstItem);
                throw new Error("API görsel URL’si döndürmedi.");
              }
            } else {
              throw new Error("API items dizisi boş veya eksik.");
            }

    } catch (imageError) {
      console.warn('Görsel oluşturma hatası:', imageError.message);
    }

    const ruya = new Ruya({
      story,
      mekan,
      eylem,
      karakter,
      ton,
      image_url: imageUrl,
      sound_url: null,
    });

    await ruya.save();

    return NextResponse.json({ id: ruya._id, story, image: imageUrl }, { status: 200 });
  } catch (error) {
    console.error('Hata:', error);
    return NextResponse.json({ error: error.message || 'Bir hata oluştu.' }, { status: 500 });
  }
}