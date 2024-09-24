import Image from "next/image";

interface SidebarImageProps {
  currentSet: "intro" | "purpose" | "moonshot";
}

function SidebarImage({ currentSet }: SidebarImageProps) {
  const imagePaths = {
    intro: "/assets/bg_sidebar_intro.jpg",
    purpose: "/assets/bg_sidebar_purpose.jpg",
    moonshot: "/assets/bg_sidebar_moonrise.jpg",
  };
  return (
    <div className="w-full md:w-1/2 relative min-h-[300px]">
      <Image
        src={imagePaths[currentSet]}
        alt={`${currentSet} image`}
        width={350}
        height={350}
        className="h-full w-full object-cover max-h-[calc(100vh-115px)]"
      />
    </div>
  );
}

export default SidebarImage;
