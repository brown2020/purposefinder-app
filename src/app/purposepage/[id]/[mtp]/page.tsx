import SharePage from "@/componentPages/SharePage";
import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Metadata, ResolvingMetadata } from "next";

type Props = { params: { id: string; mtp: string } };

export default function Mtp({ params: { id, mtp } }: Props) {
  return <SharePage userId={id} version="purpose" itemId={mtp} />;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const userId = params.id;
  const mtp = params.mtp;
  let imageUrl: string = "";
  let sharableUrl: boolean = false;

  const fetchImageUrl = async () => {
    try {
      const docRef = doc(db, `users/${userId}/purpose/${mtp}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        imageUrl = docSnap.data().mtpCoverImage;
        sharableUrl = docSnap.data().mtpSharableUrl;
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
