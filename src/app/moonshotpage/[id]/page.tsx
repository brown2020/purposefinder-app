import SharePage from "@/componentPages/SharePage";
import { adminDb } from "@/firebase/firebaseAdmin";
import { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export default async function MoonshotShare({ params }: Props) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  return <SharePage userId={id} version="moonshot" />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const userId = resolvedParams.id;

  let imageUrl = "";
  let sharableUrl = false;

  try {
    const docRef = adminDb.collection("users").doc(userId).collection("moonshot").doc("main");
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      imageUrl = data?.moonshotCoverImage || "";
      sharableUrl = data?.moonshotSharableUrl || false;
    } else {
      console.log("No such document!");
    }
  
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error getting document:", error.message);
    } else {
      console.error("An unknown error occurred while getting the document.");
    }
  }

  const shareUrl =
    sharableUrl && imageUrl ? imageUrl : "https://assets/falcon.jpeg";

  return {
    metadataBase: new URL("https://purposefinder.ai"),
    title: "Check out my Moonshot!",
    description: "I just created my Moonshot with PurposeFinder.ai",
    openGraph: {
      title: "Check out my Moonshot!",
      description: "I just created my Moonshot with PurposeFinder.ai",
      url: `https://purposefinder.ai/moonshotpage/${userId}`,
      siteName: "PurposeFinder.ai",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: shareUrl,
          width: 512,
          height: 512,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Check out my Moonshot!",
      description: "I just created my Moonshot with PurposeFinder.ai",
      images: [shareUrl],
    },
  };
}
