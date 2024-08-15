import PrivacyPage from "@/componentPages/PrivacyPage";

type Props = {};
export default function page({}: Props) {
  return (
    <PrivacyPage
      companyName="PurposeFinder.ai"
      companyEmail="info@ignitechannel.com"
      companyAddress={"30765 Pacific Coast Hwy #354"}
      companyLocation={"Malibu, CA"}
      updatedAt={"November 1, 2022"}
    />
  );
}
