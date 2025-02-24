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