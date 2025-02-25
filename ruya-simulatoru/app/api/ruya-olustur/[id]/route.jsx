import { NextResponse } from "next/server";
import connectToDatabase from "../../../libs/mongodb";
import Ruya from "../../../models/Ruya";
export async function GET(req,{params}) {
  try {
    await connectToDatabase();
const {id}=params;

const myStory=await Ruya.findById(id);
if(!myStory){
  NextResponse.json({error:"Ruya bulunamadı "},{status:404})
}
return NextResponse.json({id:myStory._id,story:myStory.story,mekan: myStory.mekan,image:myStory.image_url},{status:200})
 } catch (error) {
  console.error('Hata:', error);
  return NextResponse.json({ error: 'Bir hata oluştu.' }, { status: 500 });
  }
}


export async function PUT(req, context) {
  await connectToDatabase();
  try {
    const params = await context.params;
    const { id } = params;
    const { isShare } = await req.json();

    const shareStory = await Ruya.findByIdAndUpdate(
      id,
      {
        isShare,
      },
      { new: true }
    );

    if (!shareStory) {
      return NextResponse.json({ error: "Ruya güncellenemedi" }, { status: 404 });
    }
    return NextResponse.json({ id: shareStory._id, isShare: shareStory.isShare }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}