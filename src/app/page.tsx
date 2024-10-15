import { pages } from "@/lib/routes";
import {
  Button,
  Card,
  Center,
  Container,
  Flex,
  Stack,
  Title
} from "@mantine/core";
import Link from "next/link";

export default function Home() {
  return (
    <Container maw={720}>
      <Card>
        <Stack>
          <Center>
            <Title>Wibu Base</Title>
          </Center>
          <Flex align={"center"} justify={"space-between"}>
            <Button
              variant="transparent"
              size="compact-xs"
              component={Link}
              href={pages["/login"]}
            >
              Login
            </Button>
            <Button
              variant="transparent"
              size="compact-xs"
              component={Link}
              href={pages["/register"]}
            >
              Register
            </Button>
          </Flex>
        </Stack>
      </Card>
    </Container>
  );
}
