import { CreateSubForm } from "@/components/forms/create-sub-form";

export default async function CreateSub() {
  return (
    <main className="container flex flex-col gap-4 mt-10">
      <CreateSubForm />
    </main>
  );
}
