import { NotFound } from "@/components/NotFound/NotFound";
import { Center } from "@mantine/core";

export function NotFoundPage() {
  return (
    <Center mih="calc(100vh - 100px)" py="md">
      <NotFound />
    </Center>
  );
}