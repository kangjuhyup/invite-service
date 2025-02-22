interface VerifyTemplateProps {
  code: string;
  expireMinutes: number;
}

export const verifyTemplate = ({ code, expireMinutes }: VerifyTemplateProps): string => {
  return `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <h1 style="color: #1a73e8; margin-bottom: 20px;">Invite 이메일 인증</h1>
      
      <p style="font-size: 16px; line-height: 1.5; color: #202124;">
        안녕하세요,<br>
        Invite 서비스 이메일 인증을 위한 인증코드입니다.
      </p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <h2 style="color: #202124; margin: 0; font-size: 24px;">${code}</h2>
      </div>
      
      <p style="font-size: 14px; color: #5f6368; margin-top: 20px;">
        * 이 인증코드는 ${expireMinutes}분 후에 만료됩니다.<br>
        * 본인이 요청하지 않은 경우 이 메일을 무시하셔도 됩니다.
      </p>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #dadce0;">
        <p style="font-size: 12px; color: #5f6368; margin: 0;">
          본 메일은 발신전용입니다.
        </p>
      </div>
    </div>
  `;
};
