import SharePage from "@/componentPages/SharePage";
import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Metadata } from "next";

type Props = { params: { id: string } };

export default function Mtp({ params: { id } }: Props) {
  return <SharePage userId={id} version="purpose" />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const userId = params.id;
  let imageUrl: string = "";
  let sharableUrl: boolean = false;

  const fetchImageUrl = async () => {
    try {
      const docRef = doc(db, `users/${userId}/purpose/main`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        imageUrl = docSnap.data().mtpCoverImage;
        sharableUrl = docSnap.data().mtpSharableUrl;
      } else {
        console.log("No such document!");
        imageUrl = "";
        sharableUrl = false;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Error getting document:", error.message);
      } else {
        console.log("An unknown error occurred while getting the document.");
      }
      imageUrl = "";
      sharableUrl = false;
    } finally {
      if (sharableUrl && imageUrl) return imageUrl;
      return "https://assets/falcon.jpeg";
    }
  };

  const shareUrl = await fetchImageUrl();

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
