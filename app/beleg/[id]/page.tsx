import BelegView from "@/components/BelegView";

export default async function BelegPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BelegView id={id} />;
}
