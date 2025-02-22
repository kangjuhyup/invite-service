#!/bin/bash

# Doppler에서 환경변수를 가져와서 xcconfig 형식으로 변환
doppler secrets download --no-file --format=json | \
jq -r 'to_entries | map("\(.key) = \(.value)") | .[]' > tmp.xcconfig

# 파일이 생성되었는지 확인
if [ -f "tmp.xcconfig" ]; then
    echo "환경변수가 성공적으로 내보내졌습니다."
else
    echo "환경변수 내보내기 실패"
    exit 1
fi
