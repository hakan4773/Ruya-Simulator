import { NextResponse } from "next/server";
import connectToDatabase from "../../libs/mongodb";
import Ruya from "../../models/Ruya";
import sablonlar from "../../data/RuyaTonlari.json";
import axios from "axios";

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}
export async function POST(request) {
  await connectToDatabase();
  try {
    const { mekan, eylem, karakter, ton } = await request.json();

    if (!mekan || !eylem || !karakter || !ton) {
      return NextResponse.json(
        { error: "Tüm alanlar gereklidir." },
        { status: 400 }
      );
    }

    if (
      !sablonlar.mekanlar.includes(mekan) ||
      !sablonlar.eylemler.includes(eylem) ||
      !sablonlar.karakterler.includes(karakter) ||
      !sablonlar.tonlar[ton]
    ) {
      return NextResponse.json(
        { error: "Geçersiz veri girdiniz." },
        { status: 400 }
      );
    }

    const tonCumlesi = getRandomItem(sablonlar.tonlar[ton]);
    const tonDescriptions = {
      peaceful: "peaceful, calm atmosphere",
      tense: "tense, dark atmosphere",
      comic: "funny, quirky atmosphere",
      scary: "scary, eerie atmosphere",
      excited: "exciting, adventurous atmosphere",
    };
    const storyPrompt = `A story about a ${karakter} who was ${eylem} in ${mekan}, in a ${tonDescriptions[ton]}. The ${karakter} said, "${tonCumlesi}"`;
    const INFERKIT_API_KEY = process.env.INFERKIT_API_KEY;

    if (!INFERKIT_API_KEY) {
      throw new Error("INFERKIT_API_KEY environment variable is missing.");
    }

    let story = "";
    try {
      const storyResponse = await axios.post(
        "https://api.inferkit.ai/v1/chat/completions",
        {
          messages: [
            {
              role: "system",
              content:
                "You are a creative storyteller, skilled in generating engaging stories.",
            },
            { role: "user", content: storyPrompt },
          ],
          model: "gpt-3.5-turbo",
          temperature: 0.88,
          max_length: 100,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0.6,
        },
        {
          headers: {
            Authorization: `Bearer ${INFERKIT_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      story = storyResponse.data.choices[0].message.content;
    } catch (storyError) {
      console.error("Hikaye oluşturma hatası:", {
        message: storyError.message,
        code: storyError.code,
        response: storyError.response?.data || "No response",
      });
      story = `${karakter}, ${mekan}’da ${eylem} yaparken ‘${tonCumlesi}’ dedi.`;
    }

    const prompt = `${karakter} ${eylem} in ${mekan}, surreal, ${
      sablonlar.tonlar[ton] || "dreamy"
    }, highly detailed, dreamy style.`;
    const EDENAI_API_KEY = process.env.EDENAI_API_KEY;

    if (!EDENAI_API_KEY) {
      throw new Error("EDENAI_API_KEY environment variable is missing.");
    }

    const imageOptions = {
      method: "POST",
      url: "https://api.edenai.run/v2/image/generation",
      headers: {
        authorization: `Bearer ${EDENAI_API_KEY}`,
      },
      data: {
        providers: "openai",
        text: prompt,
        resolution: "1024x1024",
      },
    };

    let imageUrl = null;
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
      console.error("Görsel oluşturma hatası:", {
        message: imageError.message,
        response: imageError.response?.data || "No response data",
      });
      return NextResponse.json(
        { error: "Görsel oluşturma hatası: " + imageError.message },
        { status: 500 }
      );
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

    return NextResponse.json(
      { id: ruya._id, story, image: imageUrl },
      { status: 201 }
    );
  } catch (error) {
    console.error("Hata:", error);
    return NextResponse.json(
      { error: error.message || "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
