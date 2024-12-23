import SharePage from "@/componentPages/SharePage";
import { adminDb } from "@/firebase/firebaseAdmin";
import { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export default async function Mtp({ params }: Props) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  return <SharePage userId={id} version="purpose" />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const userId = resolvedParams.id;

  let imageUrl = "";
  let sharableUrl = false;

  try {
    const docRef = adminDb.collection("users").doc(userId).collection("purpose").doc("main");
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      console.log('data :>> ', data);
      imageUrl = data?.mtpCoverImage || "";
      sharableUrl = data?.mtpSharableUrl || false;
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
    title: "Check out my MTP!",
    description: "I just created my MTP with Purpose Finder",

    openGraph: {
      title: "Check out my MTP!",
      description: "I just created my MTP with Purpose Finder!",
      url: `https://purposefinder.ai/purposepage/${userId}`,
      siteName: "Purpose Finder",
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
      title: "Check out my MTP!",
      description: "I just created my MTP with Purpose Finder",
      images: [shareUrl],
    },
  };
}
