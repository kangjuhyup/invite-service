import useLetterApi from "@/api/letter.api";
import useUserApi from "@/api/user.api";
import PresignedImage from "@/components/image/presigned/presigned.image";
import {
  Container,
  Grid,
  Card,
  Text,
  AspectRatio,
  Avatar,
  Group,
  Paper,
  Stack,
  Button,
  Collapse,
  Title,
  Transition,
  Menu,
  ActionIcon,
  Modal,
  TextInput,
  FileInput,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
  IconDotsVertical,
  IconEdit,
  IconShare,
  IconTrash,
  IconUpload,
  IconUser,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useShare } from "@/hooks/share.hook";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import useImageApi from "@/api/image.api";

const ProfilePage = () => {
  const router = useRouter();
  const {
    profile,
    getProfile,
    updateProfile,
    prepareUrls,
    prepareProfileImage,
    validateProfileImage,
  } = useUserApi();
  const { putImageToPresignedUrl } = useImageApi();
  const { letterPage, getLetterPage, deleteLetter } = useLetterApi();
  const { handleKakaoShare } = useShare();
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);
  const [nickName, setNickName] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);

  useEffect(() => {
    getProfile();
    getLetterPage(100, 0);
  }, []);

  useEffect(() => {
    if (profile) {
      setNickName(profile.nickName || "");
    }
  }, [profile]);

  const [gridOpened, setGridOpened] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (letterPage?.items) {
      setIsVisible(false);
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [letterPage?.items]);

  const refreshLetters = async () => {
    await getLetterPage(100, 0);
  };

  const handleDelete = async (letterId: number) => {
    await deleteLetter(letterId);
    await refreshLetters();
  };

  const handleShare = (letterId: number) => {
    const letter = letterPage?.items.find((item) => item.id === letterId);
    if (!letter) return;

    handleKakaoShare({
      title: "초대장이 도착했습니다!",
      description: letter.title,
      imageUrl: letter.thumbnail,
      url:
        `${window.location.origin}/page/letter/${letterId}` +
        (letter.publicYn === false && letter.password
          ? `?token=${letter.password}&isView=true`
          : "?isView=true"),
    });
  };

  useEffect(() => {
    uploadProfileImage();
  }, [prepareUrls]);

  const uploadProfileImage = async () => {
    if (!prepareUrls || !profileImage) return;
    try {
      await putImageToPresignedUrl(prepareUrls.url, profileImage, {
        type: "image",
        width: "100",
        height: "100",
        session: prepareUrls.sessionKey,
      });
      await validateProfileImage();
      await getProfile();
      closeEditModal();
      notifications.show({
        title: "프로필 업데이트",
        message: "프로필이 성공적으로 업데이트되었습니다.",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "오류",
        message: "프로필이 성공적으로 업데이트되지 않었습니다.",
        color: "red",
      });
    }
  };

  const handleProfileUpdate = async () => {
    try {
      // 닉네임 업데이트
      await updateProfile({ nickName });

      // 프로필 이미지 업데이트
      if (profileImage) {
        await prepareProfileImage();
      }
    } catch (error) {
      notifications.show({
        title: "오류",
        message: "프로필 업데이트 중 오류가 발생했습니다.",
        color: "red",
      });
    }
  };

  return (
    <Container size="lg" py="xl">
      <Paper shadow="sm" p="md" withBorder mb="xl">
        <Group justify="space-between">
          <Group>
            {profile?.profileImage ? (
              <PresignedImage
                width={100}
                height={100}
                path={profile?.profileImage}
              />
            ) : (
              <Avatar
                size="xl"
                radius="xl"
                src={profile?.profileImage}
                color="blue"
              >
                {profile?.nickName?.charAt(0)}
              </Avatar>
            )}

            <Stack gap="xs">
              <Text size="xl" fw={700}>
                {profile?.nickName}
              </Text>
              <Text size="sm" c="dimmed">
                {profile?.email}
              </Text>
            </Stack>
          </Group>
          <Button leftSection={<IconEdit size={14} />} onClick={openEditModal}>
            프로필 수정
          </Button>
        </Group>
      </Paper>

      <Modal
        opened={editModalOpened}
        onClose={closeEditModal}
        title="프로필 수정"
      >
        <Stack>
          <TextInput
            label="닉네임"
            value={nickName}
            onChange={(event) => setNickName(event.currentTarget.value)}
            placeholder="닉네임을 입력하세요"
            leftSection={<IconUser size={14} />}
          />
          <FileInput
            label="프로필 이미지"
            placeholder="이미지를 선택하세요"
            accept="image/*"
            value={profileImage}
            onChange={setProfileImage}
            leftSection={<IconUpload size={14} />}
            clearable
          />
          <Button onClick={handleProfileUpdate}>저장</Button>
        </Stack>
      </Modal>

      <Group justify="space-between" align="center">
        <Title>내 초대장</Title>
        <Button
          variant="subtle"
          onClick={() => setGridOpened((o) => !o)}
          leftSection={
            gridOpened ? (
              <IconChevronUp size={16} />
            ) : (
              <IconChevronDown size={16} />
            )
          }
        >
          {gridOpened ? "접기" : "펼치기"}
        </Button>
      </Group>

      <Collapse
        in={gridOpened}
        transitionDuration={400}
        transitionTimingFunction="ease"
      >
        <Grid pt="md" gutter="md">
          {letterPage?.items.map((letter, index) => (
            <Grid.Col key={letter.id} span={{ base: 12, sm: 6, md: 4 }}>
              <Transition
                mounted={isVisible}
                transition="fade"
                duration={400}
                timingFunction="ease"
              >
                {(styles) => (
                  <Card
                    style={styles}
                    shadow="sm"
                    padding="md"
                    radius="md"
                    withBorder
                  >
                    <Card.Section
                      onClick={() =>
                        router.push({
                          pathname: "/page/letter/[id]",
                          query: { id: letter.id },
                        })
                      }
                    >
                      <AspectRatio ratio={16 / 9}>
                        <PresignedImage path={letter.thumbnail} />
                      </AspectRatio>
                    </Card.Section>

                    <Group justify="space-between" mt="md">
                      <Text fw={500} size="lg">
                        {letter.title || "Untitled Letter"}
                      </Text>
                      <Menu shadow="md" width={200} position="bottom-end">
                        <Menu.Target>
                          <ActionIcon variant="subtle" color="gray">
                            <IconDotsVertical
                              style={{ width: "70%", height: "70%" }}
                              stroke={1.5}
                            />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={
                              <IconEdit
                                style={{ width: "14px", height: "14px" }}
                              />
                            }
                            onClick={() =>
                              router.replace(`/page/letter/modify/${letter.id}`)
                            }
                          >
                            수정하기
                          </Menu.Item>
                          <Menu.Item
                            leftSection={
                              <IconShare
                                style={{ width: "14px", height: "14px" }}
                              />
                            }
                            onClick={() => {
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
                            onClick={() => {
                              handleDelete(letter.id);
                            }}
                          >
                            삭제하기
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </Card>
                )}
              </Transition>
            </Grid.Col>
          ))}
        </Grid>
      </Collapse>
    </Container>
  );
};

export default ProfilePage;
