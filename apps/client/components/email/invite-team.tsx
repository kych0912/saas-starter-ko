import {
  Button,
  Container,
  Head,
  Html,
  Preview,
  Text,
  Hr,
} from "@react-email/components";
import { type Team } from "@/lib/db/schema";
import EmailLayout from "./layout";
import app from "@/data/app";

interface TeamInviteEmailProps {
  team: Team;
  invitationLink: string;
  subject: string;
}

const TeamInviteEmail = ({
  team,
  invitationLink,
  subject,
}: TeamInviteEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <EmailLayout>
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          팀 초대가 도착했습니다!
        </Text>

        <Text className="text-gray-700 mb-4">안녕하세요!</Text>

        <Text className="text-gray-700 mb-4">
          <strong>{team.name}</strong> 팀에서 {app.name}에 함께 참여해주세요
        </Text>

        <Container className="text-center mb-6">
          <Button
            href={invitationLink}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg text-base"
          >
            팀에 합류하기
          </Button>
        </Container>

        <Hr className="border-gray-200 my-6" />

        <Text className="text-sm text-gray-600 mb-2">
          <strong>중요한 안내사항:</strong>
        </Text>
        <Text className="text-sm text-gray-600 mb-2">
          • 초대 링크는 본인만 사용하시기 바랍니다
        </Text>
        <Text className="text-sm text-gray-600 mb-4">
          • 초대를 받지 못하셨다면 팀 관리자에게 문의해주세요
        </Text>

        <Text className="text-sm text-gray-500 mt-6">
          이 메일이 잘못 전달된 것 같다면 무시하셔도 됩니다.
        </Text>
      </EmailLayout>
    </Html>
  );
};

export default TeamInviteEmail;
