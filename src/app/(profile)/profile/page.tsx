import { Container } from "@/components/layout/container";
import { UserProfile } from "@clerk/nextjs";

export default function MyProfile() {
  return (
    <Container>
      <UserProfile />
    </Container>
  );
}
