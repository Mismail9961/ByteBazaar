import Seo from "@/models/Seo";
import connectDB from "@/config/db";
export async function PUT(req) {
  await connectDB();
  
  const body = await req.json();

  const updatedSeo = await Seo.findOneAndUpdate({}, body, {
    new: true,
    upsert: true,
  });

  return Response.json({ success: true, seo: updatedSeo });
}
