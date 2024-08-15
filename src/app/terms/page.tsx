import TermsPage from "@/componentPages/TermsPage";

type Props = {};
export default function Terms({}: Props) {
  return (
    <TermsPage
      companyName={"PurposeFinder.ai"}
      companyEmail={"info@ignitechannel.com"}
      privacyLink={"/privacy"}
      updatedAt={"November 1, 2022"}
    />
  );
}
