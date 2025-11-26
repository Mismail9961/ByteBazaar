import Seo from "@/models/Seo";
import connectDB from "@/config/db";

export async function GET() {
  await connectDB();
  
  let seo = await Seo.findOne();
  if (!seo) {
    seo = await Seo.create({
      title: "Default Title",
      description: "Default description",
      keywords: ["default", "keywords"],
      openGraph: {
        title: "Default OG Title",
        description: "Default OG Description",
        url: "",
        siteName: "",
        locale: "en_US",
        type: "website",
      },
    });
  }

  return Response.json(seo);
}
