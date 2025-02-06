import useUserApi from "@/api/user.api";
import PresignedImage from "@/components/image/presigned/presigned.image";
import {
  Container,
  Text,
  Avatar,
  Group,
  Paper,
  Stack,
  Button,
  Modal,
  TextInput,
  FileInput,
} from "@mantine/core";
import { IconEdit, IconUpload, IconUser } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);
  const [nickName, setNickName] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setNickName(profile.nickName || "");
    }
  }, [profile]);

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

      <Group gap="md" mb="xl" grow>
        <Button
          h={150}
          onClick={() => router.push("/page/letter")}
          variant="light"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text size="xl" fw={700}>
            내 초대장 보러가기
          </Text>
        </Button>
        <Button
          h={150}
          onClick={() => router.push("/page/template")}
          variant="light"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text size="xl" fw={700}>
            템플릿 보러가기
          </Text>
        </Button>
      </Group>

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
    </Container>
  );
};

export default ProfilePage;
