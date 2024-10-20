"use client";
import {
  Button,
  Card,
  Divider,
  Group,
  Radio,
  Stack,
  TextInput
} from "@mantine/core";
import { useState } from "react";
import { Push } from "wibu";

export default function Page() {
  const { subscription, message } = Push.usePushNotification();
  if (!subscription) return <Stack>Not found | Not Subscribe</Stack>;
  return (
    <Stack p={"lg"}>
      <pre
        style={{
          lineBreak: "anywhere",
          wordBreak: "break-word",
          textWrap: "wrap"
        }}
      >
        {subscription.endpoint}
      </pre>
      <Divider />
      <SendNotification endpoint={subscription.endpoint} />
      <pre>{JSON.stringify(message || null, null, 2)}</pre>
    </Stack>
  );
}

function SendNotification({ endpoint }: { endpoint: string }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    body: "",
    variant: "data"
  });
  async function onSend() {
    if (!form.title || !form.body || !form.variant)
      return alert("Please fill all the fields");
    setLoading(true);
    await Push.sendPushNotificationClient({
      data: {
        endpoint: endpoint,
        body: form.body,
        title: form.title,
        link: "https://www.google.com",
        variant: form.variant as "data" | "notification"
      }
    }).catch((e) => {
      console.error(e);
    });
    setLoading(false);
  }
  return (
    <Card>
      <Stack>
        <pre>{JSON.stringify(form, null, 2)}</pre>
        <TextInput
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          label="Title"
        />
        <TextInput
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          label="Body"
        />
        <Radio.Group
          value={form.variant}
          label="Variant"
          description="Select variant"
          p={"md"}
          onChange={(e) => setForm({ ...form, variant: e })}
        >
          <Group>
            <Radio value="data" label="Data" />
            <Radio value="notification" label="Notification" />
          </Group>
        </Radio.Group>
        <Group justify="end">
          <Button loading={loading} onClick={onSend}>
            Send
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
