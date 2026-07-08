# Changelog

## Unreleased

### Added

- 지구-달 실제 크기, 평균 거리와 이동시간 체감을 단순하게 비교하는 `earth-moon-scale-time-simulator` 추가
- 이동체 speed preset, Custom Speed, time warp, 방향 전환, loop/replay control과 compact 정보 패널 추가
- `prototype-07`의 위협 접근 방향 문제를 옆면 단면에서 검증하는 `lunar-threat-side-profile-simulator` 추가
- source, boost, trajectory, Impact Warning Corridor, Lunar Defense Zone과 Visual Contact / Surface Occluded 상태 비교 기능 추가
- `lunar-view-framing-simulator`의 1차 기본 구도 후보값을 문서에 기록
- `lunar-view-framing-simulator`의 `view-offset-mode` 2차 개선 후보를 문서에 등록
- `orbital-attack-source-simulator`를 다음 후보 simulator로 문서에 등록
- `lunar-view-framing-simulator` 2D 달 표면 화면 구도 검증 simulator 추가
- 지구 세로 위치, 달 표면 하단 비중, 지구 확대율 조정 control과 1x / 3x / 5x / 7x / 10x preset 추가
- 루트 simulator 런처에서 `lunar-view-framing-simulator` 연결
- Codex 반복 작업 지침을 담은 `AGENTS.md` 추가
- 초기 simulator lab scaffold 추가
- 루트 simulator 런처 페이지 추가
- 기존 `earth-moon-travel-simulator`를 루트 런처에서 연결
- simulation 추적, 메모, 결정 기록을 위한 문서 추가
- Earth-Moon scale, field-of-view, light-delay 메모를 위한 공용 `docs/` 폴더 추가

### Changed

- `SIMULATION_NOTES.md`에 Threat Type Draft v0.1의 계열별 simulation 검증 질문 추가
- `AGENTS.md`에 세 Living Aegis 저장소의 공통 문서 업데이트 원칙 추가
- 루트 simulator 런처 목록을 각 simulator 생성 시점 기준 최신순으로 정렬
- `earth-moon-scale-time-simulator` 정보 패널을 category별 가로형 layout으로 정리하고 상세 축척값을 기본 노출
- 중복 Progress 표시를 우측 `Route progress`로 통합하고 Earth/Moon 표시 위치를 아래로 조정
- `lunar-threat-side-profile-simulator`에 순차 자동 반복 발사, active/pending 설정 구분과 compact 검증 조건 UI 적용
- 루트 simulator 런처 화면의 제목 크기, 설명 문구, simulator 링크 문구를 정리
- `lunar-view-framing-simulator` control 순서, 화면 font, 지구 확대율 preset을 정리
- 이후 독립 simulator 추가를 위한 repository-level 구조 정리
- README, simulation 문서, `docs/` 메모를 한국어 중심으로 정리
- 루트 `index.html`의 사용자 안내 문구를 한국어 중심으로 조정
- `DECISION_LOG.md`에 내부 문서 언어 정책 기록
