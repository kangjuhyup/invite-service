export const LetterCategory = {
    WEDDING: 'WED',           // 결혼식
    BIRTHDAY: 'BDAY',         // 생일
    ANNIVERSARY: 'ANNIV',     // 기념일
    PARTY: 'PTY',             // 파티
    GRADUATION: 'GRAD',       // 졸업
    BABY_SHOWER: 'BABY',      // 베이비 샤워
    HOUSEWARMING: 'HOUSE',    // 집들이
    CORPORATE: 'CORP',        // 회사 행사
    RETIREMENT: 'RETIRE',     // 은퇴
    FUNERAL: 'FUN',           // 장례식
  } as const;
  
  export type LetterCategory = typeof LetterCategory[keyof typeof LetterCategory];
  