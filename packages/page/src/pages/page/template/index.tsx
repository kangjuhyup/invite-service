import useTemplateApi from "@/api/template.api";
import { GetTemplatePageResponse } from "@/api/dto/template.dto";
import { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  AspectRatio,
  SegmentedControl,
  Group,
  Stack,
  Text,
  Badge,
  ActionIcon,
  TextInput,
} from "@mantine/core";
import { IconUsers, IconSearch, IconArrowFork } from "@tabler/icons-react";
import { useRouter } from "next/router";
import PresignedImage from "@/components/image/presigned/presigned.image";
import useLetterApi from "@/api/letter.api";

const TemplateListPage = () => {
  const { getTemplatePage, templatePageResponse } = useTemplateApi();
  const { getCategories, categories } = useLetterApi();
  const [category, setCategory] = useState<string>();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    getTemplatePage({
      startAt: 0,
      limit: 100,
      category,
      title: searchQuery,
    });
  }, [category, searchQuery]);

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <Container py="xl">
      <Stack>
        <Stack gap="md">
          <TextInput
            placeholder="템플릿 검색..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
          />
          <Group justify="center">
            <SegmentedControl
              value={"전체"}
              onChange={(value) => setCategory(value)}
              data={[
                { label: "전체", value: "" },
                ...categories.map((c) => ({ label: c, value: c })),
              ]}
            />
          </Group>
        </Stack>

        <Grid>
          {(templatePageResponse?.templates || []).map((template) => (
            <Grid.Col
              key={template.templateId}
              span={{ base: 12, sm: 6, md: 4 }}
            >
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{
                  cursor: "pointer",
                  transition: "transform 0.3s ease",
                  ":hover": {
                    transform: "translateY(-5px)",
                  },
                }}
                onClick={() =>
                  router.push({
                    pathname: "/page/template/[id]",
                    query: { id: template.templateId },
                  })
                }
              >
                <Card.Section>
                  <AspectRatio ratio={34 / 64}>
                    <PresignedImage
                      path={template.thumbnailUrl}
                      height="100%"
                    />
                  </AspectRatio>
                </Card.Section>

                <Group justify="space-between" mt="md">
                  <Badge
                    variant="light"
                    color={
                      template.category === "ANNIVERSARY"
                        ? "pink"
                        : template.category === "WEDDING"
                        ? "blue"
                        : template.category === "BIRTHDAY"
                        ? "yellow"
                        : "gray"
                    }
                  >
                    {template.category || "GENERAL"}
                  </Badge>
                  <Text>{template.title}</Text>
                  <Group gap="xs">
                    <IconArrowFork size={16} style={{ color: "gray" }} />
                    <Text size="sm" c="dimmed">
                      {template.forkCount || 0}
                    </Text>
                  </Group>
                </Group>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
};

export default TemplateListPage;
