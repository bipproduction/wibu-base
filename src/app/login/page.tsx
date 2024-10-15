/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { apies, pages } from "@/lib/routes";
import {
  Button,
  Card,
  Container,
  Group,
  PasswordInput,
  Stack,
  TextInput,
  Title
} from "@mantine/core";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useWibuRef } from "@/lib/useRefWibu";

export default function Page() {
  const ref = useRef<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { value, wibuNext, empty, error } = useWibuRef({
    initialValue: {
      email: "",
      password: ""
    },
    initialRef: ref
  });

  async function onSubmit() {
    try {
      setLoading(true);
      if (empty) {
        return alert("Please fill all the fields");
      }

      const res = await fetch(apies["/api/login"], {
        method: "POST",
        body: JSON.stringify({
          data: value
        })
      });

      if (res.ok) {
        return router.replace(pages["/user"]);
      }

      return alert(await res.text());
    } catch (error) {
      console.log(error);
    } finally {

      setLoading(false);
    }
  }
  return (
    <Stack>
      <Container
        w={{
          base: "100%",
          sm: "400px",
          md: "400px",
          lg: "400px",
          xl: "400px"
        }}
      >
        <Card>
          <Stack>
            <Title order={3}>Login</Title>
            <TextInput
              placeholder="example: 0t3I5@example.com"
              label="email"
              {...wibuNext("email")}
              // value={loginForm.email}
            />
            <PasswordInput
              placeholder="********"
              label="password"
              {...wibuNext("password")}
              // value={loginForm.password}
            />
            <Group justify="right">
              <Button
                size="compact-xs"
                variant="transparent"
                component={Link}
                href={pages["/register"]}
              >
                register
              </Button>
            </Group>
            <Button
              loading={loading}
              disabled={loading || empty || error !== null}
              onClick={onSubmit}
            >
              Login
            </Button>
          </Stack>
        </Card>
      </Container>
    </Stack>
  );
}
