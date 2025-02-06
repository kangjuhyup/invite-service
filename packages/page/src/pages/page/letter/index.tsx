import useLetterApi from "@/api/letter.api";
import { Carousel, useAnimationOffsetEffect } from "@mantine/carousel";
import { useEffect } from "react";
import {
  AspectRatio,
  Badge,
  Card,
  Container,
  Stack,
  Text,
  Group,
  Menu,
  ActionIcon,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useShare } from "@/hooks/share.hook";
import useTemplateApi from "@/api/template.api";
import {
  IconEye,
  IconUsers,
  IconMessageCircle,
  IconDotsVertical,
  IconEdit,
  IconShare,
  IconTrash,
  IconCopy,
  IconArrowRight,
  IconArrowLeft,
} from "@tabler/icons-react";
import PresignedImage from "@/components/image/presigned/presigned.image";
import { useRouter } from "next/router";

const LetterListPage = () => {
  const { getLetterPage, letterPage, deleteLetter } = useLetterApi();
  const { handleKakaoShare } = useShare();
  const { createTemplate } = useTemplateApi();
  const router = useRouter();

  const handleShare = async (id: number) => {
    const letter = letterPage?.items.find((item) => item.id === id);
    if (!letter) return;

    handleKakaoShare({
      title: "초대장이 도착했습니다!",
      description: letter.title,
      imageUrl: letter.thumbnail,
      url:
        `${window.location.origin}/page/letter/${id}` +
        (letter.publicYn === false && letter.password
          ? `?token=${letter.password}&isView=true`
          : "?isView=true"),
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteLetter(id);
      await getLetterPage(100, 0);
      notifications.show({
        title: "삭제 완료",
        message: "초대장이 성공적으로 삭제되었습니다.",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "오류",
        message: "초대장 삭제 중 오류가 발생했습니다.",
        color: "red",
      });
    }
  };

  const handleCreateTemplate = async (id: number) => {
    try {
      await createTemplate({
        letterId: id,
      });
      notifications.show({
        title: "템플릿 생성 완료",
        message: "템플릿이 성공적으로 생성되었습니다.",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "오류",
        message: "템플릿 생성 중 오류가 발생했습니다.",
        color: "red",
      });
    }
  };

  useEffect(() => {
    getLetterPage(100, 0);
  }, []);

  return (
    <Container py={"xl"}>
      <Carousel
        slideSize={{ base: "100%", sm: "50%", md: "33.333333%" }}
        slideGap="md"
        align="start"
        slidesToScroll={1}
        mah={"60vh"}
        nextControlIcon={
          <ActionIcon variant="filled" color="gray" size="lg" radius="xl">
            <IconArrowRight style={{ width: "60%", height: "60%" }} />
          </ActionIcon>
        }
        previousControlIcon={
          <ActionIcon variant="filled" color="gray" size="lg" radius="xl">
            <IconArrowLeft style={{ width: "60%", height: "60%" }} />
          </ActionIcon>
        }
        styles={{
          control: {
            "&[data-inactive]": {
              opacity: 0,
              cursor: "default",
            },
          },
        }}
      >
        {letterPage?.items.map((letter) => (
          <Carousel.Slide key={letter.id}>
            <Card
              shadow="xl"
              padding="lg"
              radius="md"
              withBorder
              style={{
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                transition: "all 0.3s ease",
                ":hover": {
                  transform: "scale(1.3)",
                  zIndex: 1,
                },
              }}
              onClick={() =>
                router.push({
                  pathname: "/page/letter/[id]",
                  query: { id: letter.id },
                })
              }
            >
              <Card.Section style={{ position: "relative" }}>
                <div
                  style={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}
                >
                  <Menu shadow="md" width={200} position="bottom-end">
                    <Menu.Target>
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        onClick={(e: any) => {
                          e.stopPropagation();
                        }}
                      >
                        <IconDotsVertical
                          style={{ width: "70%", height: "70%" }}
                          stroke={1.5}
                        />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={
                          <IconEdit style={{ width: "14px", height: "14px" }} />
                        }
                        onClick={(e: any) => {
                          e.stopPropagation();
                          router.replace(`/page/letter/modify/${letter.id}`);
                        }}
                      >
                        수정하기
                      </Menu.Item>
                      <Menu.Item
                        leftSection={
                          <IconShare
                            style={{ width: "14px", height: "14px" }}
                          />
                        }
                        onClick={(e: any) => {
                          e.stopPropagation();
                          handleShare(letter.id);
                        }}
                      >
                        공유하기
                      </Menu.Item>
                      <Menu.Item
                        color="red"
                        leftSection={
                          <IconTrash
                            style={{ width: "14px", height: "14px" }}
                          />
                        }
                        onClick={(e: any) => {
                          e.stopPropagation();
                          handleDelete(letter.id);
                        }}
                      >
                        삭제하기
                      </Menu.Item>
                      <Menu.Item
                        color="blue"
                        leftSection={
                          <IconCopy style={{ width: "14px", height: "14px" }} />
                        }
                        onClick={(e: any) => {
                          e.stopPropagation();
                          handleCreateTemplate(letter.id);
                        }}
                      >
                        탬플릿 생성하기
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </div>
                <AspectRatio ratio={34 / 64}>
                  <PresignedImage path={letter.thumbnail} height={"50vh"} />
                </AspectRatio>
              </Card.Section>

              <Stack
                gap="xs"
                mt="md"
                style={{ flex: 1, justifyContent: "space-between" }}
              >
                <Stack gap="xs">
                  <Badge
                    variant="light"
                    color={
                      letter.category === "ANNIVERSARY"
                        ? "pink"
                        : letter.category === "WEDDING"
                        ? "blue"
                        : letter.category === "BIRTHDAY"
                        ? "yellow"
                        : "gray"
                    }
                  >
                    {letter.category || "GENERAL"}
                  </Badge>
                  <Text
                    fw={700}
                    size="xl"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {letter.title || "Untitled Letter"}
                  </Text>
                  <Text
                    c="dimmed"
                    size="sm"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {letter.body.slice(0, 100) || "No description available"}
                  </Text>
                </Stack>
                <Group gap="xl" justify="center">
                  <Group gap="xs">
                    <IconEye size={20} style={{ color: "gray" }} />
                    <Text size="md" c="dimmed">
                      {letter.viewCount}
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <IconUsers size={20} style={{ color: "gray" }} />
                    <Text size="md" c="dimmed">
                      {letter.attendCount}
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <IconMessageCircle size={20} style={{ color: "gray" }} />
                    <Text size="md" c="dimmed">
                      {letter.commentCount}
                    </Text>
                  </Group>
                </Group>
              </Stack>
            </Card>
          </Carousel.Slide>
        ))}
      </Carousel>
    </Container>
  );
};

export default LetterListPage;
