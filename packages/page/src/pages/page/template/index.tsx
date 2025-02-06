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
import { IconUsers, IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/router";
import PresignedImage from "@/components/image/presigned/presigned.image";

type Category = "ALL" | "WEDDING" | "BIRTHDAY" | "ANNIVERSARY" | "GENERAL";

const TemplateListPage = () => {
  const { getTemplatePage, templatePageResponse } = useTemplateApi();
  const [category, setCategory] = useState<Category>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    getTemplatePage({ 
      startAt: 0, 
      limit: 100,
      category: category === "ALL" ? undefined : category
    });
  }, [category]);

  const filteredTemplates = (templatePageResponse?.templates || []).filter(
    (template) =>
      searchQuery === "" ||
      template.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            value={category}
            onChange={(value) => setCategory(value as Category)}
            data={[
              { label: "전체", value: "ALL" },
              { label: "웨딩", value: "WEDDING" },
              { label: "생일", value: "BIRTHDAY" },
              { label: "기념일", value: "ANNIVERSARY" },
              { label: "일반", value: "GENERAL" },
            ]}
          />
          </Group>
        </Stack>

        <Grid>
          {filteredTemplates.map((template) => (
            <Grid.Col key={template.templateId} span={{ base: 12, sm: 6, md: 4 }}>
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
                  <AspectRatio ratio={34/64}>
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
                  <Group gap="xs">
                    <IconUsers size={16} style={{ color: "gray" }} />
                    <Text size="sm" c="dimmed">
                      {template.usedCount || 0}
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
