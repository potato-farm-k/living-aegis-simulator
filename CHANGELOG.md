# Changelog

## Unreleased

### Added

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

- 루트 simulator 런처 화면의 제목 크기, 설명 문구, simulator 링크 문구를 정리
- `lunar-view-framing-simulator` control 순서, 화면 font, 지구 확대율 preset을 정리
- 이후 독립 simulator 추가를 위한 repository-level 구조 정리
- README, simulation 문서, `docs/` 메모를 한국어 중심으로 정리
- 루트 `index.html`의 사용자 안내 문구를 한국어 중심으로 조정
- `DECISION_LOG.md`에 내부 문서 언어 정책 기록
