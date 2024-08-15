import SharePage from "@/componentPages/SharePage";
import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Metadata, ResolvingMetadata } from "next";

type Props = { params: { id: string } };

export default function MoonshotShare({ params: { id } }: Props) {
  return <SharePage userId={id} version="moonshot" />;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const userId = params.id;
  let imageUrl: string = "";
  let sharableUrl: boolean = false;

  const fetchImageUrl = async () => {
    try {
      const docRef = doc(db, `users/${userId}/moonshot/main`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        imageUrl = docSnap.data().moonshotCoverImage;
        sharableUrl = docSnap.data().moonshotSharableUrl;
      } else {
        console.log("No such document!");
        imageUrl = "";
        sharableUrl = false;
      }
    } catch (error: any) {
      console.log("Error getting document:", error.message);
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
